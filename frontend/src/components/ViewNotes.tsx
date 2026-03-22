import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

export default function ViewNotes() {

    const [notes, setNotes] = useState([]);

    const {id} = useParams();
    useEffect(() => {
        async function displayNotes() {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/tickets/${id}/notes`)

                if (!response.ok) {
                    throw new Error("failed to fetch notes");
                }

                const data = await response.json();

                setNotes(data)

            } catch (error) {
                console.log(error)
            }
        }

        if (id) {
            displayNotes();
        }
    }, [id]);


    return (
        <>
            <div>
                {notes.map((note, index) => (
                    <div key={index}>{note.text}</div>
                ))}
            </div>
        </>
    );
}