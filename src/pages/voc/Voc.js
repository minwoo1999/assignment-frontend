import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { DateTime } from 'luxon'; 

import CommonTable from '../components/table/CommonTable';
import CommonTableColumn from '../components/table/CommonTableColumn';
import CommonTableRow from '../components/table/CommonTableRow';
import Search from '../components/search/Search';
import AddIPModal from '../components/ip/AddIPModal';
import MiniLoader from '../../style/MiniLoader';
import DeleteButton from './DeleteButton'; 
import './styles.css'; 


function Voc() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchParams, setSearchParams] = useState({ description: '', startTime: '', endTime: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ruleCount, setRuleCount] = useState();
  const [page, setPage] = useState(0);
  const [myIp, setMyIp] = useState('');
  const scrollPosition = useRef(0);
  const debounceTimeout = useRef(null);

  const handleFetchMyIP = async () => {
    try {
      const response = await axios.get('http://118.67.135.243/api/v1/ip/my-ip');
      const myIpAddress = response.data.data;
      setMyIp(myIpAddress);
      fetchRuleCount(myIpAddress);
    } catch (error) {
      console.error('Error fetching IP address:', error);
    }
  };

  const fetchData = async () => {
    try {
      if(page==0){
        setLoading(true);
      }
      const { description, startTime, endTime } = searchParams;
      const formattedStartTime = startTime ? DateTime.fromISO(startTime).toFormat('yyyy/LL/dd HH:mm') : '';
      const formattedEndTime = endTime ? DateTime.fromISO(endTime).toFormat('yyyy/LL/dd HH:mm') : '';

      const searchQuery = `http://118.67.135.243/api/v1/ip?page=${page}&size=100&searchWord=${description || ''}&startTime=${formattedStartTime}&endTime=${formattedEndTime}&sort=createdAt,desc`;

      const response = await axios.get(searchQuery);
      const newData = response.data.data.content.map(item => ({
        ...item,
        startTime: DateTime.fromISO(item.startTime).toLocaleString(DateTime.DATETIME_MED),
        endTime: DateTime.fromISO(item.endTime).toLocaleString(DateTime.DATETIME_MED)
      }));

      setData(prevData => loadingMore ? [...prevData, ...newData] : newData);
      
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchRuleCount = async (ipAddress) => {
    try {
      const response = await axios.get(`http://118.67.135.243/api/v1/ip/ip-roles/count?ipAddress=${ipAddress}`);
      setRuleCount(response.data.data);
    } catch (error) {
      console.error("There was an error fetching the rule count!", error);
      setRuleCount(0);
    }
  };

  useEffect(() => {
    const handleInitialLoad = async () => {
      await handleFetchMyIP();
      fetchData();
    };

    handleInitialLoad();

  }, []);

  useEffect(() => {
    fetchData();
  }, [searchParams, page]);

  const handleSearch = (searchValues) => {
    setSearchParams(searchValues);
    setPage(0);
  };

  const handleIPAdded = (newIP) => {
    fetchRuleCount(myIp);
    fetchData();
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    handleFetchMyIP();
    fetchData(); 
  };

  const handleScroll = () => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
        if (!loadingMore) {
          setLoadingMore(true);
          scrollPosition.current = window.scrollY;
          setPage(prevPage => prevPage + 1);
        }
      }
    }, 200);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!loadingMore) {
      window.scrollTo(0, scrollPosition.current);
    }
  }, [data]);

  return (
    <>
      <div className="search-container">
        <Search onSearch={handleSearch} />
      </div>
      <button className="add-ip-button" onClick={openModal}>IP 추가하기</button>
      <AddIPModal isOpen={isModalOpen} onClose={closeModal} onIPAdded={handleIPAdded} />
      <div className="rule-count">나의 규칙 갯수: {ruleCount} / 50</div>
      {loading ? (
        <MiniLoader />
      ) : (
        <CommonTable headersName={['IP주소', '내용', '사용 시작 시간', '사용 끝 시간', '작업']}>
          {data.map((item) => (
            <CommonTableRow key={item.id}>
              <CommonTableColumn>{item.ipAddress}</CommonTableColumn>
              <CommonTableColumn>{item.description}</CommonTableColumn>
              <CommonTableColumn>{item.startTime}</CommonTableColumn>
              <CommonTableColumn>{item.endTime}</CommonTableColumn>
              <CommonTableColumn>
                <DeleteButton ipRoleId={item.id} onDelete={handleDelete} />
              </CommonTableColumn>
            </CommonTableRow>
          ))}
        </CommonTable>
      )}
      {loadingMore && <MiniLoader />}
    </>
  );
}

export default Voc;
