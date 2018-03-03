var Game = require('./game');
// import Game from'./game';
var game = new Game();


game.getCurrentPlayer().callOrCheck();      // A
game.getCurrentPlayer().callOrCheck();      // B
game.getCurrentPlayer().raise(2000);        // C
game.getCurrentPlayer().raise(2000);        // A
game.getCurrentPlayer().fold();             // B
game.getCurrentPlayer().callOrCheck();      // C
game.getCurrentPlayer().callOrCheck();      // A
game.getCurrentPlayer().raise(1000);        // C
game.getCurrentPlayer().callOrCheck();      // A
game.getCurrentPlayer().callOrCheck();      // C
game.getCurrentPlayer().raise(3000);        // A
game.getCurrentPlayer().callOrCheck();      // C
game.getCurrentPlayer().callOrCheck();      // A
game.getCurrentPlayer().callOrCheck();      // C