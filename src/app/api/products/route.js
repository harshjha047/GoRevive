import { NextResponse } from 'next/server';
import axios from 'axios';

export const revalidate = 60; 

export async function GET() {
    try {
        const phpResponse = await axios.post(`${process.env.PHP_API_BASE_URL}/getStock_IMEI.php`, {
            token: process.env.PHP_STATIC_TOKEN,
            asc_code: "GRWHDL001", model_code: "", stock_type: "", imei: "", brand_id: "", 
            phone_version: "", hot_deals: "", color: "", memory: "", model_name: "", 
            user_type_app: "", search: "", price: ""
        });


        if (phpResponse.data?.response?.status !== "true") {
            return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
        }

        const rawInventory = phpResponse.data.response.data;


        const groupedProducts = rawInventory.reduce((acc, item) => {

            
            const bundleKey = item.model;
            const price = Number(item.Ret_Price);
            const condition = item.Stock_Type || 'Standard';
            const stockQty = Number(item.Stock_Qty || 1);
            const itemMrp = Number(item.MRP) > 0 ? Number(item.MRP) : price * 1.2;

            if (!acc[bundleKey]) {
                acc[bundleKey] = {
                    id: bundleKey,
                    brand: item.brand,
                    model: item.common_model || item.model,
                    category: item.product_category,
                    image: `https://gorevive.jbbs.in/${item.Original_image1}`,
                    secondaryImage: `https://gorevive.jbbs.in/${item.Original_image2}`,
                    baseSpecs: { 
                        ram: item.memory_ram,
                        storage: item.internal_storage,
                    },
                    totalStock: 0,
                    startingPrice: Infinity, 
                    mrp: itemMrp,
                    imei: item.imei || item.imei1,
                    availableConditions: new Set()
                };
            }

            // 1. Calculate the Lowest B2B Price for the "Starting At" display
            if (price < acc[bundleKey].startingPrice && price > 0) {
                acc[bundleKey].startingPrice = price;
            }

            // 2. Ensure MRP reflects the highest retail value in the bundle (Optional safety check)
            if (itemMrp > acc[bundleKey].mrp) {
                acc[bundleKey].mrp = itemMrp;
            }

            // 3. Aggregate total stock across all conditions
            acc[bundleKey].totalStock += stockQty;

            // 4. Track which conditions are available so the frontend card can render the badges
            acc[bundleKey].availableConditions.add(condition);

            return acc;
        }, {});

        // Clean up the object into a frontend-friendly array
        const bundledArray = Object.values(groupedProducts).map(product => {
            // Convert the Set to a standard Array for JSON transmission
            product.availableConditions = Array.from(product.availableConditions).sort();
            
            // Fix infinity bug if a product somehow had 0 pricing across the board
            if (product.startingPrice === Infinity) product.startingPrice = 0; 
            
            return product;
        });

        return NextResponse.json({ 
            success: true, 
            totalBundles: bundledArray.length,
            products: bundledArray 
        }, { status: 200 });

    } catch (error) {
        console.error("Product Aggregation Error:", error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}