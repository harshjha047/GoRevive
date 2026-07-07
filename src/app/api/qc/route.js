import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const imei = searchParams.get('imei');

        if (!imei) {
            return NextResponse.json({ success: false, message: "IMEI is required" }, { status: 400 });
        }

        const phpResponse = await axios.post(`${process.env.PHP_API_BASE_URL}/get_qc_details.php`, {
            imei: imei,
            token: process.env.PHP_STATIC_TOKEN 
        });

        const apiPayload = phpResponse.data?.response || phpResponse.data;

        if (String(apiPayload?.status).toLowerCase() === "true" && Array.isArray(apiPayload?.data)) {
            return NextResponse.json({ success: true, data: apiPayload.data }, { status: 200 });
        } 
        
        return NextResponse.json({ success: false, message: apiPayload?.message || "No QC record found." }, { status: 404 });

    } catch (error) {
        console.error("QC Fetch Error:", error.message);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}