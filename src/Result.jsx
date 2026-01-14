import { use, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Teamsheet from './Teamsheet'
import { Link } from 'react-router-dom'
import { set } from 'animejs';


function Result({name, onEdit, onRemove}) {
    const {state} = useLocation();
    const members = state || [];
    const teamNumber = 2; // Default team number
    const [teams, setTeams] = useState([]);
    const [animating, setAnimating] = useState(true);

    const [teamNames, setTeamNames] = useState([]);
    const [teamColors, setTeamColors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const teamColorMap = {
        'Red': 'bg-red-200',
        'Blue': 'bg-blue-200',
        'Green': 'bg-green-200',
        'Yellow': 'bg-yellow-200',
        'Purple': 'bg-purple-200',
        'Pink': 'bg-pink-200'
    }

    const capitalize = (word) => {
        var words = word.split(' ');
        var capitalizedWords = words.map(w => {
            return w.charAt(0).toUpperCase() + w.slice(1);
        });
        return capitalizedWords.join(' ');
    }

    const pluralize = (data) => {
        var arr;
        arr = data.map(item => {
            var capitalizedWords = capitalize(item.word);
            if (capitalizedWords.endsWith('s') || capitalizedWords.endsWith('x') || capitalizedWords.endsWith('z') || capitalizedWords.endsWith('ch') || capitalizedWords.endsWith('sh')) {
                return capitalizedWords + 'es';
            } else if (capitalizedWords.endsWith('ouse')) {
                return capitalizedWords.replace('ouse', 'ice');
            } else if (capitalizedWords.endsWith('y') && !['a','e','i','o','u'].includes(capitalizedWords.charAt(capitalizedWords.length - 2).toLowerCase())) {
                return capitalizedWords.slice(0, -1) + 'ies';
            } else if (capitalizedWords.endsWith('Goose')) {
                return capitalizedWords.replace('Goose', 'Geese');
            } else {
                return capitalizedWords + 's';
            }
        });
        return arr;
    };

    const randomizeTeamColors = () => {
        const colors = Object.entries(teamColorMap);
        let selectedColors = [];
        while (selectedColors.length < teamNumber) {
            const randomIndex = Math.floor(Math.random() * colors.length);
            const color = colors[randomIndex];  
            if (!selectedColors.includes(color)) {
                selectedColors.push(color);
            }
        }
        console.log(selectedColors);
        return selectedColors;
    };

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
        setTeams(randomizedTeams);
    },[members]);

    // fetch random animal words from word API
    useEffect(() => {
        fetch('https://random-words-api.kushcreates.com/api?language=en&category=animals&type=capitalized&words='+teamNumber)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setTeamNames(pluralize(data));
            setTeamColors(randomizeTeamColors());
            setLoading(false);
        })
        .catch(error => {
            setError(error);
            setLoading(false);
        });
    }, []);

    

    return (
        <>
        <div className='flex items-center justify-center flex-col p-[5vh] min-h-dvh gap-[10vh] overflow-hidden'>
            <div className={animating ? 'opacity-0' : 'opacity-100'}>Here are the teams:</div>
            <div id="teams-container" className='flex justify-center items-center gap-4 overflow-visible'>
                <div id="team-member-section" className='overflow-visible flex flex-row gap-[10vw]'>
                    {teams.length > 0 && teams.map((team, index) => (
                        <Teamsheet key={index} teamColor={teamColors?.[index]} teamName={teamNames[index]} members={team} animating={animating} setAnimating={setAnimating} />
                    ))}
                </div>
            </div>
            <div>
                <Link to="/"
                    state={members}>
                    <button type="button" className={`bg-blue-500 px-6 py-3 rounded-lg text-white ${animating ? 'opacity-0' : 'opacity-100'}`} id="back-btn">Go Back</button>
                </Link>
            </div>
        </div>
        </>
    )
}

export default Result