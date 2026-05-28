import { NextResponse } from "next/server";

const maxUploadBytes = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Upload a file field named file." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image uploads are accepted." }, { status: 415 });
  }

  if (file.size > maxUploadBytes) {
    return NextResponse.json({ error: "Images must be 5MB or smaller." }, { status: 413 });
  }

  return NextResponse.json({
    ok: true,
    upload: {
      id: `upload-${Date.now()}`,
      fileName: file.name,
      contentType: file.type,
      size: file.size,
      url: null,
      storage: "mock-local",
    },
  });
}
