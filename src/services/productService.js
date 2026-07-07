
import api from "@/lib/apiClient";

export const getFeaturedProducts = async () => {
    try {
        // Hit our new optimized Next.js route instead of PHP directly
        const response = await api.get('/products');
        
        if (response.data?.success) {
            // For the homepage "Featured Products" section, we might just want to grab the first 8 items
            // You can add logic later to sort by 'totalStock' or 'hot_deals'
            return response.data.products.slice(0, 4); 
        }
        
        return [];
    } catch (error) {
        console.error("Error fetching bundled products:", error);
        return [];
    }
};