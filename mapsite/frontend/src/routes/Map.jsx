import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function Map() {
    return(
        <>
          <MapContainer center={[63.430479, 10.394970]} zoom={13} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[63.430479, 10.394970]}>
                <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
            </MapContainer>
        </>
    )
}