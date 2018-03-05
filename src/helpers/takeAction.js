import ACTIONS from './ACTIONS';

function takeAction (Game, player, action, amount) {
  switch (action) {
    case ACTIONS.CHECK:
      player.callOrCheck();
      break;
    case ACTIONS.CALL:
      player.callOrCheck();
      break;
    case ACTIONS.RAISE:
      player.raise(amount);
      Game.requestPlayerAction();
      player.hasActed = true;
      break;
    case ACTIONS.FOLD:
      player.fold();
      break;
    default:
      console.log('Unknown Action: ', action);
  }

  // select next player
  Game.incrementPlayerTurn();

  // if next player has foldedOrAllIn
  // checkForRoundEnd(all folded or playersStillLeftToAct)
  Game.checkForRoundEnd();
  // if round end get next round
}

export default takeAction;