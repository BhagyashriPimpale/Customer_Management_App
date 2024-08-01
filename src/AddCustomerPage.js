import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addItem } from './actions';

const AddCustomerPage = () => {
  const [inputValue, setInputValue] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAdd = () => {
    if (inputValue) {
      dispatch(addItem(inputValue));
      navigate('/');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div>
      <h2>Add Customer</h2>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
};

export default AddCustomerPage;
