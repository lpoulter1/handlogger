import React from 'react';

const suits = ['♣','♦', '♥', '♠'];

const SuitPicker = ({rank, handleOnClick}) => {
  return (
    <div>
      {
        suits.map((suit) => <button key={suit} onClick={handleOnClick}>{`${rank}${suit}`}</button>)
      }
    </div>
  )
};

export default SuitPicker;