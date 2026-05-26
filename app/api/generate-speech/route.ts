import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ElevenLabs APIキーが設定されていません" },
      { status: 500 },
    );
  }

  const { text, session_id, voiceId, modelId, stability, similarityBoost, style, speed } =
    await request.json();

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
      return NextResponse.json({ error: "決済が完了していません" }, { status: 403 });
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

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${targetVoiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: modelId || "eleven_v3",
          voice_settings: {
            stability: stability ?? 0.5,
            similarity_boost: similarityBoost ?? 0.75,
            style: style ?? 0,
            use_speaker_boost: true,
            speed: speed ?? 0.7,
          },
        }),
      },
    );

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json(
        { error: `音声生成に失敗しました: ${error}` },
        { status: res.status },
      );
    }

    const audioBuffer = await res.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
