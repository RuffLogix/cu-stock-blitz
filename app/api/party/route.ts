import { supabase } from "@/services/connectSupabase"

export async function POST(req: Request) {
    const data = await req.formData()

    const user_address = data.get('user_address')
    const party_id = (await supabase.from('user').select('party_id').eq('address', user_address)).data as any[]
    const user_list = (await supabase.from('user').select('username, balance, stocks, address').eq('party_id', party_id[0].party_id)).data
    const party_data = (await supabase.from('party').select('*').eq('id', party_id[0].party_id)).data as any[][0]
    
    return Response.json({ user_list, party_data })
}   