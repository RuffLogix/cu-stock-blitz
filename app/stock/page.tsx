'use client'

import HistoryBar from "@/components/HistoryBar"
import axios from "axios"
import { useEffect, useState } from "react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

type StockType = {
    price: number
}

type StockHistory = {
    amount: number,
    current_price: number,
    stock_name: string,
    time: string,
    type: boolean
}

type StockInfo = {
    id: number,
    abbr_name: string,
    full_name: string
}

export default function Stock() {
    
    const [stockPrices, setStockPrice] = useState<StockType[]>([])
    const [stockName, setStockName] = useState<string>('Sample Stock')
    const [isEnable, setEnable] = useState<boolean>(false)
    const [stockId, setStockId] = useState<number>(-1)
    const [stockHistory, setStockHistory] = useState<StockHistory[]>([])
    const [stockInfo, setStockInfo] = useState<StockInfo[]>([])
    const [stockAmount, setStockAmount] = useState<number>(0)
    const [existStock, setExistStock] = useState<number>(0)

    const [transferAmount, setTransferAmount] = useState<number>(0)
    const [transferAddress, setTransferAddress] = useState<string>('')

    async function getStockHistory() {
        let bodyFormData = new FormData()

        bodyFormData.append('user_address', localStorage.getItem('address') as string)

        const { data } = await axios.post('http://localhost:3000/api/stock/history', bodyFormData)
        setStockHistory(data.stock_history)
    }

    async function getStockInfo() {
        const { data } = await axios.get('http://localhost:3000/api/stock/prices')
        setStockInfo(data)
    }

    useEffect(() => {
        getStockInfo()
        getStockHistory()

        setEnable((localStorage.getItem('token') !== null))
    }, [])

    async function getStock(stock_id: number) {
        const { data } = await axios.get(`http://localhost:3000/api/stock/price?stock=${stock_id}&user_address=${localStorage.getItem('address')}`)

        setStockId(data["stock_id"])
        setStockName(data["full_name"])
        setExistStock(data["user_amount"])

        setStockPrice(data["prices"].map((v: number) => {
            return { price: v }
        }))
    }

    async function Buy() {
        let bodyFormData = new FormData()

        bodyFormData.append('user_address', localStorage.getItem('address') as string)
        bodyFormData.append('stock_id', stockId.toString())
        bodyFormData.append('amount', stockAmount.toString())

        let { status, new_balance } = (await axios.post('http://localhost:3000/api/stock/buy', bodyFormData)).data

        if (!status) {
            alert('ทำรายการล้มเหลว กรุณาลองใหม่อีกครั้ง')
        } else {
            alert('ทำรายการสำเร็จ')
            localStorage.setItem('balance', new_balance)
            location.reload()    
        }
    }

    async function Sell() {
        let bodyFormData = new FormData()

        bodyFormData.append('user_address', localStorage.getItem('address') as string)
        bodyFormData.append('stock_id', stockId.toString())
        bodyFormData.append('amount', stockAmount.toString())

        let { status, new_balance } = (await axios.post('http://localhost:3000/api/stock/sell', bodyFormData)).data

        if (!status) {
            alert('ทำรายการล้มเหลว กรุณาลองใหม่อีกครั้ง')
        } else {
            alert('ทำรายการสำเร็จ')
            localStorage.setItem('balance', new_balance)
            location.reload()    
        }
    }

    async function Transfer() {
        let bodyFormData = new FormData()

        bodyFormData.append('sender', localStorage.getItem('address') as string)
        bodyFormData.append('receiver', transferAddress)
        bodyFormData.append('amount', transferAmount.toString())
        
        let { status, new_balance } = (await axios.post('http://localhost:3000/api/stock/transfer', bodyFormData)).data

        if (!status) {
            alert('ทำรายการล้มเหลว กรุณาลองใหม่อีกครั้ง')
        } else {
            alert('ทำรายการสำเร็จ')
            localStorage.setItem('balance', new_balance)
            location.reload()    
        }
    }

    return (
        <div className='flex flex-col gap-10 px-32 py-10'>
            <div className='flex gap-3'> 
                <section className="flex gap-5 flex-col w-[70%] bg-white rounded-md p-3">
                    <p className="text-lg">📈 Stock</p>
                    <div className="flex flex-col gap-3">
                        <div className='flex w-full h-8 gap-1 overflow-y-hidden'>
                            {
                                stockInfo.map((v, i) => {
                                    return (
                                        <button className='flex flex-col justify-between px-2 h-full bg-slate-800 text-white hover:bg-slate-950 rounded-md text-xs duration-200' key={v.id} disabled={ !isEnable } onClick={() => getStock(v.id)}>
                                            <div></div>
                                            <div className="flex justify-between">
                                                <span className="bg-white rounded-sm px-1">💲</span> <p className="px-2">{ v.abbr_name }</p>
                                            </div>
                                            <div></div>
                                        </button>
                                    )
                                })
                            }
                        </div>
                        <div className="h-56 bg-slate-200 p-3 rounded-md">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={ stockPrices } width={500} height={ 340 }>
                                    <YAxis dataKey="price" type="number" name="price" />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis />
                                    <Line dataKey='price'/>
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 bg-slate-200 rounded-md p-3">
                        <p>💰 { stockName } { stockPrices.length !== 0 ? `(คุณมีทั้งสิ้น ${Intl.NumberFormat().format(existStock)} หุ้น) ราคา ณ​ ปัจจุบัน 💡 ${Intl.NumberFormat().format(stockPrices[stockPrices.length-1].price)}` : ``} </p>
                        <input className='rounded-md px-3 py-2' type="text" placeholder="amout" disabled={ !isEnable } onChange={(e) => setStockAmount(Number(e.target.value))}/>
                        <div className="flex gap-1 justify-between">
                            <button className="w-full text-white bg-slate-800 rounded-md py-1 hover:bg-slate-950 duration-200" disabled={ !isEnable } onClick={Sell}>Sell</button>
                            <button className="w-full text-white bg-slate-800 rounded-md py-1 hover:bg-slate-950 duration-200" disabled={ !isEnable } onClick={Buy}>Buy</button>
                        </div>
                    </div>
                </section>
                <section className="w-[30%] bg-white flex flex-col rounded-md p-3 gap-3">
                    <p className="text-lg">⌛️ History</p>
                    <div className="w-full flex flex-col gap-3 overflow-auto h-[440px]">
                        {
                            stockHistory.length !== 0
                            ?                             
                                stockHistory.map((v, i) => {
                                    return <>
                                    {
                                        v.type 
                                        ? <HistoryBar message={`ขายหุ้น ${v.stock_name} จำนวน ${Intl.NumberFormat().format(v.amount)} หุ้น ราคา 💡 ${Intl.NumberFormat().format(v.amount*v.current_price)}`} status={v.type} date={v.time}/>
                                        : <HistoryBar message={`ซื้อหุ้น ${v.stock_name} จำนวน ${Intl.NumberFormat().format(v.amount)} หุ้น ราคา 💡 ${Intl.NumberFormat().format(v.amount*v.current_price)}`} status={v.type} date={v.time}/>
                                    }
                                    </>
                                })
                            : 
                            <div className='w-full h-full flex justify-between'>
                                <div></div>
                                <div className="flex flex-col justify-center">
                                    <div></div>
                                    <p className='text-lg'>Empty History</p>
                                    <div></div>
                                </div>
                                <div></div>
                            </div>
                        }
                    </div>
                </section>
            </div>
            <div className="flex flex-col gap-5 bg-white p-3 rounded-md">
                <p className="text-lg">🤝 Transfer</p>
                <div className='w-full gap-3 flex justify-between'>
                    <div className="w-[80%] flex gap-1">
                        <input className='w-full rounded-md px-3 py-2 bg-slate-200' type="text" placeholder="to" disabled={ !isEnable } onChange={(e) => setTransferAddress(e.target.value)}/>
                        <input className='w-full rounded-md px-3 py-2 bg-slate-200' type="number" placeholder="amount" disabled={ !isEnable } onChange={(e) => setTransferAmount(Number(e.target.value))}/>
                    </div>
                    <button className="w-[20%] bg-slate-800  text-white px-10 py-1 rounded-md hover:bg-slate-950 duration-200" disabled={ !isEnable } onClick={Transfer}>Transfer</button>
                </div>
            </div>
        </div>
    )
}