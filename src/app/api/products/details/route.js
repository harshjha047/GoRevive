import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
    try {
        const { modelCode } = await request.json();

        if (!modelCode) {
            return NextResponse.json({ error: "modelCode is required" }, { status: 400 });
        }

        const phpResponse = await axios.post(`${process.env.PHP_API_BASE_URL}/getStock_IMEI.php`, {
            token: process.env.PHP_STATIC_TOKEN,
            asc_code: "GRWHDL001", 
            model_code: "", 
            model: modelCode,
            stock_type: "", imei: "", brand_id: "", 
            phone_version: "", hot_deals: "", color: "", memory: "", model_name: "", 
            user_type_app: "", search: "", price: ""
        });

        if (phpResponse.data?.response?.status !== "true") {
            return NextResponse.json({ success: true, units: [] }, { status: 200 });
        }

        const rawInventory = phpResponse.data.response.data.filter(i => 
            modelCode === i.model || 
            modelCode === i.model_code || 
            modelCode === i.common_model
        );

        const detailedUnits = rawInventory.map(item => {
            let processor = item.processor;
            if (!processor && item.model && item.model.includes('Core i')) {
                const match = item.model.match(/Core i\d/);
                if (match) processor = `Intel ${match[0]}`;
            }

            return {
                id: item.imei1 || Math.random().toString(36).substr(2, 9), 
                serialNumber: item.imei1,
                model_code: item.model_code,
                model: item.common_model || item.model,
                brand: item.brand,
                category: item.product_category,
                image: item.Original_image1 ? `https://gorevive.jbbs.in/${item.Original_image1}` : null,
                secondaryImage: item.Original_image2 ? `https://gorevive.jbbs.in/${item.Original_image2}` : null,
                condition: item.Stock_Type || 'Standard',
                price: Number(item.Cust_Price) || 0,
                distributorPrice: Number(item.Dist_Price) || 0,
                retailPrice: Number(item.Ret_Price) || 0,
                mrp: Number(item.MRP) > 0 ? Number(item.MRP) : (Number(item.Cust_Price) * 1.2),
                stock: Number(item.Stock_Qty || 1),
                specs: {
                    processor: processor || "",
                    ram: item.memory_ram || "",
                    storage: item.internal_storage || "",
                    display: item.display_size || "",
                    os: item.operating_system || "",
                    color: item.color || "",
                    gpu: item.gpu || "",
                    battery: item.battary || ""
                },
                rawDetails: item 
            };
        });

        return NextResponse.json({ 
            success: true, 
            totalFound: detailedUnits.length,
            units: detailedUnits 
        }, { status: 200 });

    } catch (error) {
        console.error("Detailed Product Extraction Error:", error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}