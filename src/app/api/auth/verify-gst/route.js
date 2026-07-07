import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
    try {
        const { gst_no } = await request.json();

        const phpResponse = await axios.post(`${process.env.PHP_API_BASE_URL}/gst_details.php`, {
            gst_no,
            token: process.env.PHP_STATIC_TOKEN // Injected securely!
        });

        return NextResponse.json(phpResponse.data, { status: phpResponse.status });
    } catch (error) {
        console.error('GST Proxy Error:', error.response?.data || error.message);
        const status = error.response?.status || 500;
        const errorMessage = error.response?.data || { error: 'Internal Server Error' };
        return NextResponse.json(errorMessage, { status });
    }
}