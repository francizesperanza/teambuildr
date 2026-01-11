import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Member from './Member.jsx'
import { Link } from 'react-router-dom'

function Teamsheet({members}) {

  return (
    <>
      <div className='flex items-center justify-center flex-col p-[2vh] gap-4 overflow-y-auto'>
          <div>Team Payaman</div>
          <div id="members-container" className='flex flex-col gap-3 justify-center items-center bg-green-200 p-6 rounded-full'>
              {members.map((member) => (
                  <div key={member.id}>{member.name}</div>
              ))}
          </div>
      </div>
    </>
  )
}

export default Teamsheet
