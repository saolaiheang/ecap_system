import { login } from "@/controllers/user/user.controller";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
export const POST = async (req: NextRequest) => {
  try {
    if (req.method !== "POST") {
      return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    const response = await login(email, password);

    return response;
  } catch (error) {
    console.error('Error in POST /api/user/login:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
};