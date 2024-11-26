import dotenv from 'dotenv';
dotenv.config({ path: './src/.env' });
import express from 'express';
import cors from 'cors';
import {
    getAllCountries,
    getCountryByCode,
    getCountriesByRegion,
    searchCountries,
    compareCountries,
    getFilters,
   
} from './controllers/countryController';
import { validateCountryCode, validateSearchQuery, validateCompareQuery } from './validators/countryValidator';


const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.REST_COUNTRIES_API;

app.use(cors());
app.use(express.json());

// Routes
app.get('/api/countries', getAllCountries); // Fetch all countries
app.get('/api/countries/search',validateSearchQuery, searchCountries); // Search countries
app.get('/api/countries/compare', validateCompareQuery,compareCountries); // compare countries
app.get('/api/countries/region/:region', getCountriesByRegion); // Fetch countries by region
app.get('/api/countries/:code',validateCountryCode, getCountryByCode); // Fetch country by code
app.get('/api/filters', getFilters); // New route for filters

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Base URL: ${BASE_URL}`);
});
