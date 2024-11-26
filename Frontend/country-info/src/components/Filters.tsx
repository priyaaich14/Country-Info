import React, { useEffect, useState } from "react";
import axiosInstance from "../services/apiService";

interface FiltersProps {
  onRegionChange: (region: string) => void;
  onTimezoneChange: (timezone: string) => void;
}

const Filters: React.FC<FiltersProps> = ({
  onRegionChange,
  onTimezoneChange,
}) => {
  const [regions, setRegions] = useState<string[]>([]);
  const [timezones, setTimezones] = useState<string[]>([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await axiosInstance.get("/api/filters");
        setRegions(response.data.regions || []);
        setTimezones(response.data.timezones || []);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    fetchFilters();
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <select
        onChange={(e) => onRegionChange(e.target.value)}
        className="border p-2 rounded-md"
      >
        <option value="">All Regions</option>
        {regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => onTimezoneChange(e.target.value)}
        className="border p-2 rounded-md"
      >
        <option value="">All Timezones</option>
        {timezones.map((timezone) => (
          <option key={timezone} value={timezone}>
            {timezone}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filters;
