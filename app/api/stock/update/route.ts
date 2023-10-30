import { supabase } from "@/services/connectSupabase"

export async function POST(req: Request) {
    const data = await req.formData()

    const stock_id = data.get('stock_id')
    const latest_price = data.get('latest_price')

    let status = true
    let stock_data = (await supabase.from('stock').select('*').eq('id', stock_id)).data as any[]
    let stock_price = stock_data[0].prices
    
    stock_price["prices"].push(latest_price)

    await supabase.from('stock').update({
        prices: stock_price
    }).eq('id', stock_id)

    return Response.json({ status })
}