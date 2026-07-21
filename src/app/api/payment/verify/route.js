import { NextResponse } from 'next/server';
import { verifyHdfcOrder, verifyCashfreeOrder } from '@/lib/paymentHelpers';

export async function POST(request) {
    try {
        const { orderId, gateway } = await request.json();

        if (!orderId || !gateway) {
            return NextResponse.json({ success: false, message: "Missing order details" }, { status: 400 });
        }

        let verificationResult;

        if (gateway === 'CASHFREE') {
            verificationResult = await verifyCashfreeOrder(orderId);
        } else if (gateway === 'HDFC') {
            verificationResult = await verifyHdfcOrder(orderId);
        } else if (gateway === 'Wallet' || gateway === 'WALLET') {
            verificationResult = {
                isPaid: true,
                status: "PAID_VIA_WALLET",
                fullData: { payment_method: "Wallet", order_id: orderId }
            };
        } else {
            return NextResponse.json({ success: false, message: "Invalid gateway" }, { status: 400 });
        }

        return NextResponse.json({ 
            success: true, 
            isPaid: verificationResult.isPaid, 
            status: verificationResult.status,
            fullData: verificationResult.fullData
        }, { status: 200 });

    } catch (error) {
        console.error("Payment Verification Error:", error.message);
        return NextResponse.json({ success: false, message: error.message || "Failed to verify payment" }, { status: 500 });
    }
}