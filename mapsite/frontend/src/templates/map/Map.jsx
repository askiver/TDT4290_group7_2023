import { useMap, MapContainer, TileLayer, Polygon, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { useNavigate } from "react-router-dom";
import '../../../node_modules/leaflet-geosearch/dist/geosearch.css';

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
    // const map = useMap();

    //fetches the data for loading the map
    useEffect(() => {
        fetch("src/assets/testmapData.json")
            .then((res) => res.json())
            .then((data) => setData(data))
            .finally(setLoading(false))
    }, [])

    //Reads in the filter, and updates the current filter state
    useEffect(() => {
        setFilter(props.filter);
    }, [props.filter]);


    //refactors the map-data based on the current filter state
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

    //Gives color to the polygons on the map
    const colorPicker = (value) => {
        if(value < 20) {
            return { color: "#ADD8E6", fillColor: "#ADD8E6" }
        } else if(value < 40) {
            return { color:"#89CFF0",  fillColor: "#89CFF0" }
        } else if(value < 60) {
            return { color:"#123499",  fillColor: "#123499" }
        } else if(value < 80) {
            return { color:"#0A2472",  fillColor: "#0A2472" }
        } else {
            return { color:"#051650",  fillColor: "#051650" }
        }
    }

    //Updates the selected building when a building is pressed
    const handlePopupOpen = (building) => {
        setSelectedBuilding(building);
      };
    
    //Updates the selected building when a building is pressed
    const handlePopupClose = () => {
    setSelectedBuilding(null);
    };

    return(
        <>
        {loading
        ? <h1>Loading...</h1>
        :
          <MapContainer center={[63.430482, 10.39496]} zoom={13} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            />
            <SearchField/>
            {displayData.map((building) => {
                let pathOptions = eval(`colorPicker(building.${materialFilter})`);
                return (
                <Polygon fillOpacity={1} pathOptions={pathOptions} key={building.osmid} positions={building.geometry} eventHandlers={{click: () => handlePopupOpen(building)}}/>
            )})}
            {selectedBuilding && (
            <LocationMarker
              selectedBuilding={selectedBuilding}
              onPopupClose={handlePopupClose}
              selectedMaterial={materialFilter}
            />
          )}
          {console.log("Selected building: ", selectedBuilding)}
            </MapContainer>}
        </>
    )
}


//LocationMarker component which is used to give information about the selected building
function LocationMarker({ selectedBuilding, onPopupClose, selectedMaterial }) {
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
          <br/>
          <h3 className='wastePopUpText_title'>Avfall</h3>
          <hr />
          <p className='wastePopUpText'>Trevirke: {selectedBuilding.wood.toFixed(3)} kg/m2</p>
          <p className='wastePopUpText'>Papir, papp og kartong: {selectedBuilding.paper.toFixed(3)} kg/m2</p>
          <p className='wastePopUpText'>Glass: {selectedBuilding.glass.toFixed(3)} kg/m2</p>
          <p className='wastePopUpText'>Jern og andre metaller: {selectedBuilding.metal.toFixed(3)} kg/m2</p>
          <p className='wastePopUpText'>Gipsbaserte materialer: {selectedBuilding.plaster.toFixed(3)} kg/m2</p>
          <p className='wastePopUpText'>Plast: {selectedBuilding.plastic.toFixed(3)} kg/m2</p>
          <p className='wastePopUpText'>Betong: {selectedBuilding.concrete.toFixed(3)} kg/m2</p>
          <p className='wastePopUpText'>Forurenset Betong: {selectedBuilding.pConcrete.toFixed(3)} kg/m2</p>
          <p className='wastePopUpText'>EE-avfall: {selectedBuilding.eWaste.toFixed(3)} kg/m2</p>
          <p className='wastePopUpText'>Overflatebehandlingsavfall: {selectedBuilding.surfaceTreatmentWaste.toFixed(3)} kg/m2</p>

          <button onClick={() => navigate(`/report/${selectedBuilding.buildingnr}`)}>
            Se avfallsprognose
          </button>
        </div>
      </Popup>
      {/*<Popup>You are here</Popup>*/}
    </Marker>
  );
}

//Search field component
const SearchField = () => {
    const provider = new OpenStreetMapProvider({
        params: {
            countrycodes: 'no',
        }
    });
    const map = useMap();

    //@ts-ignore
    const searchControl = new GeoSearchControl({
        provider: provider,
        searchLabel: "Skriv inn adresse",
        style: 'bar',
        autoComplete: true
    });

    useEffect(() => {
        map.addControl(searchControl);
        return () => map.removeControl(searchControl);
    }, []);

    return null
}
