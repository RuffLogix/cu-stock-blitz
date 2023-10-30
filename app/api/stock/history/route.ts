import { supabase } from "@/services/connectSupabase"

export async function POST(req: Request) {
    const data = await req.formData()
    const user_address = data.get('user_address')

    const stock_history = (await supabase.from('stock_history').select('*').eq('user_address', user_address)).data

    return Response.json({ stock_history })
}