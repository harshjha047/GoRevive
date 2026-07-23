import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
    try {
        const userData = await request.json();

        const phpResponse = await axios.post(`${process.env.PHP_API_BASE_URL}/customer_register.php`, {
            ...userData,
            customer_group_id: "Retailer",
            client_id: "1",
            createdBy: "website",
            token: process.env.PHP_STATIC_TOKEN 
        });

        return NextResponse.json(phpResponse.data, { status: phpResponse.status });

    } catch (error) {
        console.error('Register Proxy Error:', error.response?.data || error.message);
        
        const status = error.response?.status || 500;
        const errorMessage = error.response?.data || { error: 'Internal Server Error' };
        
        return NextResponse.json(errorMessage, { status });
    }
}