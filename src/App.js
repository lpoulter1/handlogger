import React, {Component} from 'react';
import Game from './helpers/Game';
import ACTIONS from './helpers/ACTIONS';

class App extends Component {

  constructor(props) {
    super(props);


    this.game = new Game();
    this.game.addPlayer({
      name: "A",
      chips: 40000
    });
    this.game.addPlayer({
      name: "B",
      chips: 20000
    });
    this.game.addPlayer({
      name: "C",
      chips: 20000
    });

    this.game.start();

    this.state = {
      currentPlayer: this.game.getCurrentPlayer(),
    };

    // this.game.getCurrentPlayer().callOrCheck();      // A
    // this.game.getCurrentPlayer().callOrCheck();      // B
    // this.game.getCurrentPlayer().raise(2000);        // C
    // this.game.getCurrentPlayer().raise(2000);        // A
    // this.game.getCurrentPlayer().fold();             // B
    // this.game.getCurrentPlayer().callOrCheck();      // C
    // this.game.getCurrentPlayer().callOrCheck();      // A
    // this.game.getCurrentPlayer().raise(1000);        // C
    // this.game.getCurrentPlayer().callOrCheck();      // A
    // this.game.getCurrentPlayer().callOrCheck();      // C
    // this.game.getCurrentPlayer().raise(3000);        // A
    // this.game.getCurrentPlayer().callOrCheck();      // C
    // this.game.getCurrentPlayer().callOrCheck();      // A
    // this.game.getCurrentPlayer().callOrCheck();      // C
  }

  takeAction = (player, action, amount) => {
    if (action === ACTIONS.CALL) {
      player.callOrCheck();
    }

    if (action === ACTIONS.CHECK) {
      player.callOrCheck();
    }

    if (action === ACTIONS.RAISE) {
      player.raise(amount);
    }

    if (action === ACTIONS.FOLD) {
      player.fold();
    }

    this.setState({currentPlayer: this.game.getCurrentPlayer()})
  };

  render() {
    const {currentPlayer} = this.state;
    return (
      <div className="App">
        <div>Round {this.game.round}</div>
        <div>
          <button onClick={this.game.reset}>Reset</button>
        </div>
        <div>Actions:
          <button
            onClick={this.takeAction.bind(null, currentPlayer, ACTIONS.CHECK)}>
            Check
          </button>
          <button
            onClick={this.takeAction.bind(null, currentPlayer, ACTIONS.CALL)}>
            Call
          </button>
          <button
            onClick={this.takeAction.bind(null, currentPlayer, ACTIONS.RAISE, 6)}>
            Raise
          </button>
          <button
            onClick={this.takeAction.bind(null, currentPlayer, ACTIONS.FOLD)}>
            Fold
          </button>
        </div>
        <div>Active players {this.game.getActivePlayers().map(player => <span
          key={player.name}>{player.name}, </span>)}</div>
        <div>currentPlayer {currentPlayer.name}</div>
        <div>Current Highest Round Bet {this.game.getHighestBet()}</div>
        <div>Pot {this.game.getPot()}</div>
      </div>
    );
  }
}

export default App;
