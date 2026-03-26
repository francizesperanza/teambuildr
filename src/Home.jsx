import { useEffect, useState } from 'react'
import Member from './Member.jsx'
import { Link, useNavigate} from 'react-router-dom'
import './Home.css'
import { toast, ToastContainer } from 'react-toastify';
import { Cog6ToothIcon, PlusIcon } from '@heroicons/react/20/solid';
import SettingsModal from './SettingsModal.jsx';
import Footer from './Footer.jsx';

function Home() {
  const [members, setMembers] = useState([]);
  const [numTeams, setNumTeams] = useState(2);
  const [leadersEnabled, setLeadersEnabled] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('members');
    const currentSettings = localStorage.getItem('settings');
    if (currentSettings) {
      const settings = JSON.parse(currentSettings);
      setNumTeams(settings.numTeams);
      setLeadersEnabled(settings.leadersEnabled);
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
    let newMembers = members.map(member => member.id === id ? { ...member, name: newName } : member)
    setMembers(newMembers)
    localStorage.setItem('members', JSON.stringify(newMembers))
  }
  
  const removeMember = (id) => {
    let newMembers = members.filter(member => member.id !== id)
    setMembers(newMembers)
    localStorage.setItem('members', JSON.stringify(newMembers))
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
    navigate('/result', { state: {members: members, numTeams: numTeams, leadersEnabled: leadersEnabled} });
  }

  return (
    <>
    <ToastContainer />
    <div className='flex min-h-dvh w-full overflow-y-auto'>
      <div className='builder-panel flex flex-2 items-center justify-center flex-col p-[10vh] min-h-dvh gap-[3vh] overflow-y-auto'>
        <div className='flex items-center justify-center flex-col gap-1 overflow-visible'>
          <h1 className='title text-7xl'>teambuildr</h1>
          <div>Divide a party into teams!</div>
        </div>
        <div className='flex items-center justify-center flex-col gap-1 overflow-y-auto w-full'>
          <h2 className='text-lg font-bold'>Party Members</h2>
          <label htmlFor="member_field">Enter the name of a party member!</label>
          <div className="w-[70%] flex items-center gap-2 p-2">
            <input maxLength={30} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" id="member_field" type="text" placeholder="e.g. Santa Claus" required
            onKeyDown={(e) => {
              if (e.key === "Enter") addMember(document.getElementById("member_field").value);
            }}/>
            <button type="button" className={`relative px-2 py-5 inline-flex items-center bg-transparent text-white cursor-pointer`} id="add-btn"
            onClick={() => addMember(document.getElementById("member_field").value)}>
                <svg className='overflow-visible stroke-black stroke-2 fill-lime-500 absolute inset-0 w-full h-full hover:fill-lime-700 hover:drop-shadow-sm' viewBox="0 0 163 154">
                    <path d="M158.549 15.303c-9.424-21.057-146.69-19.74-154.205 0-7.514 19.74-4.786 108.573 3.78 126.339 8.568 17.767 129.008 15.135 141.001 0 11.994-15.134 18.847-105.282 9.424-126.339"/>
                </svg>
                <span className='pointer-events-none z-20 flex justify-center items-center'>
                    <PlusIcon className=" h-8 w-8"/>
                </span>
            </button>
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
          <div className='flex justify-around items-center gap-3 border border-gray-300 rounded-lg px-4 py-2 flex-1 text-center'>
            <div>
              <div className='font-bold text-2xl'>{numTeams}</div>
              Teams
            </div>
            <div className='text-xs'>Team Leaders <br></br> {leadersEnabled ? 'Enabled' : 'Disabled'}</div>
          </div>
          <button type="button" className={`relative px-4 py-4 inline-flex items-center bg-transparent text-white cursor-pointer`} id="remove-btn"
          onClick={() => setIsSettingsOpen(true)}>
              <svg className='overflow-visible stroke-black stroke-2 fill-gray-500 absolute inset-0 w-full h-full hover:fill-gray-700 hover:drop-shadow-sm' viewBox="0 0 163 154" preserveAspectRatio="none">
                  <path d="M158.549 15.303c-9.424-21.057-146.69-19.74-154.205 0-7.514 19.74-4.786 108.573 3.78 126.339 8.568 17.767 129.008 15.135 141.001 0 11.994-15.134 18.847-105.282 9.424-126.339"/>
              </svg>
              <span className='pointer-events-none z-20 flex justify-center items-center'>
                  <Cog6ToothIcon className="h-5 w-5 inline" />
              </span>
          </button>
            
          <SettingsModal isOpen={isSettingsOpen} updateSettings={(settings) => {
            setNumTeams(settings.numTeams);
            setLeadersEnabled(settings.leadersEnabled);
          }} onClose={() => setIsSettingsOpen(false)} />
        </div>
        <div>
          <button type="button" className={`relative px-5 py-5 inline-flex items-center bg-transparent text-white cursor-pointer`} id="remove-btn"
          onClick={buildTeams}>
              <svg className='overflow-visible stroke-black stroke-2 fill-blue-500 absolute inset-0 w-full h-full hover:fill-blue-700 hover:drop-shadow-sm' viewBox="0 0 163 154" preserveAspectRatio="none">
                  <path d="M158.549 15.303c-9.424-21.057-146.69-19.74-154.205 0-7.514 19.74-4.786 108.573 3.78 126.339 8.568 17.767 129.008 15.135 141.001 0 11.994-15.134 18.847-105.282 9.424-126.339"/>
              </svg>
              <span className='pointer-events-none z-20 flex justify-center items-center'>
                  <div>Build Teams</div>
              </span>
          </button>
        </div>
      </div>
      <div className='home-anim flex-2'></div>
    </div>
    <Footer />
    </>
  )
}

export default Home
