import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import Member from './Member.jsx'
import { Link } from 'react-router-dom'
import { animate, stagger, createScope, set, random } from 'animejs'

function Teamsheet({members, teamColor, teamName, animating, setAnimating}) {
  const scope = useRef(null);
  const root = useRef(null);

  const [sprites, setSprites] = useState([]);

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
    animate(e.currentTarget.querySelector('.member-avatar'),{
        scale: [
          { to: 1.2, duration: 200 },
        ]
    });
    animate(e.currentTarget.querySelector('.member-name'),{
        scale: [
          { to: 1.2, duration: 200 },
        ]
    });
  }

  const onSpriteLeave = (e) => {
    if (animating) return;
    animate(e.currentTarget.querySelector('.member-avatar'),{
        scale: [
          { to: 1, duration: 100},
        ],
    });

    animate(e.currentTarget.querySelector('.member-name'),{
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
                  { to: 10, duration: 375},
                  { to: -10, duration: 375},
                  { to: 10, duration: 375},
                  { to: 0, duration: 375},
                  { to: 10, duration: 250, delay: 100},
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
      <div ref={root} className='overflow-visible flex-[40%] flex items-center justify-center flex-col p-[.1vh] gap-3'>
          <div className={'text-center rounded-lg px-[1vw] py-[1vh]' + (teamColor ? ' ' + teamColor[1] : '') + (animating ? ' opacity-0' : ' opacity-100')}>{teamColor ? teamColor[0] : 'Team'} {teamName}</div>
          <div id="members-container" className={`overflow-visible flex flex-wrap gap-3 justify-around items-around px-[2vw] py-[2vh] w-[90%] rounded-full ${animating ? 'bg-[url(./assets/teambuildr_bg_tile.svg)]' : teamColor[1]}`} >
              {members.map((member, index) => (
                  <div onMouseLeave={onSpriteLeave} onMouseEnter={onSpriteHover} className='flex flex-col member-container flex-[30%] items-center justify-center gap-2' key={member.id}>
                    <img src={sprites[index]} alt="avatar" className='member-avatar w-[4.5vw] h-[4.5vw]'/>
                    <div className='member-name' key={member.id}>{member.name}</div>
                  </div>
              ))}
          </div>
      </div>
    </>
  )
}

export default Teamsheet
