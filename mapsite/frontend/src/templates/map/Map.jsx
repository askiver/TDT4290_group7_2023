import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useState } from 'react';

export default function Map() {
    return(
        <>
         <MapContainer center={[63.430479, 10.394970]} zoom={13} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            />
            <LocationMarker />
            </MapContainer>
        </>
    )
}

function LocationMarker() {
    const [position, setPosition] = useState(null)
    const map = useMapEvents({
        click(e) {
            // Get the clicked position from the event object
            const clickedPosition = e.latlng;
            // Set the position state with the clicked coordinates
            setPosition(clickedPosition);
            // Move the map and zoom
            map.flyTo(clickedPosition, 17)
        },
    })
  
    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    )
}