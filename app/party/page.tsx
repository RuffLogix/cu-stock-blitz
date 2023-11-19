'use client'

import axios from "axios"
import { useEffect, useState } from "react"

type PartyMemberInfo = {
    username: string,
    balance: number,
    stocks: { [key: string]: number },
    address: string
}

export default function Party() {
    
    const [hasParty, setHasParty] = useState<boolean>(false)
    const [isEnable, setEnable] = useState<boolean>(false)

    const [partyNameCreate, setPartyNameCreate] = useState<string>('')

    const [partyNameJoin, setPartyNameJoin] = useState<string>('')
    const [creatorAddress, setCreatorAddress] = useState<string>('')

    const [partyMemberInfo, setPartyMemberInfo] = useState<PartyMemberInfo[]>([])
    const [partyCreator, setPartyCreator] = useState<string>('A')
    const [partyName, setPartyName] = useState<string>('A')

    async function Show() {
        let bodyFormData = new FormData()

        bodyFormData.append('user_address', localStorage.getItem('address') as string)

        let data = (await axios.post('http://localhost:3000/api/party', bodyFormData)).data

        console.log(data.party_data)
        console.log(data.user_list)

        console.log(data.party_data[0].creator_name)

        setPartyCreator(data.party_data[0].creator_name)
        setPartyName(data.party_data[0].party_name)
        setCreatorAddress(data.party_data[0].creator_address)
        setPartyMemberInfo(data.user_list)
    }

    useEffect(() => {
        if ((Number(localStorage.getItem('party_id')) !== 0)) {
            Show()
        }

        setHasParty((Number(localStorage.getItem('party_id')) !== 0))
        setEnable((localStorage.getItem('token') !== null))
    }, [])

    async function Create() {
        let bodyFormData = new FormData()

        bodyFormData.append('party_name', partyNameCreate)
        bodyFormData.append('creator_address', localStorage.getItem('address') as string)
        bodyFormData.append('creator_name', localStorage.getItem('username') as string)

        const { status, party_id } = (await axios.post('http://localhost:3000/api/party/create', bodyFormData)).data;

        if (status) {
            alert('สร้าง party สำเร็จ!')
            localStorage.setItem('party_id', party_id)
            location.reload()
        }
    }

    async function Join() {
        const bodyFormData = new FormData()

        bodyFormData.append('party_name', partyNameJoin)
        bodyFormData.append('creator_address', creatorAddress)
        bodyFormData.append('user_address', localStorage.getItem('address') as string)

        const { status, party_id } = (await axios.post('http://localhost:3000/api/party/join', bodyFormData)).data

        if (status) {
            alert('เข้าร่วม Party สำเร็จ')
            localStorage.setItem('party_id', party_id)
            location.reload()
        } else {
            alert('เข้าร่วม Party ล้มเหลว')
        }
    }

    async function Leave() {
        const bodyFormData = new FormData()

        bodyFormData.append('user_address', localStorage.getItem('address') as string)

        let { status } = (await axios.post('http://localhost:3000/api/party/leave', bodyFormData)).data

        if (status) {
            localStorage.setItem('party_id', '0')
            location.reload()
        }
    }

    return (
        <div className="flex flex-col gap-5 px-32 py-5">
            {
                !hasParty
                ?
                <>
                    <div className='flex w-full gap-5 bg-white rounded-md h-96'>
                        <div className="w-[45%] flex flex-col justify-between">
                            <div></div>
                            <div className="flex flex-col justify-between items-center gap-3 rounded-md p-3">
                                <h1 className="text-xl">Create your Party!</h1>
                                <input className="w-[75%] rounded-md px-3 py-2 bg-slate-200" type="text" placeholder="party name" disabled={ !isEnable } onChange={(e) => setPartyNameCreate(e.target.value)}/>
                                <button className="w-[75%] bg-slate-800  text-white px-10 py-1 rounded-md hover:bg-slate-950 duration-200" disabled={ !isEnable } onClick={Create}>Create Party</button>
                            </div>
                            <div></div>
                        </div>
                        <div className="w-[10%] flex flex-col justify-between">
                            <div></div>
                            <p className="text-xl w-full text-center">- or -</p>
                            <div></div>
                        </div>
                        <div className="w-[45%] flex flex-col justify-between">
                            <div></div>
                            <div className="flex flex-col justify-between items-center gap-3 rounded-md ">
                                <h1 className="text-xl">Join Party!</h1>
                                <input className="w-[75%] rounded-md px-3 py-2 bg-slate-200" type="text" placeholder="party name" disabled={ !isEnable } onChange={(e) => setPartyNameJoin(e.target.value)}/>
                                <input className="w-[75%] rounded-md px-3 py-2 bg-slate-200" type="text" placeholder="leader address" disabled={ !isEnable } onChange={(e) => setCreatorAddress(e.target.value)}/>
                                <button className="w-[75%] bg-slate-800  text-white px-10 py-1 rounded-md hover:bg-slate-950 duration-200" disabled={ !isEnable } onClick={Join}>Join Party</button>
                            </div>
                            <div></div>
                        </div>
                    </div>
                </>
                :
                <>
                    <div className="flex flex-col gap-3 bg-white rounded-md p-3">
                        <div className="flex w-full justify-between">
                            <div></div>
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between">
                                    <div></div>
                                    <h1 className="text-3xl">Our Party</h1>
                                    <div></div>
                                </div>
                                <div className="flex gap-3 ">
                                    <div className="flex gap-3 items-baseline">
                                        <p className="text-xl">Party Name</p>
                                        <p className="bg-slate-800 px-5 rounded-md text-white">{partyName}</p>
                                    </div>
                                    
                                    <div className="flex gap-3 items-baseline">
                                        <p className="text-xl">Party Creator</p>
                                        <p className="bg-slate-800 px-5 rounded-md text-white text-md">{partyCreator}</p>
                                    </div>

                                    <div className="flex gap-3 items-baseline">
                                        <p className="text-xl">Party Member</p>
                                        <p className="bg-slate-800 px-5 rounded-md text-white text-md">{partyMemberInfo.length}</p>
                                    </div>
                                </div>
                            </div>
                            <div></div>
                        </div>

                        <img src="./party-banner.png" alt="Trader Party" className="h-80 object-cover rounded-md"/>

                        <div className="flex  flex-col gap-3 p-5 rounded-md">
                            <div className="flex gap-3">
                                <h1 className="text-2xl">Member(s)</h1>
                                <button className="bg-red-500 text-white px-3 rounded-md hover:bg-red-700" onClick={Leave}>Leave</button>
                            </div>
                            {
                                partyMemberInfo.map((v, i) => {
                                    return (
                                        <div className="flex w-full border-cyan-600 border-l-8  gap-5 p-5 bg-slate-50 rounded-md items-baseline" key={i}>
                                            <div className="flex gap-5 items-baseline w-[20%]">
                                                <div className="w-[50%] flex justify-between items-baseline">
                                                    <div></div>
                                                    <p className="hover:cursor-pointer text-xl" onClick={() => navigator.clipboard.writeText(v.address)}>{v.username}</p>
                                                    <div></div>
                                                </div>
                                                <p className="px-3 py-2 rounded-md bg-slate-200 w-[50%]">💡 {Intl.NumberFormat().format(Number(v.balance))}</p>
                                            </div>
                                            <div className="flex gap-3 w-[80%] overflow-y-auto">
                                            {
                                                Object.keys(v.stocks).map((stock) => {
                                                    return (
                                                        Number(v.stocks[stock]) === 0
                                                        ? 
                                                            <></>
                                                        :
                                                            <div className="flex gap-3 bg-slate-800 px-3 py-1 rounded-md text-white">
                                                                <p> {stock} </p>
                                                                <p> {Intl.NumberFormat().format(Number(v.stocks[stock]))} </p>
                                                            </div>
                                                    )
                                                })
                                            }
                                            </div>
                                        </div>
                                    )
                                }) 
                            }
                        </div>
                    </div>
                </>
            }
        </div>
    )
}