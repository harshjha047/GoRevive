import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
        }

        const phpResponse = await axios.post(`${process.env.PHP_API_BASE_URL}/getorder_list_invoice_item_wise.php`, {
            challan_no: userId,
            token: process.env.PHP_STATIC_TOKEN 
        });

        const apiPayload = phpResponse.data?.response || phpResponse.data;

        if (String(apiPayload?.status).toLowerCase() === "true" && Array.isArray(apiPayload?.data)) {
            return NextResponse.json({ success: true, orders: apiPayload.data }, { status: 200 });
        } 
        
        return NextResponse.json({ success: false, message: apiPayload?.message || "No orders found." }, { status: 404 });

    } catch (error) {
        console.error("Orders Fetch Error:", error.message);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}