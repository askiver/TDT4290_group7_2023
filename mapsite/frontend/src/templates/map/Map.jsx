import { MapContainer, TileLayer, Polygon, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useEffect, useRef, useState } from 'react';
import * as GeoSearch from "leaflet-geosearch";
import { useNavigate } from "react-router-dom";

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
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({});
    const [displayData, setDisplayData] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [materialFilter, setMaterialFilter] = useState('wood');
    const mapRef = useRef()

    useEffect(() => {
        const map = mapRef.current;
        //Redo fetch the right way
        fetch("src/assets/mapData1.json")
            .then((res) => res.json())
            .then((data) => setData(data))
            .finally(setLoading(false))


        if (map) {
            // Create and add the GeoSearch control
            const searchControl = new GeoSearch.GeoSearchControl({
                provider: new GeoSearch.OpenStreetMapProvider(),
                style: "bar", // Customize the style here (bar or button)
                searchLabel: "Skriv inn adresse",
            });
            map.addControl(searchControl);
            }
    }, [])

    useEffect(() => {
        setFilter(props.filter);
    }, [props.filter]);

    useEffect(() => {
        let newDisplayData = [];
        let noFilter = true;
        let filterArray = [];

        if(filter) {
            filterArray = Object.values(filter);
            for (let i = 0; i < filterArray.length; i++) {
                if (filterArray[i] === "") {
                    filterArray.splice(i, 1);
                    i--;
                }
            }
        }

        if(filterArray.length != 0) {
            setMaterialFilter(filterArray[filterArray.length-1]);
            filterArray.splice(-1)
            if(filterArray.length != 0) {
                noFilter = false;
            }
        }

        if(!noFilter && filterArray != []) {
            data.forEach((building) => {
                //Checks if the current building has the correct building code for the filter applied
                if(building.buildingcode != 0 && building.buildingcode) {

                    if((filterArray.includes(building.buildingcode[0]))) {
                        newDisplayData.push(building);
                    }
                }

            });
        } else {
            newDisplayData = data;
        }
        setDisplayData(newDisplayData);
    }, [filter, data]);

    const colorPicker = (value) => {
        if(value < 20) {
            return { color: "#ADD8E6" }
        } else if(value < 40) {
            return { color:"#89CFF0"}
        } else if(value < 60) {
            return { color:"#123499"}
        } else if(value < 80) {
            return { color:"#0A2472"}
        } else {
            return { color:"#051650"}
        }
    }

    const handlePopupOpen = (building) => {
        setSelectedBuilding(building);
      };
    
    const handlePopupClose = () => {
    setSelectedBuilding(null);
    };


    return(
        <>
        {loading
        ? <h1>Loading...</h1>
        :
          <MapContainer ref={mapRef} center={[63.430482, 10.39496]} zoom={13} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            />
            {displayData.map((building) => {
                return (
                <Polygon key={building.osmid} pathOptions={eval(`colorPicker(building.${materialFilter})`)} positions={building.geometry} eventHandlers={{click: () => handlePopupOpen(building)}}/>
            )})}
            {selectedBuilding && (
            <LocationMarker
              selectedBuilding={selectedBuilding}
              onPopupClose={handlePopupClose}
            />
          )}
            </MapContainer>}
        </>
    )
}

function LocationMarker({ selectedBuilding, onPopupClose }) {
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
        click(e) {
        // Get the clicked position from the event object
        const clickedPosition = e.latlng;
        // Set the position state with the clicked coordinates
        setPosition(clickedPosition);
        // Move the map and zoom
        map.flyTo(clickedPosition, 17);
        },
    });

    console.log("So far: ");

    const navigate = useNavigate();

    return position === null ? null : (
        <Marker position={position}>
        <Popup onClose={onPopupClose}>
            {/* Display building information in the popup */}
            <div>
            <h3>Bygningsinformasjon</h3>
            <p>OSM ID: {selectedBuilding.osmid}</p>
            <p>Bygningsnummer: {selectedBuilding.buildingnr}</p>
            <div>
            <a href="/report" style={{ textDecoration: 'underline', color: 'blue' }}>
                Generer avfallsprognose
            </a>
            </div>
            </div>
        </Popup>
        {/*<Popup>You are here</Popup>*/}
        </Marker>
    );
}

