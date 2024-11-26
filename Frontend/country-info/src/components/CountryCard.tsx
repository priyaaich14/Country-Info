
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentTime } from '../utils/timeConverter';

interface CountryCardProps {
  name: string;
  flag: string;
  region: string;
  timezone?: string[];
  capital: string;
  code: string; // Add code for navigation
}

const CountryCard: React.FC<CountryCardProps> = ({ name, flag, region, timezone, capital, code }) => {
  const navigate = useNavigate();
  const currentTime = getCurrentTime(timezone);

  const handleClick = () => {
    if (code) {
      console.log(`Navigating to country details with code: ${code}`); // Debugging log
      navigate(`/country/${code}`); // Only navigate if code is defined
    } else {
      console.error("Country code is missing!");
    }
  };

  return (
    <div
      className="border rounded-lg p-4 shadow-md cursor-pointer"
      onClick={handleClick}
    >
      <img src={flag} alt={`${name} flag`} className="w-full h-32 object-cover rounded-md" />
      <h2 className="text-lg font-bold mt-2">{name}</h2>
      <p>Capital: {capital || 'Unknown'}</p>
      <p>Region: {region}</p>
      <p>Current Time: {currentTime}</p>
    </div>
  );
};

export default CountryCard;
