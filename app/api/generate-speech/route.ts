import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const CHUNK_SIZE = 2400;

function splitTextIntoChunks(text: string): string[] {
  if (text.length <= CHUNK_SIZE) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > CHUNK_SIZE) {
    const searchArea = remaining.substring(CHUNK_SIZE - 200, CHUNK_SIZE);
    const lastBreak = Math.max(
      searchArea.lastIndexOf("。"),
      searchArea.lastIndexOf("！"),
      searchArea.lastIndexOf("？"),
      searchArea.lastIndexOf("…"),
      searchArea.lastIndexOf("\n"),
      searchArea.lastIndexOf("."),
      searchArea.lastIndexOf("!"),
      searchArea.lastIndexOf("?"),
    );

    const splitAt =
      lastBreak !== -1 ? CHUNK_SIZE - 200 + lastBreak + 1 : CHUNK_SIZE;
    chunks.push(remaining.substring(0, splitAt));
    remaining = remaining.substring(splitAt).replace(/^\s+/, "");
  }

  if (remaining.length > 0) chunks.push(remaining);
  return chunks;
}


async function generateChunk(
  chunk: string,
  voiceId: string,
  modelId: string,
  voiceSettings: object,
  apiKey: string,
): Promise<ArrayBuffer> {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text: chunk,
        model_id: modelId,
        voice_settings: voiceSettings,
      }),
    },
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`音声生成に失敗しました: ${error}`);
  }

  return res.arrayBuffer();
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ElevenLabs APIキーが設定されていません" },
      { status: 500 },
    );
  }

  const {
    text,
    session_id,
    voiceId,
    modelId,
    stability,
    similarityBoost,
    style,
    speed,
  } = await request.json();

  if (text && text.length > 100) {
    if (!session_id) {
      return NextResponse.json({ error: "決済が必要です" }, { status: 403 });
    }
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe設定エラー" }, { status: 500 });
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "決済が完了していません" },
        { status: 403 },
      );
    }
  }

  if (!text || text.trim() === "") {
    return NextResponse.json(
      { error: "テキストを入力してください" },
      { status: 400 },
    );
  }

  const targetVoiceId = voiceId || process.env.ELEVENLABS_VOICE_ID;
  if (!targetVoiceId) {
    return NextResponse.json(
      { error: "ボイスIDが指定されていません" },
      { status: 400 },
    );
  }

  const voiceSettings = {
    stability: stability ?? 0.5,
    similarity_boost: similarityBoost ?? 0.75,
    style: style ?? 0,
    use_speaker_boost: true,
    speed: speed ?? 0.7,
  };
  const targetModelId = modelId || "eleven_v3";

  try {
    const chunks = splitTextIntoChunks(text);
    const buffers = await Promise.all(
      chunks.map((chunk) =>
        generateChunk(
          chunk,
          targetVoiceId,
          targetModelId,
          voiceSettings,
          apiKey,
        ),
      ),
    );

    const totalLength = buffers.reduce((sum, b) => sum + b.byteLength, 0);
    const merged = new Uint8Array(totalLength);
    let offset = 0;
    for (const buf of buffers) {
      merged.set(new Uint8Array(buf), offset);
      offset += buf.byteLength;
    }

    return new NextResponse(merged.buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": totalLength.toString(),
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
