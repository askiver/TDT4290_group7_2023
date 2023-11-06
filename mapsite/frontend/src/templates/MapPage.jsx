// This is a placeholder page, used for setting up router
import Map from "../templates/map/Map.jsx"
import Filter from "../components/Filter.jsx";
import { useEffect, useState } from "react";
import "../templates/MapPage.css"

function MapPage() {
  const [filter, setFilter] = useState({});
  const [checked, setChecked] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false
  ]);

  useEffect(() => {
    const values = Object.values(filter);
    let checkedArray = [];

    values.forEach((value) => {
      if(value === "") {
        checkedArray.push(false)
      } else {
        checkedArray.push(true);
      }
    });

    if(values.length != 0) {
      setChecked(checkedArray);
    }
  }, [filter])

  return(
    <div className="mapPage">
      <Filter 
        extractFilter={setFilter}
        checked={checked}/>
      <Map filter={filter}/>
    </div>
  )
}
  
  export default MapPage;