import { supabase } from "@/services/connectSupabase"
import { encrypt_password } from "@/services/encrpytPassword"

require('dotenv').config()

const jwt = require('jsonwebtoken')

export async function POST(req: Request) {
    const { PRIVATE_KEY } = process.env

    const data = await req.formData()
    const username = data.get('username')
    const password = data.get('password')

    let status = false
    const hash_password = encrypt_password(password as string);

    const res_data = (await supabase.from('user').select('*').eq('username', username)).data as any[];

    if (res_data.length === 0) {
        await supabase.from('user').insert({
            username: username,
            password: hash_password,
            address: '0x' + encrypt_password(username as string + password as string)
        })
        status = true
    } 

    let token = jwt.sign({ username, hash_password }, PRIVATE_KEY)

    return Response.json({ token, status })
}