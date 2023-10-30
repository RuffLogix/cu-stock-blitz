import crypto from 'crypto'

function encrypt_password(password: string) {
    let hashed_password = crypto.createHash('sha1').update(password).digest('hex')
    return hashed_password
}

export { encrypt_password }