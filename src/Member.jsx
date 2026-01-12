import { useState } from 'react'


function Member({name, onEdit, onRemove}) {
    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState(name);

    const saveEdit = () => {
        onEdit(newName);
        setEditing(false);
    }

    return (
        <>
            <div className='flex gap-[1vw] bg-gray-100 rounded-lg px-[1vw] py-[2vh] w-full place-content-between hover:bg-gray-200'>
                <input type="text" value={editing ? newName : name} disabled={!editing}
                onChange={(e) => setNewName(e.target.value)}
                className={`truncate text-wrap justify-between grow flex-wrap text-justify w-full px-2 py-1 rounded ${editing ? 'bg-white' : 'bg-gray-300'}`}
                onKeyDown={(e) => {
                if (e.key === "Enter") {
                    editing ? saveEdit() : setEditing(true)
                };
                }}></input>

                <div className='flex justify-center gap-[1vw] shrink'>
                    <button type="button"
                    onClick={editing ? saveEdit : () => setEditing(true)}
                    className="bg-gray-500 px-[1vw] py-[1vh] rounded-lg text-white hover:bg-gray-600">{editing ? "Save" : "Edit"}</button>

                    <button type="button" onClick={() => onRemove()} className="bg-red-500 px-[1vw] py-[1vh] rounded-lg text-white hover:bg-red-600">Remove</button>
                </div>
            </div>
        </>
    )
}

export default Member