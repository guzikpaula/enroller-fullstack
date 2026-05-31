import "milligram";
import './App.css';
import {useState} from "react";
import LoginForm from "./LoginForm";
import UserPanel from "./UserPanel";

function App() {
    const [loggedIn, setLoggedIn] = useState('');

    async function login(email) {
        if (email) {
            await fetch('/api/participants', {
                method: 'POST',
                body: JSON.stringify({ login: email }),
                headers: { 'Content-Type': 'application/json' }
            });
            setLoggedIn(email);
        }
    }

    function logout() {
        setLoggedIn('');
    }

    return (
        <div>
            <h1>System do zapisów na zajęcia</h1>
            {loggedIn ? <UserPanel username={loggedIn} onLogout={logout}/> : <LoginForm onLogin={login}/>}
        </div>
    );
}

export default App;
