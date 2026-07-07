import axios from 'axios';

/**
 * ==========================================
 * HDFC SMARTGATEWAY FUNCTIONS
 * ==========================================
 */

/**
 * @param {Object} params - { orderId, amount, customerId, phone, email, returnUrl }
 * @returns {Object} { paymentUrl, sdkPayload }
 */

export async function createHdfcSession({ orderId, amount, customerId, phone, email, returnUrl, payment_filter }) {
    try {
        const authHeader = `Basic ${Buffer.from(process.env.HDFC_API_KEY + ":").toString('base64')}`;

        const payload = {
            order_id: orderId,
            amount: Number(amount).toFixed(2),
            customer_id: customerId,
            customer_email: email,
            customer_phone: phone,
            payment_page_client_id: process.env.NEXT_PUBLIC_HDFC_CLIENT_ID,
            action: "paymentPage",
            return_url: returnUrl,
            payment_filter,
        };

        console.log("HDFC REQUEST");
        console.log(JSON.stringify(payload, null, 2));

        const response = await axios.post(`${process.env.HDFC_BASE_URL}/session`, payload, {
            headers: {
                'Authorization': authHeader,
                'x-merchantid': process.env.HDFC_MERCHANT_ID,
                'Content-Type': 'application/json'
            }
        });

        const data = response.data;

        console.log("HDFC RESPONSE");
        console.log(JSON.stringify(data, null, 2));

        if (data.status !== "NEW") {
            throw new Error(data.message || "Failed to create HDFC session");
        }

        return {
            paymentUrl: data.payment_links?.web,
            sdkPayload: data.sdk_payload
        };
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || "HDFC Session Initiation Failed");
    }
}

/**
 * @param {String} orderId 
 * @returns {Object} { isPaid: boolean, status: string, fullData: Object }
 */
export async function verifyHdfcOrder(orderId) {
    try {
        const authHeader = `Basic ${Buffer.from(process.env.HDFC_API_KEY + ":").toString('base64')}`;

        const response = await axios.get(`${process.env.HDFC_BASE_URL}/orders/${orderId}`, {
            headers: {
                'Authorization': authHeader,
                'x-merchantid': process.env.HDFC_MERCHANT_ID,
                'Content-Type': 'application/json'
            }
        });

        const data = response.data;

        return {
            isPaid: data.status === "CHARGED",
            status: data.status,
            fullData: data
        };
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to verify HDFC order status");
    }
}

/**
 * ==========================================
 * IDFC / CASHFREE FUNCTIONS
 * ==========================================
 */

/**
 * @param {Object} params - { orderId, amount, customerId, phone, email, name, returnUrl }
 * @returns {Object} { paymentUrl, sessionId }
 */

export async function createCashfreeOrder({ orderId, amount, customerId, phone, email, name, returnUrl, payment_methods_filters }) {
    console.log(payment_methods_filters)
    try {
        const payload = {
            order_id: orderId,
            order_amount: Number(amount).toFixed(2),
            order_currency: "INR",
            customer_details: {
                customer_id: customerId,
                customer_phone: phone,
                customer_email: email,
                customer_name: name || "website Customer"
            },
            order_meta: {
                return_url: returnUrl,
                payment_methods: typeof payment_methods_filters === 'string' 
                    ? payment_methods_filters 
                    : payment_methods_filters?.methods?.values || undefined
            },
        };

        const response = await axios.post(`${process.env.CASHFREE_BASE_URL}/orders`, payload, {
            headers: {
                'x-client-id': process.env.CASHFREE_APP_ID,
                'x-client-secret': process.env.CASHFREE_SECRET_KEY,
                'x-api-version': '2023-08-01',
                'Content-Type': 'application/json'
            }
        });

        const data = response.data;

        return {
            sessionId: data.payment_session_id
        };
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || "Failed to create Cashfree order");
    }
}



/**
 * @param {String} orderId 
 * @returns {Object} 
 */
export async function verifyCashfreeOrder(orderId) {
    try {
        const response = await axios.get(`${process.env.CASHFREE_BASE_URL}/orders/${orderId}`, {
            headers: {
                'x-client-id': process.env.CASHFREE_APP_ID,
                'x-client-secret': process.env.CASHFREE_SECRET_KEY,
                'x-api-version': '2023-08-01',
                'Content-Type': 'application/json'
            }
        });

        const data = response.data;

        return {
            isPaid: data.order_status === "PAID",
            status: data.order_status,
            fullData: data
        };
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to verify Cashfree order status");
    }
}