import { login } from "@/controllers/user/user.controller";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
export const POST = async (req: NextRequest) => {
  try {
    const response = await login(req);
    return response;
  } catch (error) {
    console.error('Error in POST /api/user/login:', error);
    return NextResponse.json(
      { error: 'Internal server error', details:error },
      { status: 500 }
    );
  }
};