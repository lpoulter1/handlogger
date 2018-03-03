import React, {Component} from 'react';
import PlayerAction from "./PlayerAction";

// const seats = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];



class ActionPrompt extends Component {
  constructor(props) {
    super(props);
    this.filterBySeat = this.filterBySeat.bind(this);
    this.areActionsComplete = this.areActionsComplete.bind(this);
    const {buttonSeat, players} = props;
    const numPlayers = players.length;

    console.log('players', ...players);

    this.state = {
      currentSeat: this.getNextSeat(this.getNextSeat(this.getNextSeat(buttonSeat, numPlayers), numPlayers), numPlayers),
      actionsTaken: [],
      toAct: [...players],
      actionsComplete: false,
    };

  }


  getNextSeat = (current, numPlayers = 10) => {
    let base = 1;
    let next = current + 1;
    if (next > numPlayers) {
      return base
    }

    return next;
  };

  filterBySeat = (seat) => this.state.toAct.filter((player) => player.seat !== seat);

  areActionsComplete = () => this.state.toAct.length === 0;

  handleOnActionSelected = (seat, action) => {
    this.setState({
      actionsTaken: this.state.actionsTaken.concat({
        seat,
        action
      }),
      toAct: this.filterBySeat(seat),
    }, () => this.setState({currentSeat: this.getNextSeat(this.state.currentSeat, this.props.players.length),  actionsComplete: this.areActionsComplete()}));
  };

  render() {
    const {currentSeat, actionsTaken, toAct, actionsComplete} = this.state;
    return (
      <div>
        to act length: {toAct.length};
        actionsComplete {actionsComplete};
        <div>Actions: {actionsTaken.map((action, index) =>
          <div key={`${action}-${index}`}>{`${action.seat}: ${action.action}`}</div>)}</div>
        <span>Next to act: {currentSeat}</span>
        <div>Action: {
          actions.map((action, index) => <PlayerAction key={`${action}-${index}`}
                                                handleOnActionSelected={this.handleOnActionSelected}
                                                seat={currentSeat} action={action}/>)
        }</div>
      </div>
    );
  }
}

export default ActionPrompt;
