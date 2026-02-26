import { useEffect, useState } from 'react'
import Member from './Member.jsx'
import { Link, useNavigate} from 'react-router-dom'
import './Home.css'
import { toast, ToastContainer } from 'react-toastify';
import { Cog6ToothIcon } from '@heroicons/react/20/solid';
import SettingsModal from './SettingsModal.jsx';
import Footer from './Footer.jsx';

function Home() {
  const [members, setMembers] = useState([]);
  const [numTeams, setNumTeams] = useState(2);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('members');
    const currentSettings = localStorage.getItem('settings');
    if (currentSettings) {
      const settings = JSON.parse(currentSettings);
      setNumTeams(settings.numTeams);
    }
    if (stored) {
      setMembers(JSON.parse(stored));
    }
  }, []);

  const addMember = (name) => {
    if (!name.trim()) return;
    const newMember = { id: crypto.randomUUID(), name }
    setMembers([...members, newMember])
    document.getElementById("member_field").value = '';
  }

  const editMember = (id, newName) => {
    setMembers(members.map(member => member.id === id ? { ...member, name: newName } : member))
  }
  
  const removeMember = (id) => {
    setMembers(members.filter(member => member.id !== id))
  }

  const buildTeams = () => {
    if(members.length < 2) {
      toast.error('Please add at least 2 members to build teams.', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    if(members.length < numTeams) {
      toast.error('You do not have enough members to build the specified number of teams.', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    localStorage.setItem('members', JSON.stringify(members));
    navigate('/result', { state: {members: members, numTeams: numTeams}});
  }

  return (
    <>
    <ToastContainer />
    <div className='flex min-h-dvh w-full overflow-y-auto'>
      <div className='builder-panel flex flex-2 items-center justify-center flex-col p-[10vh] min-h-dvh gap-[10vh] overflow-y-auto'>
        <div className='flex items-center justify-center flex-col gap-2 overflow-visible'>
          <h1 className='title text-8xl'>teambuildr</h1>
          <div>Divide a party into teams!</div>
        </div>
        <div className='flex items-center justify-center flex-col gap-1 overflow-y-auto w-full'>
          <h2 className='text-lg font-bold'>Party Members</h2>
          <label htmlFor="member_field">Enter the name of a party member!</label>
          <div className="w-[70%] flex items-center gap-2 p-2">
            <input className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" id="member_field" type="text" placeholder="e.g. Santa Claus" required
            onKeyDown={(e) => {
              if (e.key === "Enter") addMember(document.getElementById("member_field").value);
            }}/>
            <button type="button" className="bg-green-500 px-4 py-2 rounded text-white hover:bg-green-600" 
            onClick={() => addMember(document.getElementById("member_field").value)} id="add-btn">Add</button>
          </div>
        </div>
        <div className='flex flex-col items-center gap-4'>
          <h2 className='text-lg font-bold'>Party List</h2>
          <div className='overflow-y-auto max-h-[50vh] border border-gray-300 rounded-lg px-[2vw] py-[2vh] w-[30vw] flex flex-col items-center gap-2 py-3 field-sizing-content' id="party-list">
            {members.length === 0 && <div className='w-full border border-gray-300 rounded-lg px-[2vw] py-[1vh] text-center'>No members added yet.</div>}
            {members.map((member) => (
              <Member key={member.id} name={member.name} onEdit={(newName) => editMember(member.id, newName)} onRemove={() => removeMember(member.id)} />
            ))}
          </div>
        </div>
        <div className='flex items-center justify-around gap-5 w-[30vw]'>
          <div className='flex justify-center items-center gap-3 border border-gray-300 rounded-lg px-4 py-2 flex-1 text-center'>
            <div className='font-bold text-2xl'>{numTeams}</div>
            Teams
          </div>
          <button onClick={() => setIsSettingsOpen(true)} type="button" className="flex justify-center items-center bg-gray-500 px-4 py-3 rounded-lg text-white" id="team-count-btn">
            <Cog6ToothIcon className="h-5 w-5 inline" /></button>
          <SettingsModal isOpen={isSettingsOpen} updateSettings={(newNum) => setNumTeams(newNum)} onClose={() => setIsSettingsOpen(false)} />
        </div>
        <div>
            <button onClick={buildTeams} type="button" className="bg-blue-500 px-6 py-3 rounded-lg text-white" id="generate-btn">Build Teams</button>
        </div>
      </div>
      <div className='home-anim flex-2'></div>
    </div>
    <Footer />
    </>
  )
}

export default Home
