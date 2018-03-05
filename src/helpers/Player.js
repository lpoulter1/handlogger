import ACTIONS from './ACTIONS';
import {logger} from './logger.js'

class Player {
  constructor(options) {
    this.id = options.id;
    this.name = options.name;
    this.chips = options.chips;
    this.game = null;

    this.firstCard = {};
    this.secondCard = {};
    this.bet = 0;

    this.lastAction = "";
    this.hasActed = false;      // acted for one round (call/check/raise)
    this.foldedOrAllIn = false;       // finish acted for one game (fold/allin)
  }

  fold() {
    logger('Player ' + this.name + ' FOLD');

    this.lastAction = ACTIONS.FOLD;
    this.foldedOrAllIn = true;
  }

  allin() {
    logger('Player ' + this.name + ' ALL-IN : ' + this.chips);

    this.lastAction = ACTIONS.ALL_IN;
    this.foldedOrAllIn = true;

    this.addBet(this.chips);
  }

  callOrCheck() {
    this.hasActed = true;

    let diff = this.game.getHighestBet() - this.bet;
    this.addBet(diff);

    if (diff > 0) {
      this.lastAction = "call";
      logger('Player ' + this.name + ' CALL : ' + diff);
    } else {
      this.lastAction = "check";
      logger('Player ' + this.name + ' CHECK');
    }
  }

  raise(amount) {
    this.lastAction = "raise";

    let diff = this.game.getHighestBet() - this.bet;
    this.addBet(diff + amount);

    logger('Player ' + this.name + ' Raises : ' + (diff + amount));

  }

  reset() {
    this.firstCard = {};
    this.secondCard = {};
    this.bet = 0;

    this.lastAction = "";
    this.hasActed = false;
    this.foldedOrAllIn = false;
  }

  addBet(amount){
    if (this.chips < amount) {
      return "error - not enough chips";
    }
    this.chips -= amount;
    this.bet += amount;
    this.game.pot += amount;
  }
}

export default Player;