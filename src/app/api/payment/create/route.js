import { NextResponse } from 'next/server';
import { createHdfcSession, createCashfreeOrder } from '@/lib/paymentHelpers';

export async function POST(request) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

    try {
        const { orderId, amount, customerId, customerPhone, customerEmail, gateway, payment_filter, payment_methods_filters } = await request.json();

        let paymentData;

        if (gateway === 'CASHFREE') {
            paymentData = await createCashfreeOrder({
                orderId,
                amount,
                customerId,
                phone: customerPhone || "9999999999",
                email: customerEmail || "b2b@example.com",
                returnUrl: `${baseUrl}/checkout/status?order_id=${orderId}&gateway=CASHFREE`,
                payment_methods_filters
            });
        } else {
            paymentData = await createHdfcSession({
                orderId,
                amount,
                customerId,
                phone: customerPhone,
                email: customerEmail,
                returnUrl: `${baseUrl}/checkout/status?order_id=${orderId}&gateway=HDFC`,
                payment_filter,
            });
        }

        return NextResponse.json({
            success: true,
            paymentUrl: paymentData.paymentUrl,
            sdkPayload: paymentData.sdkPayload,
            sessionId: paymentData.sessionId
        }, { status: 200 });

    } catch (error) {
        console.error("Payment Gateway Error:", error.message);
        return NextResponse.json({
            success: false,
            message: error.message || "Failed to initialize payment gateway"
        }, { status: 400 });
    }
}