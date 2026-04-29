import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getPrice(charCount: number): { amount: number; label: string } {
  if (charCount <= 2000) return { amount: 500, label: "〜2000文字" };
  return { amount: 1000, label: "〜5000文字" };
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe APIキーが設定されていません" }, { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { text } = await request.json();

    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "テキストを入力してください" }, { status: 400 });
    }

    if (text.length <= 100) {
      return NextResponse.json({ error: "100文字以下は無料で生成できます" }, { status: 400 });
    }

    if (text.length > 5000) {
      return NextResponse.json({ error: "5000文字以内で入力してください" }, { status: 400 });
    }

    const { amount, label } = getPrice(text.length);
    const origin = request.headers.get("origin") ?? "";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name: `音声生成（${label}）`,
              description: `${text.length}文字`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
