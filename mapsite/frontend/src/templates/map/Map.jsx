import { MapContainer, TileLayer, Polygon, Marker, Popup, useMapEvents, LayerGroup, SVGOverlay } from 'react-leaflet';
import { useEffect, useState, useRef } from 'react';
import * as GeoSearch from 'leaflet-geosearch'

export default function Map(props) {
    const [data, setData] = useState([{
        osmid: "0",
        buildingnr: "0",
        geometry: [
            [63.4195979, 10.4835996],
            [63.4198463, 10.4835094],
            [63.4198259, 10.4832294],
            [63.419503, 10.4833467],
            [63.419523, 10.4836219],
            [63.4195169, 10.4836241],
            [63.4195212, 10.4836822],
            [63.4196018, 10.4836529],
            [63.4195979, 10.4835996]],
        steel: "40",
        wood: "22",
    }]);
    const [geometry, setGeometry] = useState([[[]]]);
    const [filter, setFilter] = useState({});
    const [loading, setLoading] = useState(true);
    const mapRef = useRef(null);

    const colorPicker = (value) => {
        if(value < 20) {
            return { color: "#F6BDC0" }
        } else if(value < 40) {
            return { color:"#F1959B"}
        } else if(value < 60) {
            return { color:"#F07470"}
        } else if(value < 80) {
            return { color:"#EA4C46"}
        } else {
            return { color:"#DC1C13"}
        }
    }

    useEffect(() => {
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
        //Redo fetch the right way
        fetch("src/assets/polygonData.json")
            .then((res) => res.json())
            .then((data) => setData(data))
            .finally(setLoading(false))
        // setLoading(false)

        let polygons = []
        
        data.map(building => {
            if(true) {
                polygons.push(building.geometry);
            }
        })
        setGeometry(polygons);
    }, [])

    return(
        <>
        {loading
        ? <h1>Loading...</h1>
        :
          <MapContainer ref={mapRef} center={[63.430482, 10.394962]} zoom={13} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            />
            <LayerGroup>
                {/* {data.map((building) => (
                    <Polygon key={building.osmid} pathOptions={"#FFFF"} positions={building.geometry}/>
                ))} */}
                {/* {geometry.map(geo => {
                    <Polygon key={1} pathOptions={"#FFFF"} positions={geo}/>
                })} */}
            </LayerGroup>
            <Polygon key={1} pathOptions={"#FFFFF"} positions={geometry}/>
            {/* <SVGOverlay>
                <polygon points={geometry}></polygon>
            </SVGOverlay> */}
            </MapContainer>}
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