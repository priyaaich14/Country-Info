import { Request, Response } from 'express';
import axiosInstance from '../utils/axiosInstance';
import cache from '../config/cache';
import { Country } from '../models/countryModel';

// Fetch all countries
export const getAllCountries = async (req: Request, res: Response): Promise<void> => {
    const cacheKey = 'allCountries';
    if (cache.has(cacheKey)) {
        res.json(cache.get(cacheKey)); // Return cached data
        return;
    }
    try {
        const response = await axiosInstance.get('/all');
        const countries: Country[] = response.data.map((country: any) => ({
            name: country.name.common,
            flag: country.flags.png,
            region: country.region,
            timezone: country.timezones, // Include timezone
            capital: country.capital ? country.capital[0] : 'Unknown', // Extract capital
            alpha3Code: country.cca3 || country.alpha3Code || '', // Add alpha3Code (or equivalent code)
        }));
        cache.set(cacheKey, countries); // Cache the fetched data
        res.json(countries); // Send response
    } catch (error) {
        console.error('Error fetching countries:', error);
        res.status(500).json({ message: 'Error fetching countries.' });
    }
};

// Fetch country by code
export const getCountryByCode = async (req: Request, res: Response): Promise<void> => {
    const { code } = req.params; // Fetch alpha3Code from params
    const cacheKey = `country_${code}`;
    if (cache.has(cacheKey)) {
        res.json(cache.get(cacheKey)); // Return cached data
        return;
    }
    try {
        const response = await axiosInstance.get(`/alpha/${code}`); // Make API call with alpha3Code
        const data = Array.isArray(response.data) ? response.data[0] : response.data;

        const country = {
            name: data?.name?.common || 'Unknown',
            flag: data?.flags?.png || '',
            region: data?.region || 'Unknown',
            subregion: data?.subregion || 'Unknown',
            population: data?.population || 0,
            capital: data?.capital?.[0] || 'Unknown',
            currencies: data?.currencies
                ? Object.values(data.currencies).map((currency: any) => ({
                      name: currency.name,
                      symbol: currency.symbol,
                  }))
                : {},
            languages: data?.languages
                ? Object.values(data.languages).join(', ')
                : 'Unknown',
            timezone: data?.timezones || [],
            topLevelDomain: data?.tld || [],
        };

        cache.set(cacheKey, country); // Cache the result
        res.json(country); // Send the processed country data
    } catch (error) {
        console.error('Error fetching country details:', error);
        res.status(500).json({ message: 'Error fetching country details.' });
    }
};

// Fetch by region
export const getCountriesByRegion = async (req: Request, res: Response): Promise<void> => {
    const { region } = req.params;
    const cacheKey = `region_${region}`;
    if (cache.has(cacheKey)) {
        res.json(cache.get(cacheKey)); // Return cached data
        return;
    }
    try {
        const response = await axiosInstance.get(`/region/${region}`);
        const countries: Country[] = response.data.map((country: any) => ({
            name: country.name.common,
            flag: country.flags.png,
            region: country.region,
        }));
        cache.set(cacheKey, countries); // Cache the fetched data
        res.json(countries);
    } catch (error) {
        console.error('Error fetching countries by region:', error);
        res.status(500).json({ message: 'Error fetching countries by region.' });
    }
};

// Search countries
export const searchCountries = async (req: Request, res: Response): Promise<void> => {
    const { name, capital, region, timezone, page, limit } = req.query;
    const cacheKey = `search_${JSON.stringify(req.query)}`;

    if (cache.has(cacheKey)) {
        res.json(cache.get(cacheKey)); // Return cached data
        return;
    }

    try {
        const response = await axiosInstance.get('/all');
        const countries: Country[] = response.data.map((country: any) => ({
            name: country.name.common,
            flag: country.flags.png,
            region: country.region,
            capital: country.capital?.[0],
            timezone: country.timezones,
            alpha3Code: country.cca3 || '', // Include alpha3Code
        }));

        const filteredCountries = countries.filter((country) => {
            const matchesName = name
                ? country.name.toLowerCase().includes((name as string).toLowerCase())
                : true;
            const matchesCapital = capital
                ? country.capital?.toLowerCase() === (capital as string).toLowerCase()
                : true;
            const matchesRegion = region
                ? country.region.toLowerCase() === (region as string).toLowerCase()
                : true;
            const matchesTimezone = timezone
                ? country.timezone?.some((tz) => tz === (timezone as string).replace(' ', '+'))
                : true;

            return matchesName && matchesCapital && matchesRegion && matchesTimezone;
        });

        const pageNum = parseInt(page as string) || 1;
        const pageLimit = parseInt(limit as string) || 10;
        const startIndex = (pageNum - 1) * pageLimit;
        const paginatedResults = filteredCountries.slice(startIndex, startIndex + pageLimit);

        cache.set(cacheKey, paginatedResults); // Cache the result
        res.json({
            currentPage: pageNum,
            totalPages: Math.ceil(filteredCountries.length / pageLimit),
            results: paginatedResults,
        });
    } catch (error) {
        console.error('Error searching countries:', error);
        res.status(500).json({ message: 'Error searching countries.' });
    }
};

// Compare countries
export const compareCountries = async (req: Request, res: Response): Promise<void> => {
    const { codes } = req.query;
    const cacheKey = `compare_${codes}`;
    if (cache.has(cacheKey)) {
        res.json(cache.get(cacheKey)); // Return cached data
        return;
    }

    try {
        const countryCodes = (codes as string).split(',');
        if (countryCodes.length !== 2) {
            res.status(400).json({ message: 'Please provide exactly two country codes separated by a comma.' });
            return;
        }

        const responses = await Promise.all(
            countryCodes.map(async (code) => {
                const response = await axiosInstance.get(`/alpha/${code}`);
                console.log(`API Response for ${code}:`, response.data); // Debugging log
                return response.data;
            })
        );

        const countries = responses.map((country) => {
            const data = Array.isArray(country) ? country[0] : country; // Handle array response
            return {
                name: data?.name?.common || 'Unknown',
                flag: data?.flags?.png || '',
                region: data?.region || 'Unknown',
                subregion: data?.subregion || 'Unknown',
                population: data?.population || 0,
                capital: data?.capital?.[0] || 'Unknown',
                area: data?.area || 0, // Include area for comparison
                currencies: data?.currencies
                    ? Object.values(data.currencies).map((currency: any) => ({
                          name: currency.name,
                          symbol: currency.symbol,
                      }))
                    : {},
                languages: data?.languages
                    ? Object.values(data.languages).join(', ')
                    : 'Unknown',
                timezone: data?.timezones || [],
            };
        });

        cache.set(cacheKey, countries); // Cache the result
        res.json(countries); // Send the compared countries data
    } catch (error) {
        console.error('Error comparing countries:', error);
        res.status(500).json({ message: 'Error comparing countries.' });
    }
};
// filtering by region and timezone
export const getFilters = async (req: Request, res: Response): Promise<void> => {
    const cacheKey = 'filters';
    if (cache.has(cacheKey)) {
      res.json(cache.get(cacheKey)); // Return cached data
      return;
    }
  
    try {
      const response = await axiosInstance.get('/all');
      const countries = response.data;
  
      const regions = Array.from(new Set(countries.map((c: any) => c.region).filter(Boolean)));
      const timezones = Array.from(new Set(countries.flatMap((c: any) => c.timezones).filter(Boolean)));
  
      const filters = { regions, timezones };
  
      cache.set(cacheKey, filters); // Cache the result
      res.json(filters);
    } catch (error) {
      console.error('Error fetching filters:', error);
      res.status(500).json({ message: 'Error fetching filters.' });
    }
  };
  
  