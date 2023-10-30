import { supabase } from "@/services/connectSupabase";

export async function GET(req: Request) {
    const stock_id = Number(new URLSearchParams(req.url.split('?')[1]).get('stock')) || -1;
    const user_address = new URLSearchParams(req.url.split('?')[1]).get('user_address')

    const { data } = (await supabase.from('stock').select('*').eq('id', stock_id)) 
    const user_data = (await supabase.from('user').select('stocks').eq('address', user_address)).data as any[]

    let status = false
    let full_name = ''
    let abbr_name = ''
    let prices = []
    let user_amount = 0;
    if ((data as any[]).length !== 0) {
        full_name = (data as any[])[0].full_name
        abbr_name = (data as any[])[0].abbr_name
        prices = (data as any[])[0].prices.prices
        status = true;
    }

    if (user_data[0].stocks[abbr_name]!==undefined) {
        user_amount = user_data[0].stocks[abbr_name]
    }

    return Response.json({ stock_id, full_name, abbr_name, prices, status, user_amount })
}