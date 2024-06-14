import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import './AddIPModal.css';

Modal.setAppElement('#root');

const AddIPModal = ({ isOpen, onClose, onIPAdded }) => {
  const [ipAddress, setIpAddress] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const resetForm = () => {
    setIpAddress('');
    setDescription('');
    setStartTime('');
    setEndTime('');
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

  const handleAddIP = async () => {
    const newIP = {
      ip: ipAddress,
      description,
      startTime: formatDateTime(startTime),
      endTime: formatDateTime(endTime)
    };


    if (!ipAddress) {
      alert('IP 주소를 입력하세요.');
      return;
    }
    if (!description) {
      alert('설명을 입력하세요.');
      return;
    }
    if (!startTime) {
      alert('허용 시작 시간을 입력하세요.');
      return;
    }
    if (!endTime) {
      alert('허용 끝 시간을 입력하세요.');
      return;
    }
    try {
      const response = await axios.post('http://118.67.135.243/api/v1/ip', newIP);
      const addedIP = response.data.data; // Assuming the API returns the added IP with an ID
      onIPAdded(addedIP);
      resetForm();
    } catch (error) {
      window.alert(error.response.data.error.message);
      console.error('Error adding IP address:', error);
    }
  };

  const handleFetchMyIP = async () => {
    try {
      const response = await axios.get('http://118.67.135.243/api/v1/ip/my-ip');
      const myIpAddress = response.data.data;
      setIpAddress(myIpAddress); // Update the state with the fetched IP address
    } catch (error) {
      console.error('Error fetching IP address:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => { onClose(); resetForm(); }}
      contentLabel="Add IP Modal"
      className="add-ip-modal"
      overlayClassName="add-ip-modal-overlay"
    >
      <button className="close-button" onClick={() => { onClose(); resetForm(); }}>
        X
      </button>
      <div className="modal-header">
        <h2>추가할 IP 주소</h2>
      </div>
      <button className="fetch-ip-button-small" onClick={handleFetchMyIP}>
        IP 불러오기
      </button>
      <div className="add-ip-form">
        <label>IP 주소</label>
        <div className="ip-address-input">
          <input
            type="text"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
          />
        </div>
        <label>설명</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label>허용 시작 시간</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <label>허용 끝 시간</label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <button onClick={handleAddIP}>추가</button>
      </div>
    </Modal>
  );
};

export default AddIPModal;
