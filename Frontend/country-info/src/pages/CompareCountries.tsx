import React, { useState, useEffect } from "react";
import axiosInstance from "../services/apiService";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const CompareCountries: React.FC = () => {
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedCountry1, setSelectedCountry1] = useState<string>("");
  const [selectedCountry2, setSelectedCountry2] = useState<string>("");
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch all countries for dropdowns
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axiosInstance.get("/api/countries");
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setError("Failed to load countries.");
      }
    };
    fetchCountries();
  }, []);

  // Compare selected countries
  const handleCompare = async () => {
    if (!selectedCountry1 || !selectedCountry2) {
      setError("Please select two countries to compare.");
      return;
    }

    if (selectedCountry1 === selectedCountry2) {
      setError("Please select two different countries.");
      return;
    }

    try {
      const response = await axiosInstance.get("/api/countries/compare", {
        params: { codes: `${selectedCountry1},${selectedCountry2}` },
      });
      setComparisonData(response.data);
      setError(null);
    } catch (error) {
      console.error("Error comparing countries:", error);
      setError("Failed to compare countries. Please try again.");
    }
  };

  // Dynamically calculate the maximum Y-axis value
  const maxPopulation = Math.max(
    ...comparisonData.map((country) => country.population || 0)
  );
  const maxArea = Math.max(
    ...comparisonData.map((country) => country.area || 0)
  );
  const dynamicMax = Math.max(maxPopulation, maxArea) * 1.25; // Add 10% buffer

  // Chart data
  const chartData = {
    labels: comparisonData.map((country) => country.name),
    datasets: [
      {
        label: "Population",
        data: comparisonData.map((country) => country.population),
        backgroundColor: ["#4CAF50", "#F44336"],
        borderColor: ["#388E3C", "#D32F2F"],
        borderWidth: 1,
      },
      {
        label: "Area (sq km)",
        data: comparisonData.map((country) => country.area),
        backgroundColor: ["#FFC107", "#FF5722"],
        borderColor: ["#FFA000", "#E64A19"],
        borderWidth: 1,
      },
    ],
  };

const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.raw) {
              label += context.raw.toLocaleString();
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: Math.ceil(dynamicMax / 10) * 10, // Round the max value up to the nearest 10
        ticks: {
          callback: (value: any) => Math.floor(value).toLocaleString(), // Remove decimals
          stepSize: Math.ceil(dynamicMax / 10), // Adjust step size to reduce clutter
        },
      },
    },
  };
  

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Compare Countries</h2>
      {error && <p className="text-red-500">{error}</p>}

      {/* Dropdowns for country selection */}
      
        <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
        <select
        className="border px-4 py-2 rounded w-full sm:w-auto"
        value={selectedCountry1}
        onChange={(e) => setSelectedCountry1(e.target.value)}
        >
        <option value="">Select First Country</option>
        {countries.map((country) => (
        <option key={country.alpha3Code} value={country.alpha3Code}>
        {country.name}
        </option>
        ))}
        </select>
        <select
        className="border px-4 py-2 rounded w-full sm:w-auto"
        value={selectedCountry2}
        onChange={(e) => setSelectedCountry2(e.target.value)}
        >
        <option value="">Select Second Country</option>
        {countries.map((country) => (
        <option key={country.alpha3Code} value={country.alpha3Code}>
        {country.name}
        </option>
        ))}
    </select>

    <button
    className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto"
    onClick={handleCompare}
    >
    Compare
    </button>
    </div>

      {/* Comparison details */}
      {comparisonData.length === 2 && (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {comparisonData.map((country) => (
            <div
              key={country.name}
              className="border p-4 rounded shadow-md w-full md:w-1/2"
            >
              <h3 className="text-lg font-bold">{country.name}</h3>
              <img
                src={country.flag}
                alt={`${country.name} flag`}
                className="w-full h-32 object-cover rounded mb-2"
              />
              <p>Region: {country.region}</p>
              <p>Subregion: {country.subregion}</p>
              <p>Population: {country.population.toLocaleString()}</p>
              <p>Area: {country.area.toLocaleString()} sq km</p>
              <p>Capital: {country.capital}</p>
              <p>Languages: {country.languages}</p>
              <p>
                Currencies:{" "}
                {country.currencies
                  .map((cur: any) => `${cur.name} (${cur.symbol})`)
                  .join(", ")}
              </p>
              <p>Timezones: {country.timezone.join(", ")}</p>
            </div>
          ))}
        </div>
      )}

      {/* Chart visualization */}
      {comparisonData.length === 2 && (
        <div>
          <h3 className="text-xl font-bold mb-4">Population and Area Comparison</h3>
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}

      <button
        onClick={() => navigate("/")}
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
      >
        Back to Country List
      </button>
    </div>
  );
};

export default CompareCountries;
