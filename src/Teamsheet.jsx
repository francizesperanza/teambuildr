import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { animate, stagger, createScope, set, random } from 'animejs'
import './Teamsheet.css'
import { Popover } from '@mui/material';
import { CheckCircleIcon, CheckIcon } from '@heroicons/react/20/solid';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { ToastContainer, toast } from 'react-toastify';

function Teamsheet({members, teamColor, teamIndex, teamName, onEdit, leader, leaderEnabled, animating, setAnimating}) {
  const scope = useRef(null);
  const root = useRef(null);
  const inputRef = useRef(null);

  const [sprites, setSprites] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [currentLeader, setCurrentLeader] = useState(leader);
  const [editing, setEditing] = useState(false);
  const [newTeamName, setNewTeamName] = useState(teamName);


  const minX = -window.innerWidth / 2 + 100;
  const minY = -window.innerHeight / 2 + 100;

  const maxX = window.innerWidth / 2 - 100;
  const maxY = window.innerHeight / 2 - 100;

  const images = Object.values(
    import.meta.glob("/src/assets/people_sprite/*.{png,jpg,jpeg,webp}", {
      eager: true,
      import: "default",
    })
  );

  const saveEdit = () => {
      if (newTeamName.length === 0) {
          toast.error('You need a team name!', {
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
      onEdit(newTeamName);
      setEditing(false);
  }

  const randomizeSprites = () => {
    let selectedSprites = [];
    while (selectedSprites.length < members.length) {
        const randomIndex = Math.floor(Math.random() * images.length);
        if (!selectedSprites.includes(images[randomIndex])) {
            selectedSprites.push(images[randomIndex]);
        }
    }
    return selectedSprites;
  }

  const onSpriteHover = (e) => {
    if (animating) return;
    animate(e.currentTarget.querySelector('.member-name'),{
        scale: [
          { to: 1.2, duration: 200 },
        ]
    });
    animate(e.currentTarget.querySelector('.sprite-shadow'),{
        scale: [
          { to: 1.2, duration: 200 },
        ]
    });
    animate(e.currentTarget.querySelector('.leader-icon'),{
        scale: [
          { to: 1.2, duration: 200 },
        ]
    });
  }

  const onSpriteLeave = (e) => {
    if (animating) return;

    animate(e.currentTarget.querySelector('.member-name'),{
        scale: [
          { to: 1, duration: 100},
        ],
    });

    animate(e.currentTarget.querySelector('.sprite-shadow'),{
        scale: [
          { to: 1, duration: 100},
        ],
    });

    animate(e.currentTarget.querySelector('.leader-icon'),{
        scale: [
          { to: 1, duration: 100},
        ],
    });
  }

  const openPopover = (e, index) => {
    setAnchorEl(e.currentTarget);
    setSelectedMember(index);
  }

  const closePopover = () => {
    setAnchorEl(null);
    setSelectedMember(null);
  }

  const changeLeader = (index) => {
    currentLeader === index ? setCurrentLeader(null) : setCurrentLeader(index);
    let leaderIndexes = JSON.parse(localStorage.getItem('leaderIndexes'));
    leaderIndexes[teamIndex] = index;
    localStorage.setItem('leaderIndexes', JSON.stringify(leaderIndexes));
    closePopover();
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  useEffect(() => {
    setNewTeamName(teamName ?? "");
  }, [teamName]);

  //animation
    useEffect(() => {
        setSprites(randomizeSprites());
        scope.current = createScope({root}).add( self => {
            setAnimating(true);
            animate('.member-container',{
                opacity: [
                  { to: 0, duration: 0 },
                  { to: 1, delay: 500}
                ],
                translateY: [
                  {
                    to: () =>
                      Math.floor(Math.random() * (maxY - minY + 1)) + minY,
                  },
                  { to: () =>
                      (Math.floor(Math.random() * (maxY - minY + 1)) + minY) / 2, delay: 1500, duration: 1500 },
                  { to: 0, duration: 500 },
                ],

                translateX: [
                  {
                    to: () =>
                      Math.floor(Math.random() * (maxX - minX + 1)) + minX,
                  },
                  { to: () =>
                      (Math.floor(Math.random() * (maxY - minY + 1)) + minY) / 2, delay: 1500, duration: 1500 },
                  { to: 0, duration: 500 },
                ],

                onComplete: () => setAnimating(false)
            });

            animate( '.member-avatar',{
                rotate: [
                  { to: -10, delay: 1725, duration: 50},
                  { to: 0, delay: 50, duration: 175},
                  { to: 10, delay: 50, duration: 175},
                  { to: 0, delay: 50, duration: 175},
                  { to: -10, delay: 50, duration: 175},
                  { to: 0, duration: 250, delay: 100},
                  { to: 10, delay: 50, duration: 175},
                  { to: 0, delay: 50, duration: 175},
                ],
                translateY:[
                  { to: -20, delay: 1725, duration: 50},
                  { to: 0, delay: 50, duration: 175},
                  { to: -20, delay: 50, duration: 175},
                  { to: 0, delay: 50, duration: 175},
                  { to: -20, delay: 50, duration: 175},
                  { to: 0, delay: 50, duration: 175},
                  { to: -20, delay: 200, duration: 175, },
                  { to: 0, delay: 50, duration: 175},
                  { to: -40, delay: 600, duration: stagger(100)},
                  { to: 0, duration: 25},
                ]
            });

            animate( '.member-name, .sprite-shadow',{
                translateY:[
                  { to: -20, delay: 1725, duration: 50},
                  { to: 0, delay: 50, duration: 175},
                  { to: -20, delay: 50, duration: 175},
                  { to: 0, delay: 50, duration: 175},
                  { to: -20, delay: 50, duration: 175},
                  { to: 0, delay: 50, duration: 175},
                  { to: -20, delay: 200, duration: 175, },
                  { to: 0, delay: 50, duration: 175},
                  { to: 0, duration: 25},
                ] 
            });

            return () => scope.current.revert();
        })
    }, []);

  return (
    <>
    <ToastContainer></ToastContainer>
      <div ref={root} className='overflow-visible md:flex-[20%] flex items-center justify-center flex-col p-[.1vh] gap-3'>
        <div className={'flex gap-2 font-bold outline-dashed outline-black outline-2 text-center rounded-full justify-center px-6 py-[1vh]' + (animating ? ' opacity-0' : ' opacity-100')}
          style={{backgroundColor: teamColor ? teamColor[1]: undefined}}>
          <input maxLength={30} ref={inputRef} type="text" className={'font-bold text-center cursor-default w-auto rounded-lg' + (editing ? ' bg-white' : ' bg-transparent')}
          value={(editing ? newTeamName : teamName) ?? ""} disabled={!editing}
          onChange={(e) => setNewTeamName(e.target.value)}
          onKeyDown={(e) => {
          if (e.key === "Enter") {
              saveEdit();
          }
          }}>
          </input>
          <button type="button" className={'cursor-pointer px-[1vh] rounded-lg text-black' + (editing ? ' bg-lime-500 hover:bg-lime-600 hover:text-white' : 'bg-transparent hover:bg-gray-600 hover:text-white')}
          onClick={() => {
            if (editing)
              saveEdit();
            else{
              setEditing(true);
              setTimeout(() => {
                inputRef.current?.focus();
              }, 0);
            }
              
          }}>
            {editing ? <CheckCircleIcon className="fill-white w-5 h-5"/> : <PencilSquareIcon className='w-[1em] h-[1em]'/>}
          </button>
        </div>
          

          <div className={`members-container outline-dashed outline-black overflow-visible flex flex-wrap gap-3 justify-around items-around px-[5vw] py-[5vh] md:max-w-[30vw] rounded-full` + (animating ? ' outline-0' : ' outline-2')}
          style={{backgroundColor: animating ? 'transparent': teamColor?.[1]}}>
              {members.map((member, index) => (
                  <div onMouseLeave={onSpriteLeave} onMouseEnter={onSpriteHover} className='flex flex-col member-container md:flex-[30%] items-center justify-center gap-2' key={member.id}>
                    <span onClick={(e) => openPopover(e, index)} className='sprite-shadow'><img src={sprites[index]} alt="avatar" className='member-avatar min-w-[10%] h-[10vh] md:min-w-[4vw] md:h-[4.5vw] object-contain'/></span>
                    <div className='flex stroke-1 gap-1 items-center justify-center'>
                      {currentLeader === index && 
                      <svg className={'leader-icon h-[20px] w-[20px] shrink-0 fill-yellow-500 stroke-black stroke-1'+ (animating ? ' opacity-0' : ' opacity-100')} viewBox="0 0 24 24">
                        <path d="m19.687 14.093.184-1.705c.097-.91.162-1.51.111-1.888H20a1.5 1.5 0 1 0-1.136-.52c-.326.201-.752.626-1.393 1.265-.495.493-.742.739-1.018.777a.83.83 0 0 1-.45-.063c-.254-.112-.424-.416-.763-1.025l-1.79-3.209c-.209-.375-.384-.69-.542-.942a2 2 0 1 0-1.816 0c-.158.253-.333.567-.543.942L8.76 10.934c-.34.609-.51.913-.764 1.025a.83.83 0 0 1-.45.063c-.275-.038-.522-.284-1.017-.777-.641-.639-1.067-1.064-1.393-1.265A1.5 1.5 0 1 0 4 10.5h.018c-.051.378.014.979.111 1.888l.184 1.705c.102.946.186 1.847.29 2.657h14.794c.104-.81.188-1.71.29-2.657M10.912 21h2.176c2.836 0 4.254 0 5.2-.847.413-.37.674-1.036.863-1.903H4.849c.189.867.45 1.534.863 1.903.946.847 2.364.847 5.2.847"/>
                      </svg>}
                      <div className='z-10 text-center px-4 member-name bg-white rounded-full md:px-2 border-1' key={member.id}>{member.name}</div>
                      {currentLeader === index && <div className={'flex-grow w-[20px]' + (animating ? ' opacity-0' : ' opacity-100')}></div>}
                    </div>
                  </div>
              ))}
          </div>
      </div>
      {leaderEnabled && <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={closePopover}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
      >
        <div className={'flex p-4 gap-2 items-center' + (animating ? ' opacity-0' : ' opacity-100') + (currentLeader === selectedMember ? ' bg-gray-300 cursor-not-allowed' : ' hover:bg-gray-100 cursor-pointer')} 
        onClick={(currentLeader === selectedMember ? undefined : () => {changeLeader(selectedMember), closePopover()})}>
          <svg viewBox="0 0 24 24" className={'w-[1em] h-[1em] leader-icon items-center stroke-black stroke-1' + (animating ? ' opacity-0' : ' opacity-100') + (currentLeader === selectedMember ? ' fill-gray-500' : ' fill-yellow-500')}>
            <path d="m19.687 14.093.184-1.705c.097-.91.162-1.51.111-1.888H20a1.5 1.5 0 1 0-1.136-.52c-.326.201-.752.626-1.393 1.265-.495.493-.742.739-1.018.777a.83.83 0 0 1-.45-.063c-.254-.112-.424-.416-.763-1.025l-1.79-3.209c-.209-.375-.384-.69-.542-.942a2 2 0 1 0-1.816 0c-.158.253-.333.567-.543.942L8.76 10.934c-.34.609-.51.913-.764 1.025a.83.83 0 0 1-.45.063c-.275-.038-.522-.284-1.017-.777-.641-.639-1.067-1.064-1.393-1.265A1.5 1.5 0 1 0 4 10.5h.018c-.051.378.014.979.111 1.888l.184 1.705c.102.946.186 1.847.29 2.657h14.794c.104-.81.188-1.71.29-2.657M10.912 21h2.176c2.836 0 4.254 0 5.2-.847.413-.37.674-1.036.863-1.903H4.849c.189.867.45 1.534.863 1.903.946.847 2.364.847 5.2.847"/>
          </svg>
          <div>Assign as Leader</div>
        </div>
      </Popover>}
    </>
  )
}

export default Teamsheet
