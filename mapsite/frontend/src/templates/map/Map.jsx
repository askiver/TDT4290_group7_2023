import { MapContainer, TileLayer, Polygon, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';


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

    useEffect(() => {
        //Redo fetch the right way
        fetch("src/assets/polygonData.json")
            .then((res) => res.json())
            .then((data) => setData(data))
            .finally(setLoading(false))

        console.log(data)
    }, [])


    useEffect(() => {
        setFilter(props.filter);
    }, [props.filter]);

    useEffect(() => {
        let newDisplayData = [];
        let noFilter = true;

        const filterArray = Object.values(filter);

        for (let i = 0; i < filterArray.length; i++) {
            if (filterArray[i] === "") {
                filterArray.splice(i, 1);
                i--;
            } else {
                if(noFilter) {
                    noFilter = false;
                }
            }
        }

        if(!noFilter) {
            data.forEach((building) => {
                //Checks if the current building has the correct building code for the filter applied
                if((filterArray.includes(building.osmid[0]))) {
                    newDisplayData.push(building);
                }
            });
        } else {
            newDisplayData = data;
        }
        setDisplayData(newDisplayData);

    }, [filter, data]);

    
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
    //Redo fetch the right way
    fetch("src/assets/polygonData.json")
      .then((res) => res.json())
      .then((data) => setData(data))
      .finally(setLoading(false));
    // setLoading(false)

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
            {displayData.map((building) => {
 
                console.log(building.osmid)

                return (
                <Polygon key={building.osmid} pathOptions={colorPicker(building.steel)} positions={building.geometry}/>
            )})}

            </MapContainer>}
        </>
    )
  },

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
});
}
