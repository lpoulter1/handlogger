import React, {Component} from 'react';
import Game from './helpers/Game';
import ACTIONS from './helpers/ACTIONS';
import {handLog} from './helpers/logger';
import takeAction from './helpers/takeAction';

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
  }

  takeAction = (player, action, amount) => {
    takeAction(this.game, player, action, amount);

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
          <div>
            <RaiseButton onChange={this.takeAction.bind(null, currentPlayer, ACTIONS.RAISE, 6)}>
            </RaiseButton>
          </div>
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

        {handLog.map(message => <div>{message}</div>)}
      </div>
    );
  }
}

class RaiseButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };

    this.handleRaiseChange = this.handleRaiseChange.bind(this);
    this.handleRaiseSubmit = this.handleRaiseSubmit.bind(this);
  }

  handleRaiseChange(event) {
    this.setState({value: event.target.value});
  }

  handleRaiseSubmit() {
    this.props.onChange(this.state.value);
  }

  render() {
    return (
      <div>
        Raise: <input onChange={this.handleRaiseChange} type="number" name="raise-size"
                      value={this.state.value}/>
        <button
          onClick={this.handleRaiseSubmit}>
          Raise
        </button>
      </div>
    )
  }
}

export default App;
