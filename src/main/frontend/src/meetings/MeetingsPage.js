import {useState, useEffect} from "react";
import NewMeetingForm from "./NewMeetingForm";
import MeetingsList from "./MeetingsList";

export default function MeetingsPage({username}) {
    const [meetings, setMeetings] = useState([]);
    const [addingNewMeeting, setAddingNewMeeting] = useState(false);

    useEffect(() => {
        const fetchMeetings = async () => {
            const response = await fetch(`/api/meetings`);
            if (response.ok) {
                const meetings = await response.json();
                setMeetings(meetings);
            }
        };
        fetchMeetings();
    }, []);


    async function handleNewMeeting(meeting) {
        const response = await fetch('/api/meetings', {
            method: 'POST',
            body: JSON.stringify(meeting),
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            const createdMeeting = await response.json();
        const nextMeetings = [...meetings, createdMeeting];
            setMeetings(nextMeetings);
            setAddingNewMeeting(false);
        }
    }

    async function handleDeleteMeeting(meeting) {
        const response = await fetch(`/api/meetings/${meeting.id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            const nextMeetings = meetings.filter(m => m !== meeting);
            setMeetings(nextMeetings);
        }
    }
    async function handleJoinMeeting(meeting) {
        const response = await fetch(`/api/meetings/${meeting.id}/participants`, {
            method: 'POST',
            body: JSON.stringify({ login: username }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            const updated = await fetch(`/api/meetings/${meeting.id}`);
            const updatedMeeting = await updated.json();
            setMeetings(meetings.map(m => m.id === meeting.id ? updatedMeeting : m));
        }
    }

    async function handleLeaveMeeting(meeting) {
        const response = await fetch(`/api/meetings/${meeting.id}/participants/${username}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            const updated = await fetch(`/api/meetings/${meeting.id}`);
            const updatedMeeting = await updated.json();
            setMeetings(meetings.map(m => m.id === meeting.id ? updatedMeeting : m));
        }
    }


    return (
        <div>
            <h2>Zajęcia ({meetings.length})</h2>
            {
                addingNewMeeting
                    ? <NewMeetingForm onSubmit={(meeting) => handleNewMeeting(meeting)}/>
                    : <button onClick={() => setAddingNewMeeting(true)}>Dodaj nowe spotkanie</button>
            }
            {meetings.length > 0 &&
                <MeetingsList meetings={meetings} username={username}
                              onDelete={handleDeleteMeeting}
                              onJoin={handleJoinMeeting}
                              onLeave={handleLeaveMeeting}/>}
        </div>
    )
}
