import React from 'react';

const PlayerAction = (({seat, action, handleOnActionSelected}) => {
  return (
    <button onClick={() => handleOnActionSelected(seat, action)}>{action}</button>
  )
});

export default PlayerAction;