// DeleteButton.js

import React from 'react';
import axios from 'axios';

const DeleteButton = ({ ipRoleId, onDelete }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://118.67.135.243/api/v1/ip?ipRoleId=${ipRoleId}`);
      onDelete(); 
    } catch (error) {
      console.error('Error deleting IP rule:', error);
    }
  };

  return (
    <button onClick={handleDelete} className="delete-ip-button">삭제</button>
  );
};

export default DeleteButton;
