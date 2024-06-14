import React, { useState } from 'react';

const Search = ({ onSearch }) => {
  const [searchValues, setSearchValues] = useState({
    description: '',
    startTime: '',
    endTime: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleSearch = () => {
    onSearch(searchValues);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        name="description"
        placeholder="내용 검색"
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
      <input
        type="datetime-local"
        name="startTime"
        placeholder="사용 시작 시간 검색"
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
      <input
        type="datetime-local"
        name="endTime"
        placeholder="사용 끝 시간 검색"
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
      <button onClick={handleSearch}>검색</button>
    </div>
  );
};

export default Search;
