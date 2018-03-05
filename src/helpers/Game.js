import Player from './Player.js';
import Deck from './Deck.js';
import {logger} from './logger.js'

const numberCardsForRound = {
  'flop': 3,
  'turn': 1,
  'river': 1,
};

class Game {
  constructor() {
    this.bigBlind = 2;

    this.players = [];          // array of Player object, represents all players in this game
    this.round = 'idle';        // current round in a game
    this.dealerPos = 0;         // to determine the dealer position for each game, incremented by 1 for each end game
    this.turnPos = 0;           // to determine whose turn it is in a playing game
    this.pot = 0;               // accumulated chips in center of the table
    this.communityCards = [];   // array of Card object, five cards in center of the table
    this.deck = new Deck();     // deck of playing cards
  }

  addPlayer = function (attr) {
    let newPlayer = new Player(attr);
    logger('Player ' + newPlayer.name + ' added to the game');
    newPlayer.game = this;
    this.players.push(newPlayer);
  };

  reset = function () {
    logger('Game reset');
    this.round = 'idle';
    this.communityCards = [];
    this.pot = 0;
    this.deck = new Deck();
    this.players.forEach(player => player.reset());
  };

  start = function () {
    this.reset();
    logger('========== STARTING GAME ==========');
    logger('Player ' + this.players[this.dealerPos].name + ' is the dealer');

    let smallBlindPos = (this.dealerPos + 1) % this.players.length;
    let bigBlindPos = (this.dealerPos + 2) % this.players.length;

    this.players[smallBlindPos].addBet(1 / 2 * this.bigBlind);
    this.players[bigBlindPos].addBet(this.bigBlind);
    //
    logger('Player ' + this.players[smallBlindPos].name + ' pays small blind : ' + (1 / 2 * this.bigBlind));
    logger('Player ' + this.players[bigBlindPos].name + ' pays big blind : ' + this.bigBlind);

    this.turnPos = (bigBlindPos + 1) % this.players.length;
    logger('Now its player ' + this.getCurrentPlayer.name + '\'s turn');

    // begin game, start 'deal' Round
    logger('========== Round DEAL ==========');
    this.round = 'deal';
  };

  incrementPlayerTurn = function () {
    do {
      this.turnPos = (this.turnPos + 1) % this.players.length;
    } while (this.getCurrentPlayer().foldedOrAllIn);
  };

  requestPlayerAction = () =>
    this.players.forEach(player => {
      if (!player.foldedOrAllIn) {
        player.hasActed = false;
      }
    });

  playersStillLeftToAct = function () {
    let playersStillLeftToAct = this.players.filter(player =>
      !player.hasActed && !player.foldedOrAllIn);

    logger(`${playersStillLeftToAct.length} playersStillLeftToAct`);

    return playersStillLeftToAct.length === 0;
  };

  isEndOfHand() {
    const playersDone = this.players.filter(player => player.foldedOrAllIn);
    if (playersDone.length === (this.players.length - 1)) {
      return true;
    }

    return false;
  }

  nextRound = () => {
    switch (this.round) {
      case 'idle':
        this.start();
        break;
      case 'deal':
        this.startBettingRound('flop');
        break;
      case 'flop':
        this.startBettingRound('turn');
        break;
      case 'turn':
        this.startBettingRound('river');
        break;
      case 'river':
        this.showdown();
        break;
      default:
        this.start();
    }
  };

  checkForRoundEnd = function () {
    if (this.isEndOfHand()) {
      logger('========== ENDING HAND ==========');
      this.round = 'idle';
    }
    if (this.playersStillLeftToAct()) {
      logger('begin next round');
      this.nextRound();
    } else {
      logger('cannot begin next round, players still left to act');
    }
  };

  drawCards = (cardsToDraw) => {
    for (let i = 0; i < cardsToDraw; i++) {
      this.communityCards.push(this.deck.drawCard());
    }
  };

  logCommunityCards = () => {
    let message = 'Community cards :';
    message = this.communityCards.reduce((memo, card) =>
      memo.concat(` ${card}`), message);
    logger(message);
  };

  startBettingRound = (round) => {
    logger(`========== Round ${round} ==========`);
    this.round = round;
    this.resetPlayerBets();
    this.drawCards(numberCardsForRound[round]);
    this.logCommunityCards();
    this.requestPlayerAction();
  };

  showdown = function () {
    logger('========== SHOWDOWN ==========');
    this.round = 'showdown';
    this.logCommunityCards()
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

  resetPlayerBets = () =>
    this.players.forEach(player => player.bet = 0);

  getPot = () => this.pot;

  getActivePlayers = () =>
    this.players.filter(player =>
      !player.hasActed && !player.foldedOrAllIn);

  getCurrentPlayer = () =>
    this.players[this.turnPos];
}

export default Game;