export const addItem = (item) => ({
    type: 'ADD_ITEM',
    payload: item,
  });
  
  export const removeItem = (index) => ({
    type: 'REMOVE_ITEM',
    payload: index,
  });
  
  export const updateItem = (index, newItem) => ({
    type: 'UPDATE_ITEM',
    payload: { index, newItem },
  });
  