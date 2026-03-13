import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ElevenLabs APIキーが設定されていません" },
      { status: 500 }
    );
  }

  const { text, voiceId, modelId, stability, similarityBoost, style } =
    await request.json();

  if (!text || text.trim() === "") {
    return NextResponse.json(
      { error: "テキストを入力してください" },
      { status: 400 }
    );
  }

  const targetVoiceId = voiceId || process.env.ELEVENLABS_VOICE_ID;
  if (!targetVoiceId) {
    return NextResponse.json(
      { error: "ボイスIDが指定されていません" },
      { status: 400 }
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
          model_id: modelId || "eleven_multilingual_v2",
          voice_settings: {
            stability: stability ?? 0.5,
            similarity_boost: similarityBoost ?? 0.75,
            style: style ?? 0,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json(
        { error: `音声生成に失敗しました: ${error}` },
        { status: res.status }
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
