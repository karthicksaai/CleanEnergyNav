'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function FormPage() {
  const [location, setLocation] = useState('');
  const [monthlyConsumption, setMonthlyConsumption] = useState('');
  const [budget, setBudget] = useState('');
  const [roofSuitability, setRoofSuitability] = useState('yes');
  const [loan, setLoan] = useState('no');
  const [preferences, setPreference] = useState('max_saving');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!location || !monthlyConsumption || !budget) {
      alert('Please fill in all required fields.');
      return;
    }

    const inputData = {
      location,
      monthly_consumption: parseInt(monthlyConsumption),
      budget: parseInt(budget),
      roof_suitability: roofSuitability,
      loan,
      preferences,
    };

    try {
      const response = await axios.post('/api/recommendation', inputData);
      const encodedData = encodeURIComponent(JSON.stringify(response.data));
      router.push(`/results?data=${encodedData}`);
    } catch (error) {
      console.error('Error fetching recommendation:', error);
      alert('Error fetching recommendation. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <h2 className="block text-gray-700 text-xl font-bold mb-6 text-center">
          Clean Energy Navigator
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
              Location
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="location"
              type="text"
              placeholder="Enter your city/zip code"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="monthlyConsumption">
              Monthly Electricity Consumption (kWh)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="monthlyConsumption"
              type="number"
              placeholder="Enter your monthly consumption"
              value={monthlyConsumption}
              onChange={(e) => setMonthlyConsumption(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="budget">
              Budget (₹)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="budget"
              type="number"
              placeholder="Enter your budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="roofSuitability">
              Is your roof suitable for solar panels?
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="roofSuitability"
              value={roofSuitability}
              onChange={(e) => setRoofSuitability(e.target.value)}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="maybe">Maybe</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="loan">
              Do you plan on taking Loan?
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="loan"
              value={loan}
              onChange={(e) => setLoan(e.target.value)}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="preferences">
              Preference
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="preferences"
              value={preferences}
              onChange={(e) => setPreference(e.target.value)}
            >
              <option value="max_saving">Maximum Saving</option>
              <option value="max_env">Maximum Environmental Benefit</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Get Recommendation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}