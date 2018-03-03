import React, {Component} from 'react';
import ActionPrompt from "./ActionPrompt";
import ACTIONS from '../helpers/ACTIONS';

class BettingRound extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: props.players,
    }
  }

  removePlayer = (seat) => this.setState(({players}) => ({
    players: players.filter((player) => player.seat !== seat )
  }));

  handleAction = (player, action) => {
    if(action === ACTIONS.FOLD) {
      this.removePlayer(player.seat);
    }

    this.setNextAction(player);
  };

  setNextAction = (lastPlayer) => {
    const action = {
      player: {
        seat: 1,
        position: 'UTG',
      }
    };

   this.setState({ action })
  };

  render() {
    const {action} = this.state;

    return (
      <ActionPrompt players={players} onAction={this.handleAction}/>
      <PlayerAction key={`${action}-${index}`}
    handleOnActionSelected={this.handleOnActionSelected}
    seat={currentSeat} action={action}/>
      )
  }
}

export default BettingRound;