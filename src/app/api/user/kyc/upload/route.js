import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
    try {
        // Parse the incoming multipart form data from React
        const formData = await request.formData();
        const distCode = formData.get('dist_code');
        const aadhaarFile = formData.get('aadhaar_image');
        const panFile = formData.get('pan_image');
        const gstFile = formData.get('gst_image');

        if (!distCode) {
            return NextResponse.json({ success: false, message: "Missing user ID (dist_code)" }, { status: 400 });
        }

        // Build the payload for the PHP server
        const phpFormData = new FormData();
        phpFormData.append('dist_code', distCode);
        phpFormData.append('token', process.env.PHP_STATIC_TOKEN_CHECKOUT);

        // Safely append files only if they were provided
        if (aadhaarFile && aadhaarFile.size > 0) phpFormData.append('aadhaar_image', aadhaarFile);
        if (panFile && panFile.size > 0) phpFormData.append('pan_image', panFile);
        if (gstFile && gstFile.size > 0) phpFormData.append('gst_image', gstFile);


        const phpResponse = await axios.post(`${process.env.PHP_API_BASE_URL}/saveMobileKycUploads.php`, phpFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });


        const apiPayload = phpResponse.data?.response || phpResponse.data;


        if (String(apiPayload?.status).toLowerCase() === "true") {
            return NextResponse.json({ success: true, message: "Documents uploaded successfully" }, { status: 200 });
        }

        // Handle specific PHP errors (like the PDF rejection from your screenshot)
        return NextResponse.json({ 
            success: false, 
            message: apiPayload?.message || phpResponse.data?.error || "Upload rejected by server" 
        }, { status: 400 });

    } catch (error) {
        console.error("KYC Upload Error:", error.message);
        return NextResponse.json({ success: false, message: "Internal server error during upload" }, { status: 500 });
    }
}