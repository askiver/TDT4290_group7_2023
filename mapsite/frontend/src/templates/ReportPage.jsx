import { useLocation } from "react-router-dom";
import WasteReport from "../components/WasteReport";

export default function ReportPage() {
  const location = useLocation();
  const selectedBuilding = location.pathname.split("/report/")[1];
  console.log("Selected building in Report Page (from params)", selectedBuilding)
  return(
    <div>
      <WasteReport selectedBuilding={selectedBuilding}/>
    </div>
    )
}