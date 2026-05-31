import "./MeetingList.css";

export default function MeetingsList({meetings, username, onDelete, onJoin, onLeave}) {
    return (
        <table>
            <thead>
            <tr>
                <th>Nazwa spotkania</th>
                <th>Opis</th>
                <th>Liczba uczestników</th>
                <th>Akcje</th>
            </tr>
            </thead>
            <tbody>
            {
            meetings.map((meeting, index) => {
                const isEnrolled = meeting.participants.some(p => p.login === username);
                return <tr key={index}>
            <td>{meeting.title}</td>
            <td>{meeting.description}</td>
            <td>{meeting.participants.length}</td>
            <td>{isEnrolled
                    ? <button onClick={() => onLeave(meeting)}>Wypisz się</button>
                    : <button onClick={() => onJoin(meeting)}>Zapisz się</button>
                }
                {meeting.participants.length === 0 &&
                    <button className = "button button-outline button-red" onClick={() => onDelete(meeting)}>Usuń</button>
                }
            </td>
            </tr>;
            })
            }
            </tbody>
        </table>
    )
}
