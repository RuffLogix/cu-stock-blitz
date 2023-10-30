import { supabase } from "@/services/connectSupabase"

export async function POST(req: Request) {
    const data = await req.formData()

    const user_address = data.get('user_address')

    let status = true

    await supabase.from('user').update({
        party_id: 0
    }).eq('address', user_address)

    return Response.json({ status })
}