import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Teamsheet from './Teamsheet';
import { Link } from 'react-router-dom'

function Result({name, onEdit, onRemove}) {
    const {state} = useLocation();
    const members = state || [];
    const teamNumber = 2; // Default team number
    const [teams, setTeams] = useState([]);

    const randomize = (arr) => {
        let array = arr.slice();
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        const teamGroup = Array.from({ length: teamNumber }, () => []);
        
        array.forEach((member, index) => {
            teamGroup[index % teamNumber].push(member);
        });
        return teamGroup;
    }

    useEffect(() => {
        const randomizedTeams = randomize(members);
        console.log('randomizedTeams:', randomizedTeams);
        setTeams(randomizedTeams);
    },[members]);

    return (
        <>
        <div className='flex items-center justify-center flex-col p-[5vh] min-h-dvh gap-[10vh] overflow-y-auto'>
            <div>Here are the teams:</div>
            <div id="teams-container" className='flex justify-center items-center gap-4'>
                <div id="team-member-section" className='flex flex-row gap-[10vw]'>
                    {teams.length > 0 && teams.map((team, index) => (
                        <Teamsheet key={index} members={team} />
                    ))}
                </div>
            </div>
            <div>
                <Link to="/">
                    <button type="button" className="bg-blue-500 px-6 py-3 rounded-lg text-white" id="generate-btn">Go Back</button>
                </Link>
            </div>
        </div>
        </>
    )
}

export default Result