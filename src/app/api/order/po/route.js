import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
    try {
        const payload = await request.json();

        const phpResponse = await axios.post(`${process.env.PHP_API_BASE_URL}/POCreate.php`, {
            POJSON: payload,
            token: process.env.PHP_STATIC_TOKEN
        });

        const data = phpResponse.data;
        if (data?.status === "false" || data?.response?.status === "false") {
            return NextResponse.json({ success: false, message: data.message || "Failed to create PO" }, { status: 400 });
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}