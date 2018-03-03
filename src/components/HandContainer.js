import React, {Component} from 'react';
import Deck from "../helpers/Deck";
import logd from "../helpers/logger";

class HandContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      players: props.players,
      round: 'idle',
      dealerPos: 0,
      turnPos: 0, // player turn by potision
      communityCards: [],
      deck: new Deck(),
    };

    this.startHand();
  }

  setBlinds() {
    const {bigBlind} = this.props;
    const {players} = this.state;
    const smallBlindPos = (dealerPos + 1) % players.length;
    const bigBlindPos = (dealerPos + 2) % players.length;

    players[smallBlindPos].addBet(bigBlind / 2);
    players[bigBlindPos].addBet(bigBlind);
  }

  startHand() {
    const {players} = this.state;
    this.setBlinds();
    this.setState({
      turnPos: (bigBlindPos + 1) % players.length,
      round: 'deal',
    });
  }

  render() {
    const {round} = this.state;
    return (
      <div>
        <div>A Hand</div>
        <div>round: {round}</div>
      </div>
    )
  }

}

export default HandContainer;