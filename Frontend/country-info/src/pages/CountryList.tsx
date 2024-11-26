import React, { useReducer, useEffect, useCallback } from 'react';
import axiosInstance from '../services/apiService';
import CountryCard from '../components/CountryCard';
import Filters from '../components/Filters';
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';

interface Country {
  name: string;
  flag: string;
  region: string;
  timezone?: string[];
  capital: string;
  alpha3Code?: string; // Add this field for unique country codes
}

interface State {
  countries: Country[];
  page: number;
  isLoading: boolean;
  error: string | null;
  region: string;
  timezone: string;
  search: string;
  searchType: 'name' | 'capital';
}

type Action =
  | { type: 'SET_COUNTRIES'; payload: Country[] }
  | { type: 'APPEND_COUNTRIES'; payload: Country[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_REGION'; payload: string }
  | { type: 'SET_TIMEZONE'; payload: string }
  | { type: 'SET_SEARCH'; payload: { query: string; type: 'name' | 'capital' } }
  | { type: 'SET_PAGE'; payload: number };

const initialState: State = {
  countries: [],
  page: 1,
  isLoading: false,
  error: null,
  region: '',
  timezone: '',
  search: '',
  searchType: 'name',
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_COUNTRIES':
      return { ...state, countries: action.payload };
    case 'APPEND_COUNTRIES':
      return { ...state, countries: [...state.countries, ...action.payload] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_REGION':
      return { ...state, region: action.payload, page: 1, countries: [] };
    case 'SET_TIMEZONE':
      return { ...state, timezone: action.payload, page: 1, countries: [] };
    case 'SET_SEARCH':
      return { ...state, search: action.payload.query, searchType: action.payload.type, page: 1, countries: [] };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    default:
      return state;
  }
};

const CountryList: React.FC = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const fetchCountries = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
  
    try {
      let response;
  
      if (!state.search && !state.region && !state.timezone) {
        response = await axiosInstance.get(`/api/countries`, { params: { page: state.page } });
      } else {
        response = await axiosInstance.get(`/api/countries/search`, {
          params: { [state.searchType]: state.search, region: state.region, timezone: state.timezone, page: state.page },
        });
      }
  
      console.log("API Response:", response.data); // Log the API response for debugging
  
      // Normalize the data and provide default value for missing `capital`
      const newCountries = Array.isArray(response.data)
        ? response.data.map((country: Country) => ({
            ...country,
            capital: country.capital || "Unknown",
          }))
        : response.data.results.map((country: Country) => ({
            ...country,
            capital: country.capital || "Unknown",
          })) || [];
  
      // Dispatch the countries to the state
      if (state.page === 1) {
        dispatch({ type: 'SET_COUNTRIES', payload: newCountries });
      } else {
        dispatch({ type: 'APPEND_COUNTRIES', payload: newCountries });
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch countries. Please try again.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.search, state.region, state.timezone, state.page, state.searchType]);
  

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]); // No warning because fetchCountries is memoized

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <SearchBar
          onSearch={(query, type) =>
            dispatch({ type: 'SET_SEARCH', payload: { query, type } })
          }
        />
        <Filters
          onRegionChange={(value) =>
            dispatch({ type: 'SET_REGION', payload: value })
          }
          onTimezoneChange={(value) =>
            dispatch({ type: 'SET_TIMEZONE', payload: value })
          }
        />
      </div>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={() => navigate("/compare")}
        >
      Compare Countries
      </button>
      <br/>
      {state.error && <p className="text-red-500">{state.error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {state.countries.map((country) => {
      console.log(`Country: ${country.name}, alpha3Code: ${country.alpha3Code}`); // Debugging log
      return (
      <CountryCard
        key={country.alpha3Code || country.name} // Use alpha3Code or fallback to name
        {...country}
        code={country.alpha3Code || ''} // Pass alpha3Code; fallback to empty string
        />
      );
      })}
      </div>
      {!state.isLoading && state.search && (
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
          onClick={() => navigate('/')} // Navigate to the main country list
        >
          Back to Country List
        </button>
      )}
      {!state.isLoading &&
      state.countries.length > 0 &&
      state.search === '' && ( // Only show Load More when not searching
    <button
      onClick={() => dispatch({ type: 'SET_PAGE', payload: state.page + 1 })}
      className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
    >
      Load More
    </button>
      )}
      </div>
      );
      };
  export default CountryList;
