import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import Member from './Member.jsx'
import { Link } from 'react-router-dom'
import { animate, stagger, createScope, set, random } from 'animejs'
import './Teamsheet.css'
import { StarIcon } from '@heroicons/react/16/solid'

function Teamsheet({members, teamColor, teamName, leader, animating, setAnimating}) {
  const scope = useRef(null);
  const root = useRef(null);

  const [sprites, setSprites] = useState([]);
  leader = 0;

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
      <div ref={root} className='overflow-visible flex-[20%] flex items-center justify-center flex-col p-[.1vh] gap-3'>
          <div className={'font-bold outline-dashed outline-black outline-2 text-center rounded-full px-[1vw] py-[1vh]' + (animating ? ' opacity-0' : ' opacity-100')}
          style={{backgroundColor: teamColor ? teamColor[1]: undefined}}>{teamColor ? teamColor[0] : 'Team'} {teamName}</div>

          <div className={`members-container outline-dashed outline-black overflow-visible flex flex-wrap gap-3 justify-around items-around px-[5vw] py-[5vh] max-w-[30vw] rounded-full` + (animating ? ' outline-0' : ' outline-2')}
          style={{backgroundColor: animating ? 'transparent': teamColor?.[1]}}>
              {members.map((member, index) => (
                  <div onMouseLeave={onSpriteLeave} onMouseEnter={onSpriteHover} className='flex flex-col member-container flex-[30%] items-center justify-center gap-2' key={member.id}>
                    <span className='sprite-shadow'><img src={sprites[index]} alt="avatar" className='member-avatar min-w-[4vw] h-[4.5vw] object-contain'/></span>
                    <div className='flex stroke-1 gap-1 items-center justify-center'>
                      {leader === index && 
                      <svg className={'leader-icon basis-sm h-10 w-10 fill-yellow-500 stroke-black stroke-1'+ (animating ? ' opacity-0' : ' opacity-100')} viewBox="0 0 24 24">
                        <path d="m19.687 14.093.184-1.705c.097-.91.162-1.51.111-1.888H20a1.5 1.5 0 1 0-1.136-.52c-.326.201-.752.626-1.393 1.265-.495.493-.742.739-1.018.777a.83.83 0 0 1-.45-.063c-.254-.112-.424-.416-.763-1.025l-1.79-3.209c-.209-.375-.384-.69-.542-.942a2 2 0 1 0-1.816 0c-.158.253-.333.567-.543.942L8.76 10.934c-.34.609-.51.913-.764 1.025a.83.83 0 0 1-.45.063c-.275-.038-.522-.284-1.017-.777-.641-.639-1.067-1.064-1.393-1.265A1.5 1.5 0 1 0 4 10.5h.018c-.051.378.014.979.111 1.888l.184 1.705c.102.946.186 1.847.29 2.657h14.794c.104-.81.188-1.71.29-2.657M10.912 21h2.176c2.836 0 4.254 0 5.2-.847.413-.37.674-1.036.863-1.903H4.849c.189.867.45 1.534.863 1.903.946.847 2.364.847 5.2.847"/>
                      </svg>}
                      <div className='member-name bg-white rounded-full px-2 border-1' key={member.id}>{member.name}</div>
                      {leader === index && <div className={'flex-grow basis-sm' + (animating ? ' opacity-0' : ' opacity-100')}></div>}
                    </div>
                  </div>
              ))}
          </div>
      </div>
    </>
  )
}

export default Teamsheet
