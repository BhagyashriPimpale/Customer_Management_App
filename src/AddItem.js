import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from './actions';

const AddItem = () => {
  const [inputValue, setInputValue] = useState('');
  const dispatch = useDispatch();

  const handleAdd = () => {
    if (inputValue) {
      dispatch(addItem(inputValue));
      setInputValue('');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
};

export default AddItem;
