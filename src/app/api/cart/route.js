import { NextResponse } from 'next/server';
import axios from 'axios';

// ==========================================
// GET: Fetch the user's current cart
// ==========================================
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
        }

        const phpResponse = await axios.post(`${process.env.PHP_API_BASE_URL}/view_cart.php`, {
            token: process.env.PHP_STATIC_TOKEN,
            userid: userId
        });

        

        const apiPayload = phpResponse.data?.response;


        if (String(apiPayload?.status).toLowerCase() === "true" && Array.isArray(apiPayload?.data?.cartdata)) {
            const mappedCartItems = apiPayload.data.cartdata.map(item => ({
                product: {
                    id: item.productId,
                    name: item.productName || item.model_code || "Unknown Product",
                    category: item.item_category || "Unknown",
                    brand: item.brand || "Unknown",
                    price: Number(item.price || item.purchase_price) || 0,
                    mrp: Number(item.purchase_price) || 0,
                    stock: item.stock_qty ? Number(item.stock_qty) : 1,
                    image: `https://gorevive.jbbs.in/${item.productImgUrl}`,
                    condition: item.item_category,
                    model_code: item.model_code,
                    seller_cod: item.seller_cod || "GRWHDL001",
                    isStock:item.isStock
                },
                quantity: Number(item.productQty || item.qty || 1)
            }));

            return NextResponse.json({ success: true, cart: mappedCartItems }, { status: 200 });
        } 
        
        return NextResponse.json({ success: true, cart: [] }, { status: 200 });

    } catch (error) {
        console.error("Cart Fetch Error:", error.message);
        return NextResponse.json({ success: false, message: "Internal server error while fetching cart" }, { status: 500 });
    }
}


export async function POST(request) {
    try {
        const body = await request.json();
        const { unit, units, userId, action = "P" } = body; 
        

        const itemsToProcess = units || (unit ? [unit] : []);

        if (itemsToProcess.length === 0 || !userId) {
            return NextResponse.json({ success: false, message: "Missing unit(s) or userId parameters" }, { status: 400 });
        }

        const cartJSON = itemsToProcess.map(item => {
            const isObj = typeof item === 'object';
            const productId = isObj ? (item.serialNumber || item.id) : item;

            return {
                productid: String(productId), 
                model_code: String(isObj ? (item.model_code || "") : ""),
                userid: String(userId),
                sessionid: String(userId),
                qty: "1", 
                reqtype: action,
                stock_type: String(isObj && item.condition) ,
                price: Number(isObj ? (item.price || 0) : 0),
                purchase_price: isObj && item.purchase_price 
                    ? String(Number(item.purchase_price).toFixed(2)) 
                    : String((Number(isObj ? (item.price || 0) : 0) * 0.7).toFixed(2)),
                payment_mode: "",
                seller_cod: String(isObj ? (item.seller_cod || "GRWHDL001") : "GRWHDL001"),
                cod_charges: "",
                payment_remark: ""
            };
        });

        const payload = {
            cartJSON: cartJSON,
            token: process.env.PHP_STATIC_TOKEN 
        };


        const phpResponse = await axios.post(`${process.env.PHP_API_BASE_URL}/add_to_cart.php`, payload);
        const apiPayload = phpResponse.data?.response || phpResponse.data;


        if (String(apiPayload?.status).toLowerCase() === "true") {
            return NextResponse.json({ 
                success: true, 
                message: apiPayload.message || "Cart updated successfully" 
            }, { status: 200 });
        }

        return NextResponse.json({ 
            success: false, 
            message: apiPayload?.message || "Failed to update database" 
        }, { status: 400 });

    } catch (error) {
        console.error("Cart Allocation Error:", error.message);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}