import {useEffect, useState} from 'react'
import Modal from './Modal';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import Slider from '@mui/material/Slider';

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
        const settings = {
            numTeams: numTeams
        };
        localStorage.setItem('settings', JSON.stringify(settings));
        updateSettings(numTeams);
        onClose();
    }
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <h2 className="text-2xl font-bold mb-4">Settings</h2>
                <div className='flex flex-col w-full items-center justify-around gap-4 p-6 border border-gray-300 rounded-lg mb-4'>
                    <div className='flex flex-col w-full items-center justify-between gap-4'>
                        
                        <div className='text-left w-full flex-1'>Number of Teams</div>
                        <div className='flex items-center justify-around w-full'>
                            <Slider aria-label="Small steps"
                            value={settings?.numTeams || 2}
                            onChange={(e, newValue) => setSettings({...settings, numTeams: newValue})}
                            step={1}
                            marks
                            min={2}
                            max={10}
                            valueLabelDisplay="auto"
                            sx={{
                                maxWidth: '70%',
                                color: 'success.light'
                            }}></Slider>
                            <input type="number" min={2} max={10} value={settings?.numTeams || 2}
                                onChange={(e) => setSettings({...settings, numTeams: parseInt(e.target.value)})}
                                className="w-16 text-center border border-gray-300 rounded-lg px-2 py-1" disabled/>
                        </div>
                    </div>
                </div>
                <button onClick={saveSettings} className="float-right flex items-center justify-center bg-lime-500 text-white px-4 py-2 rounded hover:bg-lime-600">
                    <CheckCircleIcon className="h-5 w-5 mr-2 inline" /> Save
                </button>
            </Modal>
        </>
    );
}

export default SettingsModal;