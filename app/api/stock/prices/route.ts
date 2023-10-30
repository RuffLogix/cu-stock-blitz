import { supabase } from "@/services/connectSupabase"

export async function GET(req: Request) {
    const { data } = await supabase.from('stock').select('id, full_name, abbr_name')

    return Response.json(data)
}