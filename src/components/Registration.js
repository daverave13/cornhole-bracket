import { useState, useEffect } from 'react';
import trashCanIcon from "../img/trashCan.png";
import './registration.css';

const Registration = (props) => {

    const [teamName, setTeamName] = useState('');
    const [teams, setTeams] = useState([]);

    const onBuildClick = () => {
        props.setRegMode(false);
    }

    const onInputChange = (e) => {
        setTeamName(e.target.value);
    }

    const submitForm = async (e) => {
        e.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({teamName: teamName})
        }

        await fetch('https://dslusser.com:5000/api/teams', requestOptions)
            .then(response => response.json());

        setTeamName('');
    }

    const getTeams = async () => {
        
        const requestOptions = {
            method: 'GET'
        }

        await fetch('https://dslusser.com:5000/api/teams', requestOptions)
            .then(response => response.json())
            .then(data => setTeams(data));
    }

    const onCloseClick = async (id) => {
        const requestOptions = {
            method: "DELETE",
        };

        await fetch(
            "https://dslusser.com:5000/api/teams/" + id,
            requestOptions
        ).then((response) => response.text());
        getTeams();
    };

    useEffect(() => {
        getTeams();
    }, [teamName])

    const renderedTeams = teams.map((team, idx) => {
        return (
            <div key={idx} className="team">
                <div>{team.team_name}</div> 
                <img src={trashCanIcon} alt='trashcan' onClick={() => onCloseClick(team.team_id)}/>
            </div>
        )
    });

    return (
        <div className="Registration">
            <h2>Registration</h2>
            <div className="entry-form">
                <form onSubmit={e => submitForm(e)}>
                    <label htmlFor="teamName">Team Name: </label>
                    <input type="text" name="teamName" id="teamName" value={teamName} onChange={(e) => onInputChange(e)}/>
                    <button type="submit">Submit</button>
                </form>
            </div>
            <div className="team-list">
                {renderedTeams}
            </div>
            <button id='build-button' onClick={onBuildClick}>Build Bracket!</button>
        </div>
    )
}

export default Registration;