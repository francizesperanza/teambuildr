import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <><div className='flex items-center justify-center flex-col h-screen gap-[10vh]'>
        <div className='flex items-center justify-center flex-col gap-2'>
          <h1 className='text-5xl'>teambuilder</h1>
          <div>Divide a party into teams!</div>
          <div>Teams: <span>2</span></div>
        </div>
        <div className='flex items-center justify-center flex-col gap-1'>
          <h2 className='text-lg font-bold'>Party Members</h2>
          <label htmlFor="member_field">Enter the name of a party member!</label>
          <div className="flex items-center gap-2">
            <input className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" id="member_field" type="text" placeholder="e.g. Santa Claus" required />
            <button type="button" className="bg-green-500 px-4 py-2 rounded text-white" id="add-btn">Add</button>
          </div>
        </div>
    </div>
    </>
  )
}

export default Home
