import React, {Component} from 'react';
import SuitPicker from './SuitPicker'

const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

class CardPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rank: '',
      suit: '',
      pickingCard: false,
    }
  }

  onRankSelect = (event) => {
    this.setState({rank: event.target.textContent});
  };

  onSuitSelect = (event) => {
    this.setState({suit: event.target.textContent, pickingCard:false}, () => this.props.onCardSelect(this.state.suit));
  };


  pickNewCard = () => {
    this.setState({pickingCard: true});
  };

  render() {
    const {rank, suit, pickingCard} = this.state;

    return (
      <div className={'cardPicker'}>
        <button onClick={this.pickNewCard}>{(rank && suit) && `${suit}`}</button>
        {pickingCard &&
          <div>
            {ranks.map((rank) => <button key={rank}
                                          onClick={this.onRankSelect}>{rank}</button>)}
            {rank && <SuitPicker rank={rank} handleOnClick={this.onSuitSelect}/>}
          </div>
        }

      </div>
    );
  }
}

export default CardPicker;
