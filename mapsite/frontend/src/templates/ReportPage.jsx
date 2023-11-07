import { useLocation } from "react-router-dom";
import WasteReport from "../components/WasteReport";
import { Button } from "@mui/material";
import { post } from "../components/AxiosModule";

export default function ReportPage() {
  const location = useLocation();
  const selectedBuilding = location.pathname.split("/report/")[1];
  console.log("Selected building in Report Page (from params)", selectedBuilding)

  const handleSave = async (buildingData) => {
    // TODO: Implement saving logic AND handle response
    await post("/saveData?", buildingData);
  }

  const handleSubmit = async (buildingData) => {
    // TODO: Implement submit logic AND handle response
    await post("/submitData", buildingData)
  }

  return(
    <div>
      <Button variant="contained" style={saveButtonStyle} onSave={handleSave}>Save draft</Button>
      <Button variant="contained" style={submitButtonStyle} onSubmit={handleSubmit}>Submit waste report</Button>
      <WasteReport selectedBuilding={selectedBuilding} saveData={handleSave}/>
    </div>
    )
}

const saveButtonStyle = {
  position: "absolute",
  top: "100px", // Adjust the top position as needed
  right: "225px", // Adjust the right position as needed
};

const submitButtonStyle = {
  position: "absolute",
  top: "100px",  // Adjust the top position as needed
  right: "10px", // Adjust the right position as needed
};