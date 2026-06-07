import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status") || "published";
  const limit = searchParams.get("limit") || "100";

  const apiKey = process.env.PARAGRAPH_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "PARAGRAPH_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  try {
    const url = `https://public.api.paragraph.com/api/v1/posts?status=${status}&limit=${limit}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: `Paragraph API responded with status ${res.status}`, details: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch posts from Paragraph" },
      { status: 500 }
    );
  }
}
