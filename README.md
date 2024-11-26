Country Information App
This project is a full-stack web application that allows users to explore data about countries using the REST Countries API. The application consists of a Node.js/Express backend and a React/TypeScript frontend. Users can browse, search, filter, and compare country data with features such as charts and responsive UI.

Features
Backend
APIs for Country Data:
Fetch all countries
Fetch details of a single country
Filter countries by region
Search for countries by name, capital, region, or timezone
Caching: Reduces external API requests for improved performance.
Error Handling: Handles API errors such as 404 and 500 gracefully.
Frontend
Country List Page:
Displays a list of all countries with flags, names, regions, and current local time.
Infinite scrolling with lazy loading for better performance.
Filters by region and timezone.
Search by country name or capital.
Country Detail Page:
Detailed information on selected countries, including population, currency, and languages.
Compare Countries Page:
Compare population and area between two selected countries using dynamic charts.
Responsive UI:
Styled using Tailwind CSS for mobile-friendly design.
Error and loading states with user-friendly messages.
Tech Stack
Backend:
Node.js
Express
TypeScript
Axios
Frontend:
React
TypeScript
Chart.js
React Chart.js 2
Tailwind CSS
Other Tools:
Git/GitHub
REST Countries API
Installation and Setup
Prerequisites
Ensure you have the following installed:

Node.js
npm or yarn
Git

Backend Setup
Clone the repository:
git clone https://github.com/priyaaich14/Country-Info.git
Install dependencies:
npm install
Create a .env file in the backend folder and add the following:
PORT=3002
API_URL=https://restcountries.com/v3.1
Start the backend server:
npm run dev
Frontend Setup
Navigate to the frontend folder:
cd frontend
Install dependencies:
npm install
Start the development server:
npm start

Development Notes
Key Features Implemented:
Backend:
Caching to minimize REST Countries API calls.
Custom error handling for API responses.
Frontend:
Dynamic Y-axis scaling for charts.
Responsive design with Tailwind CSS.
Lazy loading and infinite scroll for country list.
