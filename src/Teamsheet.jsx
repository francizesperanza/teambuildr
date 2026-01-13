import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Member from './Member.jsx'
import { Link } from 'react-router-dom'
import { animate, stagger, createScope, set } from 'animejs'

function Teamsheet({members, animating, setAnimating}) {
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
            animate('.member-name',{
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

            return () => scope.current.revert();
        })
    }, []);

  return (
    <>
      <div ref={root} className='overflow-visible flex items-center justify-center flex-col p-[2vh] gap-4'>
          <div className={animating ? 'opacity-0' : 'opacity-100'}>Team Payaman</div>
          <div id="members-container" className='overflow-visible flex flex-col gap-3 justify-center items-center bg-green-200 p-6 rounded-full'>
              {members.map((member) => (
                  <div className='member-name' key={member.id}>{member.name}</div>
              ))}
          </div>
      </div>
    </>
  )
}

export default Teamsheet
