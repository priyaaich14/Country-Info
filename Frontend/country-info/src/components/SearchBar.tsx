import React, { useState } from 'react';
interface SearchBarProps {
  onSearch: (query: string, type: 'name' | 'capital') => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'capital'>('name'); // Default to 'name'

  const handleSearch = () => {
    if (search.trim() === '') {
      alert('Please enter a search query.');
      return;
    }
    onSearch(search, searchType); // Pass search type and query to parent
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2">
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value as 'name' | 'capital')}
        className="border p-2 rounded-md"
      >
        <option value="name">Search by Name</option>
        <option value="capital">Search by Capital</option>
      </select>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`Search countries by ${searchType}...`}
        className="border p-2 rounded-md w-full"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
