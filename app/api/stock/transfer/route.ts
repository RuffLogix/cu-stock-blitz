import { supabase } from "@/services/connectSupabase"

export async function POST(req: Request) {
    const data = await req.formData()

    const sender = data.get('sender') // sender address
    const receiver = data.get('receiver') // receiever address
    const amount = Number(data.get('amount'))

    const sender_data = (await supabase.from('user').select('balance').eq('address', sender)).data as any[]
    const receiver_data = (await supabase.from('user').select('balance').eq('address', receiver)).data as any[]
    
    let status = false
    let new_balance = 0
    if (sender_data.length!==0 && receiver_data.length!==0) {
        const sender_balance = sender_data[0].balance
        const receiver_balance = receiver_data[0].balance

        if (sender_balance >= amount) {
            await supabase.from('user').update({
                balance: sender_balance - amount
            }).eq('address', sender)

            await supabase.from('user').update({
                balance: receiver_balance + amount
            }).eq('address', receiver)

            status = true
            new_balance = sender_balance - amount
        }
    }

    return Response.json({ status, new_balance })
}