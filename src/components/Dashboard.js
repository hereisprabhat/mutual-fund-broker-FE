import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [fundFamilies, setFundFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState('');
  const [schemes, setSchemes] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFundFamilies() {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8000/fund-families', { headers: { "access-token": token }});
        setFundFamilies(response.data.families);
      } catch (error) {
        setError('Failed to load fund families');
      }
    }
    fetchFundFamilies();
  }, []);

  const handleFamilyChange = async (e) => {
    const family = e.target.value;
    setSelectedFamily(family);
    setError('');
    try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`http://localhost:8000/fund-schemes`, {
            headers: { "access-token": token }, 
            params: {family: family}
        });
      setSchemes(response.data.schemes);
    } catch (error) {
      setError('Failed to load schemes');
    }
  };

  const handleSchemeClick = (scheme) => {
    navigate(`/fund-details/${scheme.scheme_code}`, { state: { scheme } });
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Select Fund Family:</label>
        <select
          value={selectedFamily}
          onChange={handleFamilyChange}
          className="w-full p-2 border rounded mt-1"
        >
          <option value="">-- Select --</option>
          {fundFamilies.map((family) => (
            <option key={family} value={family}>
              {family}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <h3 className="text-xl font-bold mt-6">Open-Ended Schemes</h3>
        <ul className="mt-4 space-y-2">
          {schemes.map((scheme) => (
            <li
              key={scheme.scheme_code}
              onClick={() => handleSchemeClick(scheme)}
              className="p-4 bg-white rounded shadow hover:bg-gray-200 cursor-pointer"
            >
              {scheme.scheme_name}
              <button className="bg-green-500 text-white p-2 rounded ml-4 float-right">Open</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
