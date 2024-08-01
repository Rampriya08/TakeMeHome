import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import openrouteservice from 'openrouteservice-js';
import axios from 'axios';
import { markerIcon2x, markerIcon, markerShadow } from './icons';
import Logout from './Logout';
import UserProfile from '../User/User';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DenyAccess = () => {
  const [routes, setRoutes] = useState({});
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [sourceLocation, setSourceLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [selectedRouteType, setSelectedRouteType] = useState('walking');
  const mapRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('previousState', JSON.stringify({ route: '/denyAccess' }));

    
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      },
      error => console.error('Error getting user location:', error),
      { enableHighAccuracy: true }
    );
  }, []);

  const ors = new openrouteservice.Directions({
    api_key: '5b3ce3597851110001cf6248df2b7ca6394249eb8ab70e8e4114ae54',
  });

  const calculateRoute = async (src, dest, profile) => {
    try {
      const response = await ors.calculate({
        coordinates: [src, dest],
        profile: profile,
        format: 'geojson',
      });

      return {
        coordinates: response.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]),
        distance: response.features[0].properties.segments[0].distance,
        duration: response.features[0].properties.segments[0].duration,
      };
    } catch (error) {
      console.error(`Error calculating ${profile} route:`, error);
      return null;
    }
  };

  const handleGeocode = async (location) => {
    try {
      const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
        params: {
          key: '78a0cf8001c2441a8a16d59a8386842c',
          q: location,
        },
      });
      const { lat, lng } = response.data.results[0].geometry;
      return { lat, lng };
    } catch (error) {
      console.error('Error geocoding location:', error);
      return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const sourceLocationValue = form.elements.sourceLocation.value;
    const destinationLocationValue = form.elements.destinationLocation.value;

    const sourceCoord = await handleGeocode(sourceLocationValue);
    const destinationCoord = await handleGeocode(destinationLocationValue);

    if (sourceCoord && destinationCoord) {
      setSourceLocation(sourceLocationValue);
      setDestinationLocation(destinationLocationValue);
      setSource(sourceCoord);
      setDestination(destinationCoord);

      const calculatedRoute = await calculateRoute(
        [sourceCoord.lng, sourceCoord.lat],
        [destinationCoord.lng, destinationCoord.lat],
        'foot-walking'
      );

      if (calculatedRoute) {
        setRoutes({
          walking: calculatedRoute,
        });

        if (mapRef.current) {
          mapRef.current.setView([sourceCoord.lat, sourceCoord.lng], 13);
        }
      }
    }
  };

  const handleToggleRouteType = async (routeType) => {
    setSelectedRouteType(routeType);

    if (!routes[routeType]) {
      const src = [source.lng, source.lat];
      const dest = [destination.lng, destination.lat];

      let calculatedRoute;

      if (routeType === 'plane') {
        calculatedRoute = calculateStraightLineRoute(src, dest);
      } else {
        const profile = getProfileForRouteType(routeType);
        calculatedRoute = await calculateRoute(src, dest, profile);
      }

      if (calculatedRoute) {
        setRoutes({
          ...routes,
          [routeType]: calculatedRoute,
        });
      }
    }
  };

  const calculateStraightLineRoute = (src, dest) => {
    const distance = calculateHaversineDistance(src, dest);
    const duration = distance / 900 * 3600; // Approximation: Plane speed 900 km/h
    return {
      coordinates: [src, dest].map(coord => [coord[1], coord[0]]),
      distance: distance * 1000,
      duration: duration,
    };
  };

  const calculateHaversineDistance = (src, dest) => {
    const R = 6371;
    const dLat = toRadians(dest[1] - src[1]);
    const dLon = toRadians(dest[0] - src[0]);
    const lat1 = toRadians(src[1]);
    const lat2 = toRadians(dest[1]);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  const getProfileForRouteType = (routeType) => {
    switch (routeType) {
      case 'walking':
        return 'foot-walking';
      case 'driving':
        return 'driving-car';
      case 'cycling':
        return 'cycling-regular';
      case 'bus':
        return 'driving-car'; 
      case 'train':
        return 'driving-car'; 
      case 'plane':
        return ''; 
      default:
        return '';
    }
  };

  const formatDuration = (durationInSeconds) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    return `${hours} hours ${minutes} minutes`;
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getRouteColor = (routeType) => {
    switch (routeType) {
      case 'walking':
        return 'blue';
      case 'driving':
        return 'red';
      case 'cycling':
        return 'green';
      case 'bus':
        return 'orange';
      case 'train':
        return 'purple';
      case 'plane':
        return 'black';
      default:
        return 'gray';
    }
  };

  const handleTicketBooking = () => {
    if (selectedRouteType === 'bus') {
      navigate('/book-bus-ticket', {
        state: {
          source: sourceLocation,
          destination: destinationLocation,
          distance: routes[selectedRouteType].distance,
        },
      });
    } else {
      switch (selectedRouteType) {
        case 'train':
          navigate('/book-train-ticket',{
            state: {
              source: sourceLocation,
              destination: destinationLocation,
              distance: routes[selectedRouteType].distance,
            },
          });
          break;
        case 'plane':
          navigate('/book-plane-ticket',{
            state: {
              source: sourceLocation,
              destination: destinationLocation,
              distance: routes[selectedRouteType].distance,
            },
          });
          break;
        default:
          console.warn('Ticket booking not supported for this route type.');
      }
    }
  };

  return (
    <> 
<header className="flex justify-between items-center p-4 bg-yellow-900 text-white">
      <div className="text-xl font-bold">Take Me Home</div>
      <div className="flex-grow"></div>
      <UserProfile />
    </header>
     <div className="flex items-center justify-center w-full min-h-screen overflow-x-hidden">
      <div className="bg-yellow-900 p-8 rounded-lg shadow-md w-full max-w-4xl opacity-80  text-white">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              Source Location:
              <input type="text" name="sourceLocation" className="form-input mt-1 block w-full  text-black " required />
            </label>
            <label className="block">
              Destination Location:
              <input type="text" name="destinationLocation" className="form-input mt-1 block w-full  text-black" required />
            </label>
          </div>
          <div className="flex justify-end mt-4">
            <button type="submit" className="p-2 bg-blue-600 text-white rounded">Calculate Route</button>
          </div>
        </form>
        <div className="flex space-x-2 mt-4">
          <button
            className={`p-2 ${selectedRouteType === 'walking' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'} rounded`}
            onClick={() => handleToggleRouteType('walking')}
          >
            Walking
          </button>
          <button
            className={`p-2 ${selectedRouteType === 'driving' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'} rounded`}
            onClick={() => handleToggleRouteType('driving')}
          >
            Driving
          </button>
          <button
            className={`p-2 ${selectedRouteType === 'cycling' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'} rounded`}
            onClick={() => handleToggleRouteType('cycling')}
          >
            Cycling
          </button>
          <button
            className={`p-2 ${selectedRouteType === 'bus' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'} rounded`}
            onClick={() => handleToggleRouteType('bus')}
          >
            Bus
          </button>
          <button
            className={`p-2 ${selectedRouteType === 'train' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'} rounded`}
            onClick={() => handleToggleRouteType('train')}
          >
            Train
          </button>
          <button
            className={`p-2 ${selectedRouteType === 'plane' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'} rounded`}
            onClick={() => handleToggleRouteType('plane')}
          >
            Plane
          </button>
        </div>
        <MapContainer center={userLocation ? [userLocation.lat, userLocation.lng] : [51.505, -0.09]} zoom={13} className="h-96 mt-4" ref={mapRef}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>Your Location</Popup>
            </Marker>
          )}
          {source && (
            <Marker position={[source.lat, source.lng]}>
              <Popup>{`Source: ${sourceLocation}`}</Popup>
            </Marker>
          )}
          {destination && (
            <Marker position={[destination.lat, destination.lng]}>
              <Popup>{`Destination: ${destinationLocation}`}</Popup>
            </Marker>
          )}
          {routes[selectedRouteType] && (
            <Polyline positions={routes[selectedRouteType].coordinates} color={getRouteColor(selectedRouteType)} />
          )}
        </MapContainer>
        {routes[selectedRouteType] && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-white">{capitalizeFirstLetter(selectedRouteType)} Route:</h3>
            <p className="text-white">Distance: {(routes[selectedRouteType].distance / 1000).toFixed(2)} km</p>
            <p className="text-white">Duration: {formatDuration(routes[selectedRouteType].duration)}</p>
            {(selectedRouteType === 'bus' || selectedRouteType === 'train' || selectedRouteType === 'plane') && (
              <button
                className="mt-2 p-2 text-white bg-green-600 rounded"
                onClick={handleTicketBooking}
              >
                Book Ticket
              </button>
            )}
          </div>
        )}
      
      </div>
    </div>
    </>

  );
};

export default DenyAccess;


/*import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import openrouteservice from 'openrouteservice-js';
import axios from 'axios';
import { markerIcon2x, markerIcon, markerShadow } from './icons'; // Example import for custom icons
import Logout from './Logout';

// Update the default icon URLs
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DenyAccess = () => {
  const [routes, setRoutes] = useState({});
  const [source, setSource] = useState(null); // Source marker position
  const [destination, setDestination] = useState(null); // Destination marker position
  const [sourceLocation, setSourceLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [selectedRouteType, setSelectedRouteType] = useState('walking'); // State to track selected route type
  const mapRef = useRef(null);

  useEffect(() => {
    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      },
      error => console.error('Error getting user location:', error),
      { enableHighAccuracy: true }
    );
  }, []);

  const ors = new openrouteservice.Directions({
    api_key: '5b3ce3597851110001cf6248b1ddb69b1e884f9aab264b55dd761f8f',
  });

  const calculateRoute = async (src, dest, profile) => {
    try {
      const response = await ors.calculate({
        coordinates: [src, dest],
        profile: profile,
        format: 'geojson',
      });

      return {
        coordinates: response.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]),
        distance: response.features[0].properties.segments[0].distance,
        duration: response.features[0].properties.segments[0].duration,
      };
    } catch (error) {
      console.error(`Error calculating ${profile} route:`, error);
      return null;
    }
  };

  const handleGeocode = async (location) => {
    try {
      const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
        params: {
          key: '78a0cf8001c2441a8a16d59a8386842c',
          q: location,
        },
      });
      const { lat, lng } = response.data.results[0].geometry;
      return { lat, lng };
    } catch (error) {
      console.error('Error geocoding location:', error);
      return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const sourceLocationValue = form.elements.sourceLocation.value;
    const destinationLocationValue = form.elements.destinationLocation.value;

    const sourceCoord = await handleGeocode(sourceLocationValue);
    const destinationCoord = await handleGeocode(destinationLocationValue);

    if (sourceCoord && destinationCoord) {
      setSourceLocation(sourceLocationValue);
      setDestinationLocation(destinationLocationValue);
      setSource(sourceCoord);
      setDestination(destinationCoord);

      // Calculate routes for default route type (walking)
      const calculatedRoute = await calculateRoute(
        [sourceCoord.lng, sourceCoord.lat],
        [destinationCoord.lng, destinationCoord.lat],
        'foot-walking'
      );

      if (calculatedRoute) {
        setRoutes({
          walking: calculatedRoute,
        });

        // Center the map on the source location
        if (mapRef.current) {
          mapRef.current.setView([sourceCoord.lat, sourceCoord.lng], 13);
        }
      }
    }
  };

  const handleToggleRouteType = async (routeType) => {
    setSelectedRouteType(routeType);

    // If route is not already calculated, calculate it
    if (!routes[routeType]) {
      const src = [source.lng, source.lat];
      const dest = [destination.lng, destination.lat];
      const profile = getProfileForRouteType(routeType);

      const calculatedRoute = await calculateRoute(src, dest, profile);

      if (calculatedRoute) {
        setRoutes({
          ...routes,
          [routeType]: calculatedRoute,
        });
      }
    }
  };

  const calculatePlaneRoute = async (src, dest) => {
    try {
      // Example: Aviation-Edge API call or any other relevant API
      // For demonstration purposes, a placeholder is used.
      const response = await axios.get('http://aviation-edge.com/v2/public/routes', {
        params: {
          key: 'YOUR_AVIATION_EDGE_API_KEY',
          depIata: src,
          arrIata: dest,
        },
      });

      // Extract relevant data from response
      const planeRoute = response.data.map(flight => {
        return {
          coordinates: [
            [flight.latitude_departure, flight.longitude_departure],
            [flight.latitude_arrival, flight.longitude_arrival],
          ],
          distance: flight.distance,
          duration: flight.duration,
        };
      });

      // Taking the first flight route for simplicity
      return planeRoute[0];
    } catch (error) {
      console.error('Error calculating plane route:', error);
      return null;
    }
  };

  // Helper function to get profile based on route type
  const getProfileForRouteType = (routeType) => {
    switch (routeType) {
      case 'walking':
        return 'foot-walking';
      case 'driving':
        return 'driving-car';
      case 'cycling':
        return 'cycling-regular';
      case 'bus':
        return 'driving-car'; // Placeholder for actual public transport API
      case 'train':
        return 'driving-car'; // Placeholder for actual public transport API
      case 'plane':
        return 'driving-car'; // Placeholder for actual plane route calculation
      default:
        return '';
    }
  };

  // Helper function to format duration in hours and minutes
  const formatDuration = (durationInSeconds) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    return `${hours} hours ${minutes} minutes`;
  };

  // Helper function to capitalize first letter of string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Helper function to get route color based on route type
  const getRouteColor = (routeType) => {
    switch (routeType) {
      case 'walking':
        return 'blue';
      case 'driving':
        return 'red';
      case 'cycling':
        return 'green';
      case 'bus':
        return 'orange';
      case 'train':
        return 'purple';
      case 'plane':
        return 'black';
      default:
        return 'black';
    }
  };

  // Handler for ticket booking button
  const handleTicketBooking = () => {
    // Redirect to ticket booking page or perform any other action
    alert('Redirecting to ticket booking page...');
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen overflow-x-hidden">
      <div className="bg-yellow-900 p-8 rounded-lg shadow-md w-full max-w-4xl opacity-80">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2 items-end">
            <label className="flex-1">
              <span className="block mb-1 text-white">Source Location:</span>
              <input type="text" name="sourceLocation" className="w-full p-2 border rounded" required />
            </label>
            <label className="flex-1">
              <span className="block mb-1 text-white">Destination Location:</span>
              <input type="text" name="destinationLocation" className="w-full p-2 border rounded" required />
            </label>
            <button type="submit" className="p-2 text-white bg-blue-600 rounded">
              Calculate Route
            </button>
          </div>
        </form>
        <div className="mt-4 space-x-2">
          <button
            className={`p-2 ${selectedRouteType === 'walking' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'} rounded`}
            onClick={() => handleToggleRouteType('walking')}
          >
            Walking
          </button>
          <button
            className={`p-2 ${selectedRouteType === 'driving' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'} rounded`}
            onClick={() => handleToggleRouteType('driving')}
          >
            Driving
          </button>
          <button
            className={`p-2 ${selectedRouteType === 'cycling' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'} rounded`}
            onClick={() => handleToggleRouteType('cycling')}
          >
            Cycling
          </button>
          <button
            className={`p-2 ${selectedRouteType === 'bus' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'} rounded`}
            onClick={() => handleToggleRouteType('bus')}
          >
            Bus
          </button>
          <button
            className={`p-2 ${selectedRouteType === 'train' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'} rounded`}
            onClick={() => handleToggleRouteType('train')}
          >
            Train
          </button>
          <button
            className={`p-2 ${selectedRouteType === 'plane' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'} rounded`}
            onClick={() => handleToggleRouteType('plane')}
          >
            Plane
          </button>
        </div>
        <MapContainer center={userLocation ? [userLocation.lat, userLocation.lng] : [51.505, -0.09]} zoom={13} className="h-96 mt-4" ref={mapRef}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>Your Location</Popup>
            </Marker>
          )}
          {source && (
            <Marker position={[source.lat, source.lng]}>
              <Popup>{`Source: ${sourceLocation}`}</Popup>
            </Marker>
          )}
          {destination && (
            <Marker position={[destination.lat, destination.lng]}>
              <Popup>{`Destination: ${destinationLocation}`}</Popup>
            </Marker>
          )}
          {routes[selectedRouteType] && (
            <Polyline positions={routes[selectedRouteType].coordinates} color={getRouteColor(selectedRouteType)} />
          )}
        </MapContainer>
        {routes[selectedRouteType] && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">{capitalizeFirstLetter(selectedRouteType)} Route:</h3>
            <p>Distance: {(routes[selectedRouteType].distance / 1000).toFixed(2)} km</p>
            <p>Duration: {formatDuration(routes[selectedRouteType].duration)}</p>
            {(selectedRouteType === 'bus' || selectedRouteType === 'train' || selectedRouteType === 'plane') && (
              <button
                className="mt-2 p-2 text-white bg-green-600 rounded"
                onClick={handleTicketBooking}
              >
                Book Ticket
              </button>
            )}
          </div>
        )}
        <Logout />
      </div>
    </div>
  );
};

export default DenyAccess;




/*import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import openrouteservice from 'openrouteservice-js';
import axios from 'axios';
import { markerIcon2x, markerIcon, markerShadow } from './icons'; // Example import for custom icons
import Logout from './Logout';

// Update the default icon URLs
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DenyAccess = () => {
  const [routes, setRoutes] = useState({});
  const [source, setSource] = useState(null); // Source marker position
  const [destination, setDestination] = useState(null); // Destination marker position
  const [sourceLocation, setSourceLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setSource({ lat: latitude, lng: longitude });
      },
      error => console.error('Error getting user location:', error),
      { enableHighAccuracy: true }
    );
  }, []);

  const ors = new openrouteservice.Directions({
    api_key: '5b3ce3597851110001cf6248b1ddb69b1e884f9aab264b55dd761f8f', // Your OpenRouteService API key
  });

  const calculateRoute = async (src, dest, profile) => {
    try {
      const response = await ors.calculate({
        coordinates: [src, dest],
        profile: profile,
        format: 'geojson',
      });

      return {
        coordinates: response.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]),
        distance: response.features[0].properties.segments[0].distance,
        duration: response.features[0].properties.segments[0].duration,
      };
    } catch (error) {
      console.error(`Error calculating ${profile} route:`, error);
      return null;
    }
  };

  const handleGeocode = async (location) => {
    try {
      const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
        params: {
          key: '78a0cf8001c2441a8a16d59a8386842c', // Your OpenCage API key
          q: location,
        },
      });
      const { lat, lng } = response.data.results[0].geometry;
      return { lat, lng };
    } catch (error) {
      console.error('Error geocoding location:', error);
      return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const sourceLocationValue = form.elements.sourceLocation.value;
    const destinationLocationValue = form.elements.destinationLocation.value;

    const sourceCoord = await handleGeocode(sourceLocationValue);
    const destinationCoord = await handleGeocode(destinationLocationValue);

    if (sourceCoord && destinationCoord) {
      setSourceLocation(sourceLocationValue);
      setDestinationLocation(destinationLocationValue);
      setSource(sourceCoord);
      setDestination(destinationCoord);

      // Calculate routes for different profiles
      const walkingRoute = await calculateRoute(
        [sourceCoord.lng, sourceCoord.lat],
        [destinationCoord.lng, destinationCoord.lat],
        'foot-walking'
      );

      const drivingRoute = await calculateRoute(
        [sourceCoord.lng, sourceCoord.lat],
        [destinationCoord.lng, destinationCoord.lat],
        'driving-car'
      );

      const cyclingRoute = await calculateRoute(
        [sourceCoord.lng, sourceCoord.lat],
        [destinationCoord.lng, destinationCoord.lat],
        'cycling-regular'
      );

      // Update state with routes
      setRoutes({
        walking: walkingRoute,
        driving: drivingRoute,
        cycling: cyclingRoute,
      });

      // Center the map on the route
      if (mapRef.current) {
        mapRef.current.setView([sourceCoord.lat, sourceCoord.lng], 13);
      }
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen overflow-x-hidden">
      <div className="bg-yellow-900 p-8 rounded-lg shadow-md w-full max-w-4xl opacity-80">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2 items-end">
            <label className="flex-1">
              <span className="block mb-1 text-white">Source Location:</span>
              <input type="text" name="sourceLocation" className="w-full p-2 border rounded" required />
            </label>
            <label className="flex-1">
              <span className="block mb-1 text-white">Destination Location:</span>
              <input type="text" name="destinationLocation" className="w-full p-2 border rounded" required />
            </label>
            <button type="submit" className="p-2 text-white bg-blue-600 rounded">
              Calculate Route
            </button>
          </div>
        </form>
        <MapContainer center={userLocation ? [userLocation.lat, userLocation.lng] : [51.505, -0.09]} zoom={13} className="h-96 mt-4" ref={mapRef}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>Your Location</Popup>
            </Marker>
          )}
          {source && (
            <Marker position={[source.lat, source.lng]}>
              <Popup>{`Source: ${sourceLocation}`}</Popup>
            </Marker>
          )}
          {destination && (
            <Marker position={[destination.lat, destination.lng]}>
              <Popup>{`Destination: ${destinationLocation}`}</Popup>
            </Marker>
          )}
          {routes.walking && (
            <Polyline positions={routes.walking.coordinates} color="blue" />
          )}
          {routes.driving && (
            <Polyline positions={routes.driving.coordinates} color="red" />
          )}
          {routes.cycling && (
            <Polyline positions={routes.cycling.coordinates} color="green" />
          )}
        </MapContainer>
        {routes.walking && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Walking Route:</h3>
            <p>Distance: {(routes.walking.distance / 1000).toFixed(2)} km</p>
            <p>Duration: {(routes.walking.duration / 60).toFixed(1)} minutes</p>
          </div>
        )}
        {routes.driving && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Driving Route:</h3>
            <p>Distance: {(routes.driving.distance / 1000).toFixed(2)} km</p>
            <p>Duration: {(routes.driving.duration / 60).toFixed(1)} minutes</p>
          </div>
        )}
        {routes.cycling && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Cycling Route:</h3>
            <p>Distance: {(routes.cycling.distance / 1000).toFixed(2)} km</p>
            <p>Duration: {(routes.cycling.duration / 60).toFixed(1)} minutes</p>
          </div>
        )}
        <Logout />
      </div>
    </div>
  );
};

export default DenyAccess;
*/