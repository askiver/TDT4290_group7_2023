import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer} from 'react-leaflet';
import * as GeoSearch from 'leaflet-geosearch';

export default function Map() {

// Create a ref for the map container
const mapRef = useRef(null);

useEffect(() => {
  // Initialize the map
  const map = mapRef.current;

  if (map) {
    // Create and add the GeoSearch control
    const searchControl = new GeoSearch.GeoSearchControl({
      provider: new GeoSearch.OpenStreetMapProvider(),
      style: 'bar', // Customize the style here (bar or button)
      searchLabel: 'Skriv inn adresse',
    });
    map.addControl(searchControl);
  }
});

return (
  <>
    <MapContainer ref={mapRef} center={[63.430479, 10.394970]} zoom={13} scrollWheelZoom={true}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
    </MapContainer>
  </>
);
}
