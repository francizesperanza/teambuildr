import {useEffect, useState} from 'react'
import Modal from './Modal';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import Slider from '@mui/material/Slider';
import { Switch } from '@mui/material';

function SettingsModal({isOpen, onClose, updateSettings}) {
    const [settings, setSettings] = useState();

    useEffect(() => {
        const currSettings = localStorage.getItem('settings');
        if (currSettings) {
            setSettings(JSON.parse(currSettings));
        }
    }, []);

    const saveSettings = () => {    
        const numTeams = parseInt(document.querySelector('input[type="number"]').value);
        const leadersEnabled = document.querySelector('input[type="checkbox"]').checked;
        const settings = {
            numTeams: numTeams,
            leadersEnabled: leadersEnabled
        };
        localStorage.setItem('settings', JSON.stringify(settings));
        updateSettings(settings);
        onClose();
    }
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <h2 className="text-2xl font-bold mb-4">Settings</h2>
                <div className='flex flex-col text-sm md:text-base w-full items-center justify-around gap-4 p-6 border border-gray-300 rounded-lg mb-4'>
                    <div className='flex flex-col w-full items-center justify-between gap-4'>
                        
                        <div className='text-left w-full flex-1'>Number of Teams</div>
                        <div className='flex items-center justify-around w-full'>
                            <Slider aria-label="team size slider"
                            value={settings?.numTeams || 2}
                            onChange={(e, newValue) => setSettings({...settings, numTeams: newValue})}
                            step={1}
                            marks
                            min={2}
                            max={10}
                            valueLabelDisplay="auto"
                            sx={{
                                maxWidth: '70%',
                                color: 'rgb(132, 204, 22)'
                            }}></Slider>
                            <input type="number" min={2} max={10} value={settings?.numTeams || 2}
                                onChange={(e) => setSettings({...settings, numTeams: parseInt(e.target.value)})}
                                className="w-16 text-center border border-gray-300 rounded-lg px-2 py-1" disabled/>
                        </div>

                        <div className='flex items-center justify-around w-full'>
                            <div className='text-left w-full flex-1'>Team Leaders</div>
                            <Switch checked={settings?.leadersEnabled || false} onChange={(e) => setSettings({...settings, leadersEnabled: e.target.checked})}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: 'rgb(132, 204, 22)',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: 'rgb(132, 204, 22)',
                                    },
                            }}/>
                        </div>
                    </div>
                </div>
                <button type="button" className={`float-right relative px-5 py-3 inline-flex items-center bg-transparent text-white cursor-pointer`} id="remove-btn"
                onClick={saveSettings}>
                    <svg className='overflow-visible stroke-black stroke-2 fill-lime-500 absolute inset-0 w-full h-full hover:fill-lime-700 hover:drop-shadow-sm' viewBox="0 0 163 154" preserveAspectRatio="none">
                        <path d="M158.549 15.303c-9.424-21.057-146.69-19.74-154.205 0-7.514 19.74-4.786 108.573 3.78 126.339 8.568 17.767 129.008 15.135 141.001 0 11.994-15.134 18.847-105.282 9.424-126.339"/>
                    </svg>
                    <span className='pointer-events-none z-20 flex justify-center items-center'>
                        <CheckCircleIcon className="h-5 w-5 mr-2 inline" />
                        <div>Save</div>
                    </span>
                </button>
            </Modal>
        </>
    );
}

export default SettingsModal;