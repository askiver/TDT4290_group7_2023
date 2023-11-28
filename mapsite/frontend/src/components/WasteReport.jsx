import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import { post } from "./AxiosModule";
import PropTypes from "prop-types";
import "./css/WasteReport.css";
import Button from "@mui/material/Button";

// This component displays the given data in the format of a waste report.
const WasteReport = (props) => {
  const buildingnr = props.selectedBuilding;
  const [loading, setLoading] = useState(true);
  const [buildingData, setBuildingData] = useState(null);
  const [ordinaryWasteSums, setOrdinaryWasteSums] = useState({
    totalAmountTotal: 0,
    totalWaste: 0,
    totalRecycled: 0,
  });

  const [dangerousWasteSums, setDangerousWasteSums] = useState({
    totalAmountTotal: 0,
    totalWaste: 0,
    totalRecycled: 0,
  });

  // This function calculates and sets the sum values for either ordinary or dangerous waste.
  const calculateSumWasteValues = (category) => {
    let totalAmountTotal = 0;
    let totalWaste = 0;
    let totalRecycled = 0;

    console.log("Calculating for this category: ", buildingData[category]);

    for (const field of Object.values(buildingData[category])) {
      console.log("Category calculating: ", field);
      // Access the 'waste' and 'recycled' properties within the 'field' object
      const waste = field.waste || { amount: 0 }; // Default to 0 if 'waste' is undefined
      const recycled = field.recycled || { amount: 0 }; // Default to 0 if 'recycled' is undefined

      totalAmountTotal += field.amountTotal || 0;
      totalWaste += waste.amount || 0;
      totalRecycled += recycled.amount || 0;
      console.log(totalAmountTotal, totalWaste, totalRecycled);
    }

    totalAmountTotal = Math.floor(totalAmountTotal * 100) / 100;
    totalWaste = Math.floor(totalWaste * 100) / 100;
    totalRecycled = Math.floor(totalRecycled * 100) / 100;

    if (category === "ordinaryWaste") {
      setOrdinaryWasteSums({
        totalAmountTotal,
        totalWaste,
        totalRecycled,
      });
    } else if (category === "dangerousWaste") {
      setDangerousWasteSums({
        totalAmountTotal,
        totalWaste,
        totalRecycled,
      });
    }

    console.log("Updated sums: ", ordinaryWasteSums, dangerousWasteSums);
  };

  // Sends a post request to the server, requesting the waste report to be saved.
  const handleSave = async () => {
    await post("/saveData", buildingData);
  };

  // Sends a post request to the server, requresting the waste report to be submitted.
  const handleSubmit = async () => {
    await post("submit_waste_report/", buildingData);
  };

  useEffect(() => {
    fetch("../../src/assets/testmapData.json")
      .then((response) => response.json())
      .then(async (data) => {
        // Find the building with the matching 'buildingnr'
        const selectedBuildingData = data.find(
          (building) => building.buildingnr === buildingnr
        );
        console.log("Data: ", selectedBuildingData);

        if (selectedBuildingData) {
          console.log("Inside loop");
          // Extract 'area' and 'stories' values
          const area = selectedBuildingData.area;
          const stories = selectedBuildingData.stories;
          const buildingCode = selectedBuildingData.buildingcode;

          // Extract 'building-year' based on the 'date' field, if nothing: set 0
          const date = selectedBuildingData.date;
          const buildingYear = date ? parseInt(date.split("-")[0]) : 0;

          const buildingResponse = await post("generate_waste_report/", {
            bnr: buildingCode,
            area: area,
            stories: stories,
            building_year: buildingYear,
          });

          setBuildingData(buildingResponse.data);
          console.log("Avfallsprognose: ", buildingResponse.data);
        }
      });
  }, [buildingnr]);

  useEffect(() => {
    if (buildingData !== null) {
      if (loading) {
        calculateSumWasteValues("ordinaryWaste");
        calculateSumWasteValues("dangerousWaste");
      }
      setLoading(false);
      console.log("Stored avfallsprognose: ", buildingData);
      console.log("BuildingData Property: ", buildingData.property);
      console.log("Ordinary waste: ", buildingData.ordinaryWaste);
    }
  }, [buildingData]);

  if (loading) {
    // Render a loading indicator or message while data is being fetched.
    return <div>Loading...</div>;
  }

  const handlePropertyChange = (category, name, newValue) => {
    console.log("Storing ", newValue, "in ", name, "as part of ", category);
    setBuildingData((prevData) => ({
      ...prevData,
      [category]: {
        ...prevData[category],
        [name]: newValue,
      },
    }));

    console.log("Updated building data: ", buildingData);
  };

  const handleWasteChange = (wasteType, materialType, field, newValue) => {
    if (/^\d*\.?\d*$/.test(newValue)) {
      setBuildingData((prevData) => {
        const newData = { ...prevData };

        // Update the specific field with the new value
        newData[wasteType][materialType][field]["amount"] =
          parseFloat(newValue);

        console.log("The category: ", wasteType);
        calculateSumWasteValues(wasteType);

        return newData;
      });
    }
  };

  const handleLocationChange = (wasteType, materialType, field, newValue) => {
    setBuildingData((prevData) => {
      const newData = { ...prevData };

      // Update the specific field with the new value
      newData[wasteType][materialType][field]["location"] = newValue;

      console.log("The category: ", wasteType);
      calculateSumWasteValues(wasteType);

      return newData;
    });
  };

  const handleTotalWasteChange = (wasteType, materialType, newValue) => {
    setBuildingData((prevData) => {
      const newData = { ...prevData };

      // Update the specific field with the new value
      newData[wasteType][materialType]["amountTotal"] = parseFloat(newValue);

      console.log("The category: ", wasteType);
      calculateSumWasteValues(wasteType);

      return newData;
    });
  };

  return (
    <div>
      <Button
        className="submit-button-style"
        variant="contained"
        //style={submitButtonStyle}
        onClick={() => handleSubmit()}
      >
        Send inn avfallsrapport
      </Button>
      <Button
        className="save-button-style"
        variant="contained"
        //style={saveButtonStyle}
        onClick={() => handleSave()}
      >
        Lagre avfallsprognose
      </Button>

      {/* INFORMATION TABLE */}
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={8} className="table-title">
                Rapporten gjelder
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableCell className="sub-header-cell-style" rowSpan={2}>
              Eiendom/byggested
            </TableCell>
            <TableCell style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{ display: "flex", flexWrap: "wrap", minWidth: "200px" }}
              >
                {Object.entries(buildingData.property).map(
                  ([name, value], index) => (
                    <div key={index} style={{ margin: "5px" }}>
                      <TextField
                        label={name}
                        id={`standard-size-small-${index}`}
                        defaultValue={value !== 0 ? value : null}
                        size="small"
                        variant="standard"
                        onChange={(e) =>
                          handlePropertyChange("property", name, e.target.value)
                        }
                      />
                    </div>
                  )
                )}
              </div>
            </TableCell>
          </TableBody>
        </Table>
      </TableContainer>

      {/* WASTE REPORT */}
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="table-title" colSpan={7}>
                Detaljert sluttrapport med avfallsplan
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="header-cell-style"></TableCell>
              <TableCell className="header-cell-style">PLAN</TableCell>
              <TableCell className="header-cell-style" colSpan={5}>
                SLUTTRAPPORT
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="header-cell-style"></TableCell>
              <TableCell className="header-cell-style">
                Beregnet mengde (tonn)
              </TableCell>
              <TableCell className="header-cell-style" colSpan={4}>
                Disponeringsmåte (Angi mengde og leveringssted)
              </TableCell>
              <TableCell className="header-cell-style">
                Faktisk mengde (tonn) (2) + (4)
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="center-cell-style"></TableCell>
              <TableCell className="center-cell-style">
                Fraksjoner som skal kildesorteres
              </TableCell>
              <TableCell className="center-cell-style">
                Mengde levert til godkjent avfallsanlegg
              </TableCell>
              <TableCell className="center-cell-style">Leveringssted</TableCell>
              <TableCell className="center-cell-style">
                Mengde levert direkte til ombruk/gjenvinning
              </TableCell>
              <TableCell className="center-cell-style">Leveringssted</TableCell>
              <TableCell className="center-cell-style">
                Fraksjoner som er kildesortert
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="sub-header-cell-style"></TableCell>
              {Array.from({ length: 6 }, (_, index) => (
                <TableCell key={index} className="center-cell-style">
                  ({index + 1})
                </TableCell>
              ))}
            </TableRow>

            {/*ORDINARY WASTE */}
            <TableRow>
              <TableCell className="center-cell-style">
                <span className="bold-text">Ordinært avfall</span>
                <br />
                (listen er ikke uttømmende)
              </TableCell>
              {Array.from({ length: 6 }, (_, index) => (
                <TableCell key={index} className="center-cell-style" />
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(buildingData.ordinaryWaste).map(
              ([name, values], index) => (
                <TableRow key={index}>
                  <TableCell className="center-cell-style">{name}</TableCell>
                  <TableCell className="cell-style">
                    <TextField
                      defaultValue={values.amountTotal.toFixed(2)}
                      size="small"
                      variant="standard"
                      onChange={(e) =>
                        handleTotalWasteChange(
                          "ordinaryWaste",
                          name,
                          e.target.value
                        )
                      }
                    />
                  </TableCell>
                  {Object.entries(values).map(([subname, subvalues], index) => (
                    <React.Fragment key={index}>
                      {subname != "amountTotal" && (
                        <>
                          <TableCell className="cell-style">
                            <TextField
                              defaultValue={subvalues.amount.toFixed(2)}
                              size="small"
                              variant="standard"
                              onChange={(e) =>
                                handleWasteChange(
                                  "ordinaryWaste",
                                  name,
                                  subname,
                                  e.target.value
                                )
                              }
                            />
                          </TableCell>
                          <TableCell className="cell-style">
                            {values.location}
                            <TextField
                              defaultValue={subvalues.location}
                              size="small"
                              variant="standard"
                              onChange={(e) =>
                                handleLocationChange(
                                  "ordinaryWaste",
                                  name,
                                  subname,
                                  e.target.value
                                )
                              }
                            />
                          </TableCell>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                  <TableCell className="center-cell-style">
                    {
                      (parseFloat(values.waste.amount) +
                        parseFloat(values.recycled.amount)).toFixed(2)
                    }
                  </TableCell>
                </TableRow>
              )
            )}
            <TableRow>
              <TableCell className="sub-header-cell-style">
                Sum sortert ordinært avfall
              </TableCell>
              {[
                ordinaryWasteSums.totalAmountTotal,
                ordinaryWasteSums.totalWaste,
                "",
                ordinaryWasteSums.totalRecycled,
                "",
              ].map((value, index) => (
                <TableCell className="center-cell-style" key={index}>
                  {value}
                </TableCell>
              ))}
              <TableCell className="center-cell-style">
                {
                  (parseFloat(ordinaryWasteSums.totalWaste) +
                    parseFloat(ordinaryWasteSums.totalRecycled)).toFixed(2)}
              </TableCell>
            </TableRow>

            {/*DANGEROUS WASTE */}
            <TableRow>
              <TableCell className="center-cell-style">
                <span className="bold-text">Farlig avfall</span>
                <br />
                (listen er ikke uttømmende)
              </TableCell>
              {Array.from({ length: 6 }, (_, index) => (
                <TableCell key={index} className="center-cell-style" />
              ))}
            </TableRow>
            {Object.entries(buildingData.dangerousWaste).map(
              ([name, values], index) => (
                <TableRow key={index}>
                  <TableCell className="center-cell-style">{name}</TableCell>
                  <TableCell className="cell-style">
                    <TextField
                      defaultValue={values.amountTotal.toFixed(2)}
                      size="small"
                      variant="standard"
                      onChange={(e) =>
                        handleTotalWasteChange(
                          "dangerousWaste",
                          name,
                          e.target.value
                        )
                      }
                    />
                  </TableCell>
                  {Object.entries(values).map(([subname, subvalues], index) => (
                    <React.Fragment key={index}>
                      {subname != "amountTotal" && (
                        <>
                          <TableCell className="cell-style">
                            <TextField
                              defaultValue={subvalues.amount.toFixed(2)}
                              size="small"
                              variant="standard"
                              onChange={(e) =>
                                handleWasteChange(
                                  "dangerousWaste",
                                  name,
                                  subname,
                                  e.target.value
                                )
                              }
                            />
                          </TableCell>
                          <TableCell className="cell-style">
                            {values.location}
                            <TextField
                              defaultValue={subvalues.location}
                              size="small"
                              variant="standard"
                              onChange={(e) =>
                                handleLocationChange(
                                  "dangerousWaste",
                                  name,
                                  subname,
                                  e.target.value
                                )
                              }
                            />
                          </TableCell>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                  <TableCell className="center-cell-style">
                    {
                      (parseFloat(values.waste.amount) +
                        parseFloat(values.recycled.amount)).toFixed(2)}
                  </TableCell>
                </TableRow>
              )
            )}

            <TableRow>
              <TableCell className="sub-header-cell-style">
                Sum sortert farlig avfall
              </TableCell>
              {[
                dangerousWasteSums.totalAmountTotal,
                dangerousWasteSums.totalWaste,
                "",
                dangerousWasteSums.totalRecycled,
                "",
              ].map((value, index) => (
                <TableCell className="center-cell-style" key={index}>
                  {value}
                </TableCell>
              ))}
              <TableCell className="center-cell-style">
                {(parseFloat(dangerousWasteSums.totalWaste) +
                  parseFloat(dangerousWasteSums.totalRecycled)).toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="sub-header-cell-style">
                Sum avfall i alt
              </TableCell>
              {["totalAmountTotal", "totalWaste", "", "totalRecycled", ""].map(
                (value, index) => (
                  <TableCell key={index} className="cell-style">
                    {value === ""
                      ? ""
                      : (parseFloat(ordinaryWasteSums[value]) +
                        parseFloat(dangerousWasteSums[value])).toFixed(2)}
                  </TableCell>
                )
              )}
              <TableCell className="center-cell-style">
                {(parseFloat(ordinaryWasteSums.totalWaste) +
                  parseFloat(ordinaryWasteSums.totalRecycled) +
                  parseFloat(dangerousWasteSums.totalWaste) +
                  parseFloat(dangerousWasteSums.totalRecycled)).toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="sub-header-cell-style">
                Sorteringsgrad
              </TableCell>
              {Array.from({ length: 6 }, (_, index) => (
                <TableCell key={index} className="cell-style" />
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="sub-header-cell-style">
                Avfall/areal (kg/m2)
              </TableCell>
              {Array.from({ length: 6 }, (_, index) => (
                <TableCell key={index} className="cell-style" />
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/*DECLARATION AND SIGNATURE */}
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="table-title">
                Erklæring og underskrift
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="sub-header-cell-style">
                Ansvarlig søker for tiltaket
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <div
              style={{ display: "flex", flexWrap: "wrap", minWidth: "200px" }}
            >
              {Object.entries(buildingData.declarationAndSignature).map(
                ([name, value], index) => (
                  <div key={index} style={{ margin: "5px" }}>
                    <TextField
                      label={name}
                      id={`declaration-and-signature-${index}`}
                      defaultValue={value !== 0 ? value : null}
                      size="small"
                      variant="standard"
                      onChange={(e) =>
                        handlePropertyChange(
                          "declarationAndSignature",
                          name,
                          e.target.value
                        )
                      }
                    />
                  </div>
                )
              )}
            </div>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

WasteReport.propTypes = {
  selectedBuilding: PropTypes.string.isRequired,
};


export default WasteReport;
