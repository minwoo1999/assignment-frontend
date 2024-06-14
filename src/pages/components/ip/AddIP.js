import React, { useState } from 'react';
import './AddIp.css'; // AddIP component CSS
import axios from 'axios';

const AddIP = ({ onIPAdded }) => {
  const [ipAddress, setIpAddress] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');



  const handleAddIP = async () => {
    try {
      // Make API call to add IP address
      const response = await axios.post('http://118.67.135.243/api/v1/ip', {
        ipAddress,
        description,
        startTime,
        endTime
      });
      console.log(response);

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


      // Notify parent component that IP was added
      onIPAdded(response.data); // Adjust as per your API response structure
      
      // Reset form fields
      setIpAddress('');
      setDescription('');
      setStartTime('');
      setEndTime('');


     
    } catch (error) {
      console.error('Error adding IP address:', error);
    }
  };

  return (
    <div className="add-ip-form">
      <label>IP 주소</label>
      <input
        type="text"
        value={ipAddress}
        onChange={(e) => setIpAddress(e.target.value)}
      />
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
  );
};

export default AddIP;
