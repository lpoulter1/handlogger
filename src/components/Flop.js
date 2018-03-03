import React, {Component} from 'react';
import CardPicker from './CardPicker'
import './flop.css';

class Flop extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cards: [],
    }
  }

  addCard = (card) => {
    let newCards = this.state.cards.concat(card);
    this.setState({cards: newCards});
  };


  render() {
    // const {cards} = this.state;
    return (
      <div>
        <div >
          <h3>Flop</h3>
          <div className={'flop'}>
            <CardPicker onCardSelect={this.addCard}/>
            <CardPicker onCardSelect={this.addCard}/>
            <CardPicker onCardSelect={this.addCard}/>
          </div>
        </div>
        <div>
          <h3>Turn</h3>
          <CardPicker onCardSelect={this.addCard}/>
        </div>
        <div>
          <h3>River</h3>
          <CardPicker onCardSelect={this.addCard}/>
        </div>
      </div>
    );
  }
}

export default Flop;
