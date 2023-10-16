// This is a placeholder page, used for setting up router
import Map from "../templates/map/Map.jsx"
import Filter from "../components/Filter.jsx";
import "../templates/MapPage.css"

function MapPage() {
    return(
      <div className="mapPage">
        <Filter/>
        <Map/>
      </div>
    )
  }
  
  export default MapPage;