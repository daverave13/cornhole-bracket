import Round from './Round';
import './bracket.css';
import { useState, useEffect } from 'react';

const Bracket = (props) => {

    const [teams, setTeams] = useState([]);
    const [initialRounds, setInitialRounds] = useState([]);
    const [thirdRound, setThirdRound] = useState([]);
    const [fourthRound, setFourthRound] = useState([]);
    const [fifthRound, setFifthRound] = useState([]);

    const onBackClick = () => {
        props.setRegMode(true);
    }

    const isPowerOfTwo = (num) => {
        return (Math.log(num)/Math.log(2)) % 1 === 0; 
     }
      
    const findPrevPowerOfTwo = (num) => {
        if (isPowerOfTwo(num)) return num;
        return findPrevPowerOfTwo(num-1);
    }

    const shuffleTeams = (teams) => {
        return teams.map((a) => ({sort: Math.random(), value: a}))
        .sort((a, b) => a.sort - b.sort)
        .map((a) => a.value);
    }

    const fillInMissingTeams = (games) => {
        let index = 0;
        games.forEach(game => {
            for (let team in game.teams) {
                if (!game.teams[team]) game.teams[team] = `Winner of Game ${++index}`
            }
        })
    }

    const getTeams = async () => {

        const requestOptions = {
            method: "GET",
        }

        let teams =( await fetch("https://dslusser.com:5000/api/teams/", requestOptions)
                                    .then(response => response.json())
                                    .then(data => data));

        setTeams(shuffleTeams(teams));
        // setTeams(teams);
    } 

    const produceInitialRounds = (teamsRemaining) => {
        const totalNumberOfTeams = teamsRemaining.length;  
        let initalRoundsGames = [];
        const prevPowerOfTwo = findPrevPowerOfTwo(teamsRemaining.length)
        const magicNumber = teamsRemaining.length - prevPowerOfTwo/2;

        for (let i = 0; i < magicNumber; i++) {
            initalRoundsGames.push({
                teams: {
                    teamA: teamsRemaining.shift(),
                    teamB: teamsRemaining.shift(),
                },
                winner: null
            })
        }

        fillInMissingTeams(initalRoundsGames);
        
        const roundSplitIndex = totalNumberOfTeams - prevPowerOfTwo;
        const firstRoundGames = [...initalRoundsGames.slice(0, roundSplitIndex)]
        const secondRoundGames = [...initalRoundsGames.slice(roundSplitIndex, initalRoundsGames.length)]

        return [firstRoundGames,secondRoundGames];
    }

    const produceNextRound = (prevRound) => {
        let nextRound = [];
        for (let i = 0; i < prevRound.length/2; i++) {
            nextRound.push({
                teams: {
                    teamA: null,
                    teamB: null,
                },
                winner: null
            })
        }
        fillInMissingTeams(nextRound)
        return nextRound;
    }

    useEffect(() => {
        getTeams();
    }, [initialRounds])

  
    if (teams.length > 0) {
        const teamNames = teams.map(team => team.team_name);
        if (initialRounds.length === 0 ) setInitialRounds(produceInitialRounds(teamNames));
        if (thirdRound.length === 0 && initialRounds.length > 0) setThirdRound(produceNextRound(initialRounds[1]));
        if (fourthRound.length === 0 && thirdRound.length > 0) setFourthRound(produceNextRound(thirdRound));
        if (fifthRound.length === 0 && fourthRound.length > 1) setFifthRound(produceNextRound(fourthRound));
    }
    
    let showfirstRound = false;
    if (initialRounds[0]) {
        if (initialRounds[0].length > 0) showfirstRound = true
    }

    return (
        <div className="Bracket">
            {showfirstRound ? <Round games={initialRounds[0]}/> : ""}
            {initialRounds[1] ? <Round games={initialRounds[1]}/> : ""}
            {thirdRound.length > 0 && initialRounds[1].length > 1 ? <Round games={thirdRound} /> : ""}
            {fourthRound.length > 1 ? <Round games={fourthRound} /> : ""}
            {fourthRound.length > 1 ? <Round games={fifthRound} /> : ""}
            <button onClick={onBackClick}>Back</button>
        </div>
    )
}

export default Bracket;