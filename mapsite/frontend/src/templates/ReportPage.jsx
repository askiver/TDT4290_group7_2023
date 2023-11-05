import { useLocation } from "react-router-dom";
import WasteReport from "../components/WasteReport";
import { Button } from "@mui/material";

export default function ReportPage() {
  const location = useLocation();
  const selectedBuilding = location.pathname.split("/report/")[1];
  console.log("Selected building in Report Page (from params)", selectedBuilding)

  return(
    <div>
      <Button variant="contained" style={saveButtonStyle}>Save draft</Button>
      <Button variant="contained" style={submitButtonStyle}>Submit waste report</Button>
      <WasteReport selectedBuilding={selectedBuilding}/>
    </div>
    )
}

const saveButtonStyle = {
  position: "absolute",
  top: "100px",  // Adjust the top position as needed
  right: "225px", // Adjust the right position as needed
};

const submitButtonStyle = {
  position: "absolute",
  top: "100px",  // Adjust the top position as needed
  right: "10px", // Adjust the right position as needed
};