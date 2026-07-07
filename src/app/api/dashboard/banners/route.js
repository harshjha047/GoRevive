import { NextResponse } from 'next/server';
import axios from 'axios';

export const revalidate = 3600; 

export async function GET() {
    try {
        const phpResponse = await axios.post(`${process.env.PHP_API_BASE_URL}/get_banner.php`, {
            token: process.env.PHP_STATIC_TOKEN
        });

        if (phpResponse.data?.response?.status === "true") {
            const rawBanners = phpResponse.data.response.data.bannerData;

            const cleanedBanners = rawBanners.map(banner => ({
                ...banner,
                bannerUrl: banner.bannerUrl.replace('/app_api/API/bannerimg/', '/app_api/bannerimg/')
            }));

            return NextResponse.json({ banners: cleanedBanners }, { status: 200 });
        }

        return NextResponse.json({ error: "No banners found" }, { status: 404 });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}