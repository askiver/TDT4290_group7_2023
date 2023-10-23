// This is a placeholder page, used for setting up router
import Map from "../templates/map/Map.jsx"
import Filter from "../components/Filter.jsx";
import { useEffect, useState } from "react";
import "../templates/MapPage.css"

function MapPage() {
  const [filter, setFilter] = useState({});
  const [checked, setChecked] = useState([]);


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

    setChecked(checkedArray);
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