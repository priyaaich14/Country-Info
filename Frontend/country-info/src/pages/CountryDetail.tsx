import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../services/apiService';

const CountryDetail: React.FC = () => {
  const { code } = useParams(); // alpha3Code from the route
  const navigate = useNavigate();
  const [country, setCountry] = useState<any>(null);

  useEffect(() => {
    if (!code) {
      console.error("Country code is missing in the route!");
      return;
    }
    console.log(`Fetching details for country with code: ${code}`); // Debugging log

    const fetchCountry = async () => {
      try {
        const response = await axiosInstance.get(`/api/countries/${code}`); // Fetch by alpha3Code
        setCountry(response.data);
      } catch (error) {
        console.error('Error fetching country details:', error);
      }
    };

    fetchCountry();
  }, [code]);

  if (!code) {
    return <p>Error: Country code is missing in the URL.</p>;
  }

  if (!country) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => navigate('/')} // Navigate to country list
      >
        Back to Country List
      </button>
      <h2 className="text-2xl font-bold">{country.name}</h2>
      <img src={country.flag} alt={`${country.name} flag`} className="w-full h-40 object-cover rounded-md mb-4" />
      <p>Region: {country.region}</p>
      <p>Subregion: {country.subregion}</p>
      <p>Population: {country.population}</p>
      <p>Capital: {country.capital}</p>
      <p>Languages: {country.languages}</p>
      <p>Currencies: {country.currencies.map((cur: any) => `${cur.name} (${cur.symbol})`).join(', ')}</p>
      <p>Timezones: {country.timezone.join(', ')}</p>
      <p>Top Level Domains: {country.topLevelDomain.join(', ')}</p>
    </div>
  );
};

export default CountryDetail;
