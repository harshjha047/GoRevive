import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; 

export async function POST(request) {
    try {
        const cookieStore = await cookies();

        cookieStore.delete('auth_token'); 
        cookieStore.delete('jwt'); 
        cookieStore.delete('user_data'); 

        return NextResponse.json({ 
            success: true, 
            message: "Successfully logged out and session destroyed." 
        }, { status: 200 });

    } catch (error) {
        console.error("Server Logout Error:", error.message);
        return NextResponse.json({ 
            success: false, 
            message: "Internal server error during logout." 
        }, { status: 500 });
    }
}