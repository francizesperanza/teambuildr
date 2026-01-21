import { use, useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom'
import Teamsheet from './Teamsheet'
import { Link } from 'react-router-dom'
import { animate, set} from 'animejs';
import { ClipboardDocumentIcon, ClipboardDocumentListIcon } from '@heroicons/react/16/solid';
import { BackwardIcon } from '@heroicons/react/24/solid';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { ToastContainer, toast } from 'react-toastify';


function Result() {
    const {state} = useLocation();
    const members = state?.members;
    const teamNumber = state?.numTeams;
    const [teams, setTeams] = useState([]);
    const [animating, setAnimating] = useState(true);

    const [teamNames, setTeamNames] = useState([]);
    const [teamColors, setTeamColors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const teamColorMap = {
        'Red': 'rgb(226, 59, 59)',
        'Blue': 'rgb(128, 190, 253)',
        'Green': 'rgb(37, 211, 83)',
        'Yellow': 'rgb(255, 252, 94)',
        'Purple': 'rgb(193, 142, 255)',
        'Pink': 'rgb(255, 174, 212)',
        'Orange': 'rgb(255, 153, 0)',
        'Teal': 'rgb(55, 219, 172)',
        'Brown': 'rgb(182, 70, 19)',
        'Gray': 'rgb(163, 163, 163)',
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

    const copyToClipboard = () => {
        let clipboardText = '';
        let names = JSON.parse(localStorage.getItem('teamNames'));
        let colors = JSON.parse(localStorage.getItem('teamColors'));
        let teams = JSON.parse(localStorage.getItem('teams'));

        names.forEach((name, index) => {
            clipboardText += `${colors[index][0]} ${name}:\n`;
            teams[index].forEach(member => {
                clipboardText += `- ${member.name}\n`;
            });
            clipboardText += `\n`;
        });

        navigator.clipboard.writeText(clipboardText);
        toast.success('Teams copied to clipboard!', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    useEffect(() => {
        const randomizedTeams = randomize(members);
        setTeams(randomizedTeams);
        localStorage.setItem('teams', JSON.stringify(randomizedTeams));
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
            const pluralized = pluralize(data);
            const colors = randomizeTeamColors();

            setTeamNames(pluralized);
            setTeamColors(colors);

            localStorage.setItem('teamNames', JSON.stringify(pluralized));
            localStorage.setItem('teamColors', JSON.stringify(colors));
            setLoading(false);
        })
        .catch(error => {
            setError(error);
            setLoading(false);
        });
    }, []);

    return (
        <>
        <ToastContainer />
        <div className='result-bg flex items-center justify-center flex-col p-[5vh] min-h-dvh gap-[10vh] overflow-hidden bg-[url(./assets/teambuildr_bg_tile.svg)] bg-repeat bg-size-[40vh]'>
            <div className={animating ? 'opacity-0' : 'opacity-100'}>Here are the teams:</div>
            <div id="teams-container" className='flex justify-center items-center gap-2 overflow-visible w-[85%] h-auto'>
                <div id="team-member-section" className='overflow-visible flex flex-wrap flex-row gap-4 items-center justify-center'>
                    {teams.length > 0 && teams.map((team, index) => (
                        <Teamsheet key={index} teamColor={teamColors?.[index]} teamName={teamNames[index]} members={team} animating={animating} setAnimating={setAnimating} />
                    ))}
                </div>
            </div>
            <div className={'flex flex-row justify-center items-center gap-5 bg-white px-6 py-4 rounded-lg ' + (animating ? 'opacity-0' : 'opacity-100')}>
                <Link to="/"
                    state={members}>
                    <button type="button" className={`bg-gray-500 px-6 py-3 rounded-lg text-white`} id="back-btn">
                        <ArrowLeftIcon className="h-6 w-6 inline-block mr-2 -mt-1" />Go Back</button>
                </Link>

                <button type="button" onClick={copyToClipboard} className={`bg-lime-500 px-6 py-3 rounded-lg text-white`} id="rebuild-btn">
                    <ClipboardDocumentListIcon className="h-6 w-6 inline-block mr-2 -mt-1" />Copy to Clipboard</button>                
            </div>
        </div>
        </>
    )
}

export default Result