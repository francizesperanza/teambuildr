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
            <div className='flex gap-2 bg-gray-100 rounded-lg px-4 py-2 w-full items-center justify-center hover:bg-gray-200'>
                <input type="text" value={editing ? newName : name} disabled={!editing}
                onChange={(e) => setNewName(e.target.value)}
                className={`w-full px-2 py-1 rounded ${editing ? 'bg-white' : 'bg-transparent'}`}
                onKeyDown={(e) => {
                if (e.key === "Enter") {
                    editing ? saveEdit() : setEditing(true)
                };
                }}></input>

                <button type="button"
                onClick={editing ? saveEdit : () => setEditing(true)}
                className="bg-gray-500 px-6 py-3 rounded-lg text-white hover:bg-gray-600">{editing ? "Save" : "Edit"}</button>

                <button type="button" onClick={() => onRemove()} className="bg-red-500 px-6 py-3 rounded-lg text-white hover:bg-red-600">Remove</button>
            </div>
        </>
    )
}

export default Member