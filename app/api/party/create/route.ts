import { supabase } from "@/services/connectSupabase"

export async function POST(req: Request) {
    const data = await req.formData()
    
    const party_name = data.get('party_name')
    const creator_address = data.get('creator_address')
    const creator_name = data.get('creator_name')

    let status = true

    const party_id = (await supabase.from('party').insert({
        creator_address,
        creator_name,
        party_name
    }).select('id')).data as any[]

    await supabase.from('user').update({
        party_id: party_id[0].id
    }).eq('address', creator_address)

    return Response.json({ status, party_id: party_id[0].id })
}