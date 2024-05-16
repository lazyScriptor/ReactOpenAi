import React, { useState, useEffect } from 'react';

//AIzaSyCOuOGDld8dMKAsvn06Sfxk6l6GLfru4jo meka copy kraganin kohehari edit kranna kalin

const apiKey = 'AIzaSyCOuOGDld8dMKAsvn06Sfxk6l6GLfru4jo'; 
function MapAPI() {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [autocomplete, setAutocomplete] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedPlacePhotos, setSelectedPlacePhotos] = useState([]);

  useEffect(() => {
    const loadMapScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    };

    loadMapScript();

    return () => {
      // Clean up script tag
      const script = document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]');
      if (script) {
        script.remove();
      }
    };
  }, []);

  const initMap = () => {
    const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      mapTypeId: 'roadmap',
    });
    setMap(mapInstance);

    // Try HTML5 geolocation to get the user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(pos);
          mapInstance.setCenter(pos);
        },
        () => {
          console.error('Error: The Geolocation service failed.');
        }
      );
    } else {
      console.error('Error: Your browser doesn\'t support geolocation.');
    }

    // Initialize autocomplete
    const input = document.getElementById('searchTextField');
    const autocompleteInstance = new window.google.maps.places.Autocomplete(input);
    autocompleteInstance.bindTo('bounds', mapInstance);
    setAutocomplete(autocompleteInstance);

    // Add event listener for place selection
    autocompleteInstance.addListener('place_changed', () => {
      const place = autocompleteInstance.getPlace();
      if (!place.geometry || !place.geometry.location) {
        console.error('No location found for place:', place);
        return;
      }

      // Clear existing markers
      clearMarkers();

      // Add marker for selected place
      const marker = new window.google.maps.Marker({
        map: mapInstance,
        position: place.geometry.location,
        title: place.name,
      });
      setMarkers([...markers, marker]);

      // Pan the map to the selected location
      mapInstance.panTo(place.geometry.location);
    });
  };

  const clearMarkers = () => {
    // Clears all markers from the map
    markers.forEach(marker => {
      marker.setMap(null);
    });
    setMarkers([]);
  };

  const searchRestaurants = () => {
    if (map && userLocation) {
      const placesService = new window.google.maps.places.PlacesService(map);
      placesService.nearbySearch(
        {
          location: userLocation,
          radius: 500, // 500 meters radius
          type: 'restaurant',
        },
        (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            clearMarkers();
            for (let i = 0; i < Math.min(results.length, 10); i++) {
              createMarker(results[i]);
            }
          } else {
            console.error('Places service request failed:', status);
          }
        }
      );
    }
  };

  const createMarker = place => {
    const marker = new window.google.maps.Marker({
      map: map,
      position: place.geometry.location,
      title: place.name,
    });
    marker.addListener('click', () => {
      getPlaceDetails(place.place_id);
    });
    setMarkers([...markers, marker]);
  };

  const getPlaceDetails = placeId => {
    const placesService = new window.google.maps.places.PlacesService(map);
    placesService.getDetails(
      { placeId: placeId },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          // Display up to 5 photos of the place, if available
          if (place.photos && place.photos.length > 0) {
            setSelectedPlacePhotos(place.photos.slice(0, 5).map(photo => photo.getUrl()));
          } else {
            setSelectedPlacePhotos([]);
          }
        } else {
          console.error('Place details request failed:', status);
        }
      }
    );
  };

  return (
    <div>
      <input id="searchTextField" type="text" size="50" />
      <div id="map" style={{ height: '500px', width: '100vw', marginBottom: '20px' }}></div>
      <button onClick={searchRestaurants}>Restaurants</button>
      {selectedPlacePhotos.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {selectedPlacePhotos.map((photoUrl, index) => (
            <img key={index} src={photoUrl} alt={`Photo ${index + 1}`} style={{ width: 'calc(20% - 8px)', marginRight: '8px' }} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MapAPI;
