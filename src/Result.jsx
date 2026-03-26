import { use, useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom'
import Teamsheet from './Teamsheet'
import { Link } from 'react-router-dom'
import { animate, set} from 'animejs';
import { ClipboardDocumentIcon, ClipboardDocumentListIcon } from '@heroicons/react/16/solid';
import { BackwardIcon } from '@heroicons/react/24/solid';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { ToastContainer, toast } from 'react-toastify';
import Footer from './Footer';


function Result() {
    const {state} = useLocation();
    const members = state?.members;
    const teamNumber = state?.numTeams;
    const leadersEnabled = state?.leadersEnabled;
    const [teams, setTeams] = useState([]);
    const [animating, setAnimating] = useState(true);
    const [teamNames, setTeamNames] = useState([]);
    const [teamColors, setTeamColors] = useState([]);
    const [leaderIndexes, setLeaderIndexes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const randomizeLeaders = (arr) => {
        let leaderIndexes = [];
        let array = arr.slice();
        for (let i = 0; i < teamNumber; i++) {
            const randomIndex = Math.floor(Math.random() * array[i].length);
            leaderIndexes.push(randomIndex);
        }
        return leaderIndexes;
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
        let leaderIndexes = JSON.parse(localStorage.getItem('leaderIndexes'));

        names.forEach((name, index) => {
            clipboardText += `${name}:\n`;
            teams[index].forEach(member => {
                if(leaderIndexes?.[index] === teams[index].indexOf(member)) {
                    clipboardText += `- ${member.name} (Leader)\n`;
                } else {
                    clipboardText += `- ${member.name}\n`;
                }
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

    const createTeamNames = (names, colors) => {
        // more default name themes soon
        const teamNames = Array.from({ length: teamNumber }, () => []);
        if (true) {
            for (let i = 0; i < teamNames.length; i++) {
                const color = colors?.[i]?.[0] ?? "";
                const name = names?.[i] ?? "";
                teamNames[i] = `${color} ${name}`;
            }
        }
        return teamNames;
    }

    const editTeamName = (index, newName) => {
        let newNames = teamNames.map((name, i) => i === index ? newName : name);
        setTeamNames(newNames);
        localStorage.setItem('teamNames', JSON.stringify(newNames));
    }

    // on page load, randomize teams and store in local storage
    useEffect(() => {
        const randomizedTeams = randomize(members);
        setTeams(randomizedTeams);
        if(leadersEnabled) {
            const leaders = randomizeLeaders(randomizedTeams);
            setLeaderIndexes(leaders);
            localStorage.setItem('leaderIndexes', JSON.stringify(leaders));
        }
        localStorage.setItem('teams', JSON.stringify(randomizedTeams));
    },[members]);

    // fetch random animal words from word API then randomize team colors
    useEffect(() => {
        fetch('https://random-words-api.kushcreates.com/api?language=en&category=animals&type=capitalized&words='+teamNumber)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            // for animal theme
            const pluralized = pluralize(data);
            const colors = randomizeTeamColors();
            
            setTeamColors(colors);
            setTeamNames(createTeamNames(pluralized, colors));
            
            localStorage.setItem('teamColors', JSON.stringify(colors));
            localStorage.setItem('teamNames', JSON.stringify(pluralized));
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
        <div className='result-bg flex items-center justify-center flex-col md:p-[5vh] p-[3vw] min-h-dvh gap-[10vh] overflow-hidden bg-[url(./assets/teambuildr_bg_tile.svg)] bg-repeat bg-size-[40vh]'>
            <div className={`text-center bg-white px-4 py-2 rounded-lg title text-5xl border-2 border-dashed` + (animating ? ' opacity-0' : ' opacity-100')}>Here are the teams:</div>
            <div id="teams-container" className='flex justify-center items-center gap-2 overflow-visible w-[90%] md:w-[85%] h-auto'>
                <div id="team-member-section" className='overflow-visible flex flex-wrap flex-row gap-4 items-center justify-center'>
                    {teams.length > 0 && teams.map((team, index) => (
                        <Teamsheet key={index} teamColor={teamColors?.[index]} onEdit={(newName) => editTeamName(index, newName)} teamIndex={index} teamName={teamNames?.[index]} leaderEnabled={leadersEnabled} leader={leaderIndexes[index]} members={team} animating={animating} setAnimating={setAnimating} />
                    ))}
                </div>
            </div>
            <div className={'flex flex-row text-sm md:text-base justify-center items-center gap-5 bg-white px-3 w-full md:px-6 py-4 rounded-lg border-2 border-dashed ' + (animating ? 'opacity-0' : 'opacity-100')}>
                <Link to="/"
                    state={members}>
                    <button type="button" className={`relative md:px-10 md:py-5 py-3 px-2 inline-flex items-center bg-transparent rounded-lg text-white cursor-pointer`} id="back-btn">
                        <svg className='overflow-visible stroke-black stroke-2 fill-gray-500 absolute inset-0 w-full h-full hover:fill-gray-700 hover:drop-shadow-sm' viewBox="0 0 380 154" preserveAspectRatio="none">
                            <path d="M369.813 15.298c-21.977-21.035-342.104-19.72-359.63 0C-7.342 35.018-.979 123.755 19 141.503c19.98 17.748 300.864 15.119 328.836 0 27.971-15.118 43.954-105.17 21.977-126.205"/>                        </svg>
                        <span className='pointer-events-none z-20'>
                            <ArrowLeftIcon className=" h-6 w-6 inline-block mr-2 -mt-1"/>
                            <span>Go Back</span>
                        </span>
                    </button>
                </Link>

                <button type="button" onClick={copyToClipboard} className={`relative md:px-10 md:py-5 py-3 px-2 inline-flex items-center bg-transparent rounded-lg text-white cursor-pointer`} id="copy-to-clipboard-btn">
                    <svg className='overflow-visible stroke-black stroke-2 fill-lime-500 absolute inset-0 w-full h-full hover:fill-lime-700 hover:drop-shadow-sm' viewBox="0 0 380 154" preserveAspectRatio="none">
                        <path d="M369.813 15.298c-21.977-21.035-342.104-19.72-359.63 0C-7.342 35.018-.979 123.755 19 141.503c19.98 17.748 300.864 15.119 328.836 0 27.971-15.118 43.954-105.17 21.977-126.205"/>                    </svg>
                    <span className='pointer-events-none z-20'>
                        <ClipboardDocumentListIcon className="h-6 w-6 inline-block mr-2 -mt-1" />
                        <span>Copy to Clipboard</span>
                    </span>
                </button>                
            </div>
        </div>
        <Footer />
        </>
    )
}

export default Result