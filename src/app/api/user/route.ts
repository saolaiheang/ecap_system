import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '../../../controllers/user/user.controller';

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const response = await createUser(req);
    return response;
  } catch (error) {
    console.error('Error in POST /api/user:', error);
    return NextResponse.json(
      { error: 'Internal server error', details:error },
      { status: 500 }
    );
  }
};