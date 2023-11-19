'use client'

import axios from "axios";
import Link from "next/link";
import { MouseEvent, useEffect, useState } from "react";

export default function Navbar() {

    const [isLogin, setLogin] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [userAddress, setUserAddress] = useState<string>('');
    const [userBalance, setUserBalance] = useState<number>(0);
    const [loginToggle, setLoginToggle] = useState<boolean>(false);

    useEffect(() => {
        async function getLoginStatus() {
            const token = localStorage.getItem('token')
            const address = localStorage.getItem('address') as string
            const balance = Number(localStorage.getItem('balance') as string)
            const username = localStorage.getItem('username') as string

            let bodyFormData = new FormData()

            bodyFormData.append('token', token as string)

            const { status } = (await axios.post('https://cu-stock-blitz.vercel.app/stock/api/auth/verify', bodyFormData)).data

            if (!status) { localStorage.clear() }

            setLogin(status)
            setUserAddress(address)
            setUserBalance(balance)
            setUsername(username)
        }

        getLoginStatus()
    }, [])

    async function Login(e: MouseEvent<HTMLInputElement, globalThis.MouseEvent>) {
        e.defaultPrevented

        let bodyFormData = new FormData()

        bodyFormData.append('username', username)
        bodyFormData.append('password', password)

        let { token, status, address, balance, party_id } = (await axios.post('https://cu-stock-blitz.vercel.app/stock/api/auth/login', bodyFormData)).data

        if (status) {
            localStorage.setItem('token', token)
            localStorage.setItem('address', address)
            localStorage.setItem('balance', balance)
            localStorage.setItem('username', username)
            localStorage.setItem('party_id', party_id)

            setUserAddress(address)
            setUserBalance(balance)

            alert('เข้าสู่ระบบสำเร็จ!')
            location.reload()
        } else {
            alert('ชื่อผู้ใช้ หรือ รหัสผ่าน ไม่ถูกต้อง!')
        }
    }

    async function Register() {
        const bodyFormData = new FormData()

        bodyFormData.append('username', username)
        bodyFormData.append('password', password)

        let { status } = (await axios.post('https://cu-stock-blitz.vercel.app/stock/api/auth/register', bodyFormData)).data

        if (status) {
            alert('สร้างบัญชีสำเร็จ!')
            location.reload()
        } else {
            alert('กรุณาใช้ชื่ออื่น เนื่องจากมีชื่อนี้ในระบบแล้ว!')
        }
    }

    function Logout() {
        localStorage.clear()

        setLogin(false)
        location.reload()
    }

    return (
        <nav className='w-full flex justify-between bg-white py-3 px-16 items-baseline'> 
            <div className='flex gap-3 items-baseline'>
                <Link href='/'>
                    <h1 className='text-xl animate-bounce'>🐰 CU-Stock Blitz</h1>
                </Link>
                <Link href='/'>
                <p className='hover:bg-slate-800 hover:text-white px-3 py-1 rounded-md duration-200'>🏠 Home</p>
                </Link>
                <Link href='/stock'>
                    <p className='hover:bg-slate-800 hover:text-white px-3 py-1 rounded-md duration-200'>📈 Stock</p>
                </Link>
                <Link href='/party'>
                    <p className='hover:bg-slate-800 hover:text-white px-3 py-1 rounded-md duration-200'>👨🏻‍💻 Party</p>
                </Link>
            </div>  
            {
                isLogin
                ? 
                    <div className='flex gap-3 items-baseline'>
                        <div className="flex items-baseline">
                            <p className='hover:cursor-pointer' onClick={() => navigator.clipboard.writeText(userAddress)}> { username } </p>
                        </div>
                        <div className='px-3 py-2 rounded-md bg-slate-200'>
                            <p>💡 { Intl.NumberFormat().format(userBalance) }</p>
                        </div>
                        <button onClick={ Logout } className='bg-slate-800 px-5 rounded-md text-white py-2 hover:bg-slate-950 duration-200'>
                            Logout
                        </button>
                    </div>
                : 
                    <div className='flex gap-3'>
                        <button className="bg-slate-800 text-white px-3 rounded-md py-1 hover:bg-slate-950" onClick={() => { setLoginToggle(!loginToggle) }}> Mode - { loginToggle ? "Login" : "Register"} </button>
                        <input placeholder='username' type="text" onChange={(e) => setUsername(e.target.value)}/>
                        <input placeholder='password' type="password" onChange={(e) => setPassword(e.target.value)}/>
                        <input className="bg-slate-800 text-white px-3 rounded-md py-1 hover:bg-slate-950" type="submit" onClick={ loginToggle ? Login : Register }/>
                    </div>
            }
        </nav>
    )
}