import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jwt from 'jsonwebtoken';
import { TokenPayload } from '../common/types/user';
import { RoleEnum, RoleType } from '../common/types/index';

// Middleware to protect routes and check roles
export function middleware(request: NextRequest, roles: RoleType[] = [RoleEnum[2]]) {
  const authHeader = request.headers.get('authorization');
  // Optionally, check cookies: const token = request.cookies.get('token')?.value;

  // Check if Authorization header exists and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { message: 'Access denied, no token provided or invalid format' },
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('error: ', 'Access denied, no token provided or invalid format');
    return NextResponse.json(
      { message: 'Access denied, no token provided or invalid format' },
      { status: 401 }
    );
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as TokenPayload;

    // Check role
    if (!roles.includes(decoded.role)) {
      return NextResponse.json(
        { message: 'Forbidden: You do not have the right role' },
        { status: 403 }
      );
    }

    // Attach user to request for downstream use
    const response = NextResponse.next();
    response.headers.set('x-user', JSON.stringify(decoded));
    return response;
  } catch (err) {
    console.log('error: ', err);
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}

// Optionally, specify which routes the middleware applies to
export const config = {
  matcher: ['/api/protected/:path*', '/dashboard/:path*'], // Adjust paths as needed
};