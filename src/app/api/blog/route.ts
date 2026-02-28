import { NextResponse } from "next/server";
import { getBlogPosts } from "@/lib/blog";

export async function GET() {
  const posts = getBlogPosts();
  return NextResponse.json(posts);
}
