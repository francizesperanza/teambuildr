import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Member from './Member.jsx'
import { Link } from 'react-router-dom'

function Home() {
  const [members, setMembers] = useState([])

  const addMember = (name) => {
    if (!name.trim()) return;
    const newMember = { id: crypto.randomUUID(), name }
    setMembers([...members, newMember])
  }

  const editMember = (id, newName) => {
    setMembers(members.map(member => member.id === id ? { ...member, name: newName } : member))
  }
  
  const removeMember = (id) => {
    setMembers(members.filter(member => member.id !== id))
  }

  return (
    <><div className='flex items-center justify-center flex-col p-[10vh] min-h-dvh gap-[10vh] overflow-y-auto'>
        <div className='flex items-center justify-center flex-col gap-2 overflow-y-auto'>
          <h1 className='text-5xl'>teambuilder</h1>
          <div>Divide a party into teams!</div>
          <div>Teams: <span>2</span></div>
        </div>
        <div className='flex items-center justify-center flex-col gap-1 overflow-y-auto'>
          <h2 className='text-lg font-bold'>Party Members</h2>
          <label htmlFor="member_field">Enter the name of a party member!</label>
          <div className="flex items-center gap-2 p-2">
            <input className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" id="member_field" type="text" placeholder="e.g. Santa Claus" required
            onKeyDown={(e) => {
              if (e.key === "Enter") addMember(document.getElementById("member_field").value);
            }}/>
            <button type="button" className="bg-green-500 px-4 py-2 rounded text-white hover:bg-green-600" 
            onClick={() => addMember(document.getElementById("member_field").value)} id="add-btn">Add</button>
          </div>
        </div>
        <div className='flex flex-col items-center gap-4'>
          <h2 className='text-lg font-bold'>Party List</h2>
          <div className='border border-gray-300 rounded-lg px-4 py-2 w-[30vw] flex flex-col items-center gap-2 py-3' id="party-list">
            {members.length === 0 && <div className='w-full border border-gray-300 rounded-lg px-4 py-2 text-center'>No members added yet.</div>}
            {members.map((member) => (
              <Member key={member.id} name={member.name} onEdit={(newName) => editMember(member.id, newName)} onRemove={() => removeMember(member.id)} />
            ))}
          </div>
        </div>
        <div>
          <Link to="/result"
            state={members}>
            <button type="button" className="bg-blue-500 px-6 py-3 rounded-lg text-white" id="generate-btn">Build Teams</button>
          </Link>
        </div>
    </div>
    </>
  )
}

export default Home
