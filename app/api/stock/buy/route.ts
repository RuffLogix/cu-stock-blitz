import { supabase } from "@/services/connectSupabase";

export async function POST(req: Request) {
    const data = await req.formData()

    const user_address = data.get('user_address')
    const stock_id = data.get('stock_id')
    const amount = Number(data.get('amount'))

    const user_data = (await supabase.from('user').select('*').eq('address', user_address)).data as any[];
    const stock_data = (await supabase.from('stock').select('*').eq('id', stock_id)).data as any[];

    let status = false
    let new_balance = 0
    if (user_data.length!==0 && stock_data.length!==0) {
        let balance = user_data[0].balance
        let total_price = amount * stock_data[0].prices.prices[stock_data[0].prices.prices.length-1]

        if (balance >= total_price) {
            let stocks = user_data[0].stocks
            let abbr_name = stock_data[0].abbr_name as string
            
            if (abbr_name in stocks) {
                stocks[abbr_name] += amount
            } else {
                stocks[abbr_name] = amount
            }

            await supabase.from('user').update({
                balance: balance - total_price,
                stocks: stocks
            }).eq('address', user_address)

            await supabase.from('stock_history').insert({
                amount,
                stock_id,
                stock_name: abbr_name,
                current_price: stock_data[0].prices.prices[stock_data[0].prices.prices.length-1],
                type: false,
                user_address
            }).select('*')

            status = true
            new_balance = balance - total_price
        }
    }

    return Response.json({ status, new_balance })
}