import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'


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
        setTeams(randomize(members));
        console.log(teams);
        const teamsContainer = document.getElementById('teams-container');
        teamsContainer.innerHTML = '';
    },[members]);

    return (
        <>
        <div className='flex items-center justify-center flex-col p-[10vh] min-h-dvh gap-[10vh] overflow-y-auto'>
            <div>Here are the teams:</div>
            <div id="teams-container" className='flex flex-col gap-4'>
                <div id="team-info">
                    <div>Team Name</div>
                    <div id="team-member-section"></div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Result