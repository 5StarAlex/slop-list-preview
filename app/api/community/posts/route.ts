import { NextResponse } from "next/server";
import { validatePostInput } from "../../../lib/platformValidation";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Invalid post payload." }, { status: 400 });
  }

  const input = payload as {
    title?: unknown;
    body?: unknown;
    imageDataUrl?: unknown;
    imageUrl?: unknown;
    gifUrl?: unknown;
    poll?: unknown;
  };
  const validation = validatePostInput({
    title: typeof input.title === "string" ? input.title : "",
    body: typeof input.body === "string" ? input.body : "",
    hasAttachment: Boolean(input.imageDataUrl || input.imageUrl || input.gifUrl || input.poll),
  });

  if (!validation.ok) {
    return NextResponse.json({ errors: validation.errors }, { status: 422 });
  }

  return NextResponse.json({
    ok: true,
    postId: typeof (payload as { id?: unknown }).id === "string" ? (payload as { id: string }).id : `post-${Date.now()}`,
    storage: "mock-local",
  });
}
