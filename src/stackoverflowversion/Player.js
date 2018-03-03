const logd = require('./logger');

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
    this.hasDone = false;       // finish acted for one game (fold/allin)
  }

  fold() {
    logd('Player ' + this.name + ' FOLD');

    this.lastAction = 'fold';
    this.hasDone = true;

    this.game.incrementPlayerTurn();
    this.game.checkForNextRound();
  }

  allin() {
    logd('Player ' + this.name + ' ALL-IN : ' + this.chips);

    this.lastAction = 'allin';
    this.hasDone = true;

    this.addBet(this.chips);
    this.game.incrementPlayerTurn();
    this.game.checkForNextRound();
  }

  callOrCheck() {
    this.hasActed = true;

    let diff = this.game.getHighestBet() - this.bet;
    this.addBet(diff);

    if (diff > 0) {
      this.lastAction = "call";
      logd('Player ' + this.name + ' CALL : ' + diff);
    } else {
      this.lastAction = "check";
      logd('Player ' + this.name + ' CHECK');
    }
    this.game.incrementPlayerTurn();
    this.game.checkForNextRound();
  }

  raise(amount) {
    this.lastAction = "raise";

    let diff = this.game.getHighestBet() - this.bet;
    this.addBet(diff + amount);

    logd('Player ' + this.name + ' Raises : ' + (diff + amount));

    this.game.requestPlayerAction(); // other players must act
    this.hasActed = true;
    this.game.incrementPlayerTurn();
    this.game.checkForNextRound();
  }

  reset() {
    this.firstCard = {};
    this.secondCard = {};
    this.bet = 0;

    this.lastAction = "";
    this.hasActed = false;
    this.hasDone = false;
  }

  addBet(amount){
    if (this.chips < amount) {
      return "error - not enough chips";
    }
    this.chips -= amount;
    this.bet += amount;
  }
}

module.exports = Player;