import { NextRequest, NextResponse } from 'next/server';
import { createTypeOfSport, getTypeOfSport } from '@/controllers/user/typeOfsport.controller';

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const response = await createTypeOfSport(req);
        return response;
    }
    catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
};

export const GET = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const response = await getTypeOfSport(req);
        return response;
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
};

