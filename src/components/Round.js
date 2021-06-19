import './round.css';
import Game from './Game';

const Round = (props) => {

    const renderedGames = props.games.map((game, idx) => <div key={idx} className='game'><Game game={game}/></div> )

    return (
        <div className="Round">
            {renderedGames}
        </div>
    )
}

export default Round;