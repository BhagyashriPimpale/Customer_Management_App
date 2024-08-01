import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeItem } from './actions';

const Item = ({ item, index }) => {
  const dispatch = useDispatch();

  const handleRemove = () => {
    dispatch(removeItem(index));
  };

  return (
    <div className="d-flex justify-content-around">
    <Link to={`/edit-customer/${index}`} className="btn btn-warning mr-2">
      Edit
    </Link>
    <button onClick={handleRemove} className="btn btn-danger">
      Remove
    </button>
  </div>
  
 );
};

export default Item;
