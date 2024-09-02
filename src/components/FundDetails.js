import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function FundDetails() {
  const location = useLocation();
  const { scheme } = location.state;
  const [units, setUnits] = useState('');
  const [error, setError] = useState('');

  const handlePurchase = async () => {
    if (!units || isNaN(units) || units <= 0) {
        setError('Please enter a valid number of units.');
        return;
      }
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post('http://localhost:8000/purchase', {}, {
        headers: { "access-token": token }, 
        params: { isin: scheme.isin_div_payout, units: parseInt(units, 10)}
      });

      if (response.data) {
        alert(response.data.message);
      } else {
        setError(response.data.message || 'An error occurred during the purchase.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during the purchase.');
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Fund Details</h2>
      <div className="bg-white p-6 rounded shadow">
        <p className="text-lg"><b>Name:</b> {scheme.scheme_name}</p>
        <p className="text-lg"><b>Type:</b> {scheme.scheme_type}</p>
        <p className="text-lg"><b>Net Asset Value (NAV):</b> {scheme.net_asset_value}</p>
        <p className="text-lg"><b>Category:</b> {scheme.scheme_category}</p>
      </div>
      <div className="mt-4">
        <label className="block text-gray-700">Number of Units:</label>
        <input
          type="number"
          value={units}
          onChange={(e) => {setUnits(e.target.value); setError('')}}
          className="w-full p-2 border rounded mt-1"
          placeholder="Enter number of units"
        />
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <button
        onClick={handlePurchase}
        className="bg-green-500 text-white p-2 rounded mt-4"
      >
        Buy
      </button>
    </div>
  );
}

export default FundDetails;