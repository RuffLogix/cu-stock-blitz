require('dotenv').config()

const jwt = require('jsonwebtoken')

import { VerifyErrors, VerifyCallback } from 'jsonwebtoken'

export async function POST(req: Request) {
    const { PRIVATE_KEY } = process.env

    const data = await req.formData()
    const token = data.get('token')
    
    let status = false

    let decoded_token = await jwt.verify(token, PRIVATE_KEY, (err: VerifyErrors, decoded: VerifyCallback)  => {
        return decoded
    })

    if (decoded_token) {
        status = true;
    }

    return Response.json({ status })
}