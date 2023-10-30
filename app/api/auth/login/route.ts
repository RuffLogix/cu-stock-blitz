import { supabase } from "@/services/connectSupabase"
import { encrypt_password } from "@/services/encrpytPassword"

require('dotenv').config()

const jwt = require('jsonwebtoken')

export async function POST(req: Request) {
    const { PRIVATE_KEY } = process.env

    const data = await req.formData()
    const username = data.get('username')
    const password = data.get('password')

    let token = ''
    let status = false
    let address = ''
    let balance = 10000
    let party_id = 0
    const hashed_password = encrypt_password(password as string);

    const res_data = ((await supabase.from('user').select('*').eq('username', username).eq('password', hashed_password)).data as any[])

    if (res_data.length != 0) {
        address = res_data[0].address, balance = res_data[0].balance
        party_id = res_data[0].party_id
        token = jwt.sign({ username, hashed_password }, PRIVATE_KEY)
        status = true
    }

    return Response.json({ token, status, username, address, balance, party_id })
}