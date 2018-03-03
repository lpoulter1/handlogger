import Player from './Player.js';
import Deck from './Deck.js';
import logd from './logger.js'

class Game {
  constructor() {
    // Game attributes
    this.BET = 2;

    this.players = [];          // array of Player object, represents all players in this game
    this.round = 'idle';        // current round in a game
    this.dealerPos = 0;         // to determine the dealer position for each game, incremented by 1 for each end game
    this.turnPos = 0;           // to determine whose turn it is in a playing game
    this.pot = 0;               // accumulated chips in center of the table
    this.communityCards = [];   // array of Card object, five cards in center of the table
    this.deck = new Deck();     // deck of playing cards
  }

  /**
   * Adds new player to the game
   * @param attr
   */
  addPlayer = function (attr) {
    let newPlayer = new Player(attr);
    logd('Player ' + newPlayer.name + ' added to the game');
    newPlayer.game = this;
    this.players.push(newPlayer);
  };

  reset = function () {
    logd('Game reset');
    this.round = 'idle';
    this.communityCards = [];
    this.pot = 0;
    this.deck = new Deck();
    this.players.forEach(player => player.reset());
  };

  /**
   * Starts the 'deal' Round
   */
  start = function () {
    this.reset();
    logd('========== STARTING GAME ==========');

    // deal two cards to each players
    for (let i = 0; i < this.players.length; i++) {
      let c1 = this.deck.drawCard();
      let c2 = this.deck.drawCard();
      logd('Player ' + this.players[i].name + ' gets card : ' + c1 + ' & ' + c2);
      this.players[i].firstCard = c1;
      this.players[i].secondCard = c2;
    }

    // determine dealer, small blind, big blind
    // modulus with total number of players
    // numbers will back to 0 if exceeds the number of players
    logd('Player ' + this.players[this.dealerPos].name + ' is the dealer');
    let smallBlindPos = (this.dealerPos + 1) % this.players.length;
    let bigBlindPos = (this.dealerPos + 2) % this.players.length;

    // small and big pays blind
    this.players[smallBlindPos].addBet(1 / 2 * this.BET);
    this.players[bigBlindPos].addBet(this.BET);
    //
    logd('Player ' + this.players[smallBlindPos].name + ' pays small blind : ' + (1 / 2 * this.BET));
    logd('Player ' + this.players[bigBlindPos].name + ' pays big blind : ' + this.BET);

    // determine whose turn it is
    this.turnPos = (bigBlindPos + 1) % this.players.length;
    logd('Now its player ' + this.players[this.turnPos].name + '\'s turn');

    // begin game, start 'deal' Round
    logd('========== Round DEAL ==========');
    this.round = 'deal';
  };

  incrementPlayerTurn = function () {
    do {
      this.turnPos = (this.turnPos + 1) % this.players.length;
    } while (this.players[this.turnPos].hasDone);

    this.checkForNextRound();
  };

  /**
   * Check if ready to begin new round
   * Round ends when all players' bet are equal,
   * With exception Fold and All-in players
   * @returns {boolean}
   */
  playersStillLeftToAct = function () {
    let playersStillLeftToAct = this.players.filter(player =>
      !player.hasActed && !player.hasDone);

    console.log(`${playersStillLeftToAct.length} playersStillLeftToAct`, playersStillLeftToAct);

    return playersStillLeftToAct.length === 0;
  };

  isEndOfHand() {
    const playersDone = this.players.filter(player => player.hasDone);
    if (playersDone.length === (this.players.length - 1)) {
      return true;
    }

    return false;
  }

  /**
   * Play the next round
   */
  nextRound = function () {
    if (this.round === 'idle') {
      this.start();
    } else if (this.round === 'deal') {
      this.resetPlayerBets();
      this.flop();
    } else if (this.round === 'flop') {
      this.resetPlayerBets();
      this.turn();
    } else if (this.round === 'turn') {
      this.resetPlayerBets();
      this.river();
    } else if (this.round === 'river') {
      this.resetPlayerBets();
      this.showdown();
    }
  };

  /**
   * Checks if ready to next round
   * If yes, starts the next round
   */
  checkForNextRound = function () {
    if (this.isEndOfHand()) {
      logd('========== ENDING HAND ==========');
      this.round = 'idle';
      this.nextRound();
    }
    if (this.playersStillLeftToAct()) {
      logd('begin next round');
      this.nextRound();
    } else {
      logd('cannot begin next round, players still left to act');
    }
  };

  /**
   * Starts the 'flop' Round
   */
  flop = function () {
    logd('========== Round FLOP ==========');
    this.round = 'flop';
    // deal three cards in board
    this.communityCards[0] = this.deck.drawCard();
    this.communityCards[1] = this.deck.drawCard();
    this.communityCards[2] = this.deck.drawCard();
    // begin betting
    logd('Community cards : ' + this.communityCards[0] + ', ' + this.communityCards[1] + ', ' + this.communityCards[2]);
    // other players must act
    this.requestPlayerAction();
  };

  /**
   * Starts the 'turn' Round
   */
  turn = function () {
    logd('========== Round TURN ==========');
    this.round = 'turn';
    // deal fourth card
    this.communityCards[3] = this.deck.drawCard();
    logd('Community cards : ' + this.communityCards[0] + ', ' + this.communityCards[1] + ', ' + this.communityCards[2] + ', ' + this.communityCards[3]);
    // other players must act
    this.requestPlayerAction();
  };

  /**
   * Starts the 'river' Round
   */
  river = function () {
    logd('========== Round RIVER ==========');
    this.round = 'river';
    // deal fifth card
    this.communityCards[4] = this.deck.drawCard();
    // begin betting
    logd('Community cards : ' + this.communityCards[0] + ', ' + this.communityCards[1] + ', ' + this.communityCards[2] + ', ' + this.communityCards[3] + ', ' + this.communityCards[4]);
    // other players must act
    this.requestPlayerAction();
  };

  /**
   * Starts the 'showdown' Round
   */
  showdown = function () {
    logd('========== SHOWDOWN ==========');
    this.round = 'showdown';
    // gather all hands
    let hands = [];
    for (let i = 0; i < this.players.length; i++) {
      hands.push([
        this.players[i].firstCard,
        this.players[i].secondCard,
        this.communityCards[0],
        this.communityCards[1],
        this.communityCards[2],
        this.communityCards[3],
        this.communityCards[4]
      ]);
    }
    // evaluate all cards
    // let evalHands = [];
    for (let i = 0; i < hands.length; i++) {
      // evalHands.push(PokerEvaluator.evalHand(hands[i]));
      console.log('hand', hands[i])
    }

    logd('Community cards : ' + this.communityCards[0] + ', ' + this.communityCards[1] + ', ' + this.communityCards[2] + ', ' + this.communityCards[3] + ', ' + this.communityCards[4]);
    // get highest value
    // let highestVal = -9999;
    // // let highestIndex = -1;
    // for (let i=0; i<evalHands.length; i++) {
    //   logd('Player ' + this.players[i].name + ' : ' + this.players[i].firstCard + ', ' + this.players[i].secondCard + ' | strength : ' + evalHands[i].value + ' | ' + evalHands[i].handName);
    //   if (highestVal < evalHands[i].value) {
    //     highestVal = evalHands[i].value;
    //     highestIndex = i;
    //   }
    // }
    //logd('Player ' + this.players[highestIndex].name + ' wins with ' + evalHands[highestIndex].handName);
  };

  getHighestBet = function () {
    let highestBet = 0;

    this.players.forEach(player => {
      if (player.bet > highestBet) {
        highestBet = player.bet;
      }
    });

    return highestBet;
  };

  /**
   * Collect all bets from players to the board's pot
   */
  resetPlayerBets = function () {
    this.players.forEach(player => player.bet = 0);
    return this.pot;
  };

  getPot() {
    return this.pot;
  }


  getActivePlayers = () => this.players.filter(player =>
      !player.hasActed && !player.hasDone);

  getCurrentPlayer = function () {
    return this.players[this.turnPos];
  };

  /**
   * Sets all players' hasActed to false
   */
  requestPlayerAction = function () {
    for (let i = 0; i < this.players.length; i++) {
      if (!this.players[i].hasDone) {
        this.players[i].hasActed = false;
      }
    }
  };
}

export default Game;