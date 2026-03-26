import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';


function Member({name, onEdit, onRemove}) {
    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState(name);

    const saveEdit = () => {
        if (newName.length === 0) {
            toast.error('You need a name!', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }
        onEdit(newName);
        setEditing(false);
    }

    return (
        <>
            <ToastContainer />
            <div className='flex items-center gap-[1vw] bg-gray-100 rounded-lg px-[1vw] py-[2vh] w-full place-content-between hover:bg-gray-200'>
                <input type="text" maxLength={30} value={editing ? newName : name} disabled={!editing}
                onChange={(e) => setNewName(e.target.value)}
                className={`truncate text-wrap justify-between grow flex-wrap text-justify h-full w-[60%] px-2 py-2 rounded ${editing ? 'bg-white' : 'bg-gray-300'}`}
                onKeyDown={(e) => {
                if (e.key === "Enter") {
                    editing ? saveEdit() : setEditing(true)
                };
                }}></input>

                <div className='flex justify-center text-xs md:text-base gap-[1vw] shrink md:h-[70%]'>
                    <button type="button" className={` relative px-3 py-3 inline-flex items-center bg-transparent text-white cursor-pointer`} id="edit-btn"
                    onClick={editing ? saveEdit : () => setEditing(true)}>
                        <svg className={'overflow-visible stroke-black stroke-2 absolute inset-0 w-full h-full hover:drop-shadow-sm' + (editing ? ' fill-lime-500 hover:fill-lime-700' : ' fill-gray-500 hover:fill-gray-700')} viewBox="0 0 163 154" preserveAspectRatio="none">
                            <path d="M158.549 15.303c-9.424-21.057-146.69-19.74-154.205 0-7.514 19.74-4.786 108.573 3.78 126.339 8.568 17.767 129.008 15.135 141.001 0 11.994-15.134 18.847-105.282 9.424-126.339"/>
                        </svg>
                        <span className='pointer-events-none z-20 flex justify-center items-center'>
                            <div>{editing ? "Save" : "Edit"}</div>
                        </span>
                    </button>

                    <button type="button" className={`relative px-3 py-3 inline-flex items-center bg-transparent text-white cursor-pointer`} id="remove-btn"
                    onClick={() => onRemove()}>
                        <svg className='overflow-visible stroke-black stroke-2 fill-red-600 absolute inset-0 w-full h-full hover:fill-red-800 hover:drop-shadow-sm' viewBox="0 0 163 154" preserveAspectRatio="none">
                            <path d="M158.549 15.303c-9.424-21.057-146.69-19.74-154.205 0-7.514 19.74-4.786 108.573 3.78 126.339 8.568 17.767 129.008 15.135 141.001 0 11.994-15.134 18.847-105.282 9.424-126.339"/>
                        </svg>
                        <span className='pointer-events-none z-20 flex justify-center items-center'>
                            <div>Remove</div>
                        </span>
                    </button>
                </div>
            </div>
        </>
    )
}

export default Member