import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Member from './Member.jsx'
import { Link } from 'react-router-dom'
import { animate, stagger, createScope, set } from 'animejs'

function Teamsheet({members, teamName, animating, setAnimating}) {
  const scope = useRef(null);
  const root = useRef(null);

  const minX = -window.innerWidth / 2 + 100;
  const minY = -window.innerHeight / 2 + 100;

  const maxX = window.innerWidth / 2 - 100;
  const maxY = window.innerHeight / 2 - 100;

  //animation
    useEffect(() => {
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
                  { to: -15, delay: 1725, duration: 50},
                  { to: 15, duration: 375},
                  { to: -15, duration: 375},
                  { to: 15, duration: 375},
                  { to: 0, duration: 375},
                  { to: 15, duration: 250, delay: 100},
                  { to: 0, duration: 250},
                ],
                translateY:[
                  { to: -40, delay: 3900, duration: stagger(50)},
                  { to: 0, duration: 25},
                ]
            });

            return () => scope.current.revert();
        })
    }, []);

  return (
    <>
      <div ref={root} className='overflow-visible flex items-center justify-center flex-col p-[2vh] gap-4'>
          <div className={animating ? 'opacity-0' : 'opacity-100'}>Team {teamName}</div>
          <div id="members-container" className='overflow-visible flex flex-wrap gap-3 justify-center items-center bg-green-200 px-[3vw] py-[7vh] rounded-full'>
              {members.map((member) => (
                  <div className='member-container flex flex-[30%] flex-col items-center justify-center gap-2' key={member.id}>
                    <div className='member-avatar border-black border bg-red-100 px-2 py-4 rounded-lg'></div>
                    <div className='member-name' key={member.id}>{member.name}</div>
                  </div>
              ))}
          </div>
      </div>
    </>
  )
}

export default Teamsheet
