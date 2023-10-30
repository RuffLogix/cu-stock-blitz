export default function Home() {
  return (
    <main>
      <div className="px-48 py-5 h-screen">
        <div className="flex w-full rounded-md px-5 py-10 bg-white">
          {/* <div></div> */}
          <div className="flex flex-col justify-between w-[50%]">
            <div></div>
            <div className="flex flex-col gap-5">
              {/* <h1 className="text-2xl bg-slate-800 text-white w-fit px-3 py-1 rounded-md">CU-Stock Blitz</h1> */}
              <p className="text-5xl">วันนี้... <br/>คุณติด"ดอย"แล้วหรือยัง ?</p>
              <div className="flex gap-3">
                  <p className="bg-slate-800 text-white"># การลงทุน</p>
                  <p className="bg-slate-800 text-white"># ติดดอย</p>
                  <p className="bg-slate-800 text-white"># ซื้อแพงขายถูก</p>
                  <p className="bg-slate-800 text-white"># ไม่ขายไม่ขาดทุน</p>
              </div>
              
            </div>
            <div></div>
          </div>
          <div className="w-[50%]">
            <img src="./home-banner.png" alt="Stock Fighter" className="rounded-md h-80 object-cover w-full"/>
          </div>
        </div>
      </div>
    </main>
  )
}