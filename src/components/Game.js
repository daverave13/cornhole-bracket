import {useState} from 'react';
import './game.css'

const Game = (props) => {

    const [winner, setWinner] = useState(props.game.winner);

    const onClick = (e) => {
        if (winner) setWinner(null);
        else setWinner(e.target.innerHTML);
    }

    const gameContent = winner ? <div onClick={e => onClick(e)}>{winner}</div> :  <div ><div onClick={e => onClick(e)}className="top-team">{props.game.teams.teamA}</div> vs <div className="bottom-team" onClick={e => onClick(e)}>{props.game.teams.teamB}</div></div>

    return (
        <div className="Game">
            {gameContent}
        </div>
    )
}

export default Game;