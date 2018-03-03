import React from 'react';

const ActionBar = ({onCheck, onCall, onRaise, onFold}) => {
  const handleRaise = () => {
    let amount = 100;
    onRaise(amount);
  };
  return (
    <div>Player actions:
      <button
        onClick={onCheck}>
        Check
      </button>
      <button
        onClick={onCall}>
        Call
      </button>
      <button
        onClick={onFold}>
        Fold
      </button>
      <div>
        <button
          onClick={handleRaise}>
          Raise
        </button>
        <input type="number"/>
      </div>
    </div>
  )
};

export default ActionBar;