import React from 'react';

const CardView = ({card, handleOnclick}) =>
  <button onClick={handleOnclick}>{card}</button>;

export default CardView