import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
    try {
        const { mobile_no } = await request.json();

        const phpResponse = await axios.post(`${process.env.PHP_API_BASE_URL}/self_service_portal_login.php`, {
            mobile_no,
            token: process.env.PHP_STATIC_TOKEN
        });

        return NextResponse.json(phpResponse.data, { status: phpResponse.status });

    } catch (error) {
        console.error("PHP Proxy Error:", error);
        return NextResponse.json({ error: 'Failed to contact server' }, { status: 500 });
    }
}