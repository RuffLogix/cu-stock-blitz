import { supabase } from "@/services/connectSupabase"

export async function POST(req: Request) {
    const data = await req.formData()

    const party_name = data.get('party_name')
    const creator_address = data.get('creator_address')
    const user_address = data.get('user_address')

    const party_id = (await supabase.from('party').select('id').eq('creator_address', creator_address).eq('party_name', party_name)).data as any[]

    let status = false

    if (party_id.length !== 0) {
        await supabase.from('user').update({
            party_id: party_id[0].id
        }).eq('address', user_address)

        status = true
    }

    return Response.json({ status, party_id })
}