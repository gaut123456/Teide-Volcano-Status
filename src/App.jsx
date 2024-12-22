import React, { useState, useEffect } from 'react';
import { ThermometerSun, Wind, Droplets, MapPin, Timer, Car, Store, Mountain, Moon, Sun, Map, Eye, CableCar } from 'lucide-react';

const TeideStatus = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.volcanoteide.com/widgets/status', {
          headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Language': 'eng',
            'Content-Type': 'application/json',
            'Origin': 'https://www.volcanoteide.com',
            'Referer': 'https://www.volcanoteide.com/',
            'x-api-key': 'VOLCANO'
          }
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setData(jsonData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    return status === "opened" 
      ? "text-green-600 dark:text-green-400" 
      : "text-red-600 dark:text-red-400";
  };

  const getStatusBadgeClass = (status) => {
    return `px-3 py-1 rounded-full ${
      status === "opened"
        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    }`;
  };

  const getFacilityIcon = (id, type) => {
    if (id === 'cablecar') {
      return <CableCar className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
    }
    switch (type) {
      case 'venue':
        return <Mountain className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
      case 'parking':
        return <Car className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
      case 'retail':
        return <Store className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
      case 'viewpoint':
        return <Eye className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
      default:
        return <MapPin className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen dark:bg-gray-900 dark:text-white"><div className="text-xl">Loading status...</div></div>;
  if (error) return <div className="flex items-center justify-center min-h-screen dark:bg-gray-900 dark:text-white"><div className="text-xl text-red-600 dark:text-red-400">Error: {error}</div></div>;
  if (!data) return null;

  const trails = Object.values(data.status.installations).filter(
    facility => facility.type === 'path'
  );

  const facilities = Object.values(data.status.installations).filter(
    facility => facility.type !== 'path'
  );

  // Hard code Cable Car as the first item
  const cableCar = facilities.find(facility => facility.id === 'cablecar');
  const otherFacilities = facilities.filter(facility => facility.id !== 'cablecar');
  const sortedFacilities = [cableCar, ...otherFacilities];

  return (
    <div className="min-h-screen p-4 transition-colors duration-200 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with dark mode toggle */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teide Volcano Status</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? <Sun className="w-6 h-6 text-yellow-500" /> : <Moon className="w-6 h-6 text-gray-700" />}
          </button>
        </div>
        
        {/* Weather Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <ThermometerSun className="w-6 h-6 dark:text-white" />
            <h2 className="text-xl font-bold dark:text-white">Current Weather</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <ThermometerSun className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Temperature</p>
                <p className="text-xl font-semibold dark:text-white">{data.status.weather.teleferico.temperature}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Droplets className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Humidity</p>
                <p className="text-xl font-semibold dark:text-white">{data.status.weather.teleferico.humidity}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Wind className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Wind Speed</p>
                <p className="text-xl font-semibold dark:text-white">{data.status.weather.teleferico.windSpeed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trails Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <Map className="w-6 h-6 dark:text-white" />
            <h2 className="text-xl font-bold dark:text-white">Hiking Trails Status</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trails.map((trail) => (
              <div key={trail.id} className="flex flex-col p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Map className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                    <div>
                      <h3 className="font-medium dark:text-white">{trail.name}</h3>
                      {trail.info && <p className="text-sm text-gray-500 dark:text-gray-400">{trail.info}</p>}
                    </div>
                  </div>
                  <span className={getStatusBadgeClass(trail.status)}>
                    {trail.status.charAt(0).toUpperCase() + trail.status.slice(1)}
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {new Date(trail.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Facilities Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-6 h-6 dark:text-white" />
            <h2 className="text-xl font-bold dark:text-white">Facilities Status</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedFacilities.map((facility) => (
              <div key={facility.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  {getFacilityIcon(facility.id, facility.type)}
                  <div>
                    <p className="font-medium dark:text-white">{facility.name}</p>
                    {facility.info && <p className="text-sm text-gray-500 dark:text-gray-400">{facility.info}</p>}
                  </div>
                </div>
                <div className={`font-semibold ${getStatusColor(facility.status)}`}>
                  {facility.status.charAt(0).toUpperCase() + facility.status.slice(1)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Forecast Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <ThermometerSun className="w-6 h-6 dark:text-white" />
            <h2 className="text-xl font-bold dark:text-white">6-Day Forecast</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(data.status.forecast).map(([date, forecast]) => (
              <div key={date} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                <p className="font-medium dark:text-white">{forecast.day}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{date}</p>
                <div className="mt-2">
                  <p className="text-blue-600 dark:text-blue-400">{forecast.temperatureMax.toFixed(1)}°C</p>
                  <p className="text-gray-600 dark:text-gray-400">{forecast.temperatureMin.toFixed(1)}°C</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeideStatus;