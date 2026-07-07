import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(request) {
    try {
        const userData = await request.json();

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new SignJWT(userData)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('7d') 
            .sign(secret);

        const response = NextResponse.json({ success: true }, { status: 200 });
        
        response.cookies.set({
            name: 'auth_token',
            value: token,
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 
        });

        return response;

    } catch (error) {
        console.error("Session Error:", error);
        return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }
}