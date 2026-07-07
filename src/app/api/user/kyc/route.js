import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
        }

        const phpResponse = await axios.post(`${process.env.PHP_API_BASE_URL}/getKycStatus.php`, {
            userid: userId,
            token: process.env.PHP_STATIC_TOKEN
        });

        const apiPayload = phpResponse.data?.response || phpResponse.data;

        if (String(apiPayload?.status).toLowerCase() === "true" && Array.isArray(apiPayload?.data)) {
            return NextResponse.json({ success: true, kycData: apiPayload.data[0] }, { status: 200 });
        } 
        
        return NextResponse.json({ success: false, message: "Failed to fetch KYC status" }, { status: 400 });

    } catch (error) {
        console.error("KYC Fetch Error:", error.message);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}