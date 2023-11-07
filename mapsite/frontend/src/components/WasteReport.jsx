import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import { post } from "./AxiosModule";

const WasteReport = (selectedBuilding) => {
  const buildingnr = selectedBuilding.selectedBuilding;
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

  const calculateSumWasteValues = (category) => {
    let totalAmountTotal = 0;
    let totalWaste = 0;
    let totalRecycled = 0;

    console.log("Calculating for this category: ", buildingData[category]);

    for (const field of Object.values(buildingData[category])) {
      console.log("Category calculating: ", field);
      totalAmountTotal += field.amountTotal || 0;
      totalWaste += field.waste || 0;
      totalRecycled += field.recycled || 0;
      console.log(totalAmountTotal, totalWaste, totalRecycled);
    }

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
          console.log("Property: ", buildingResponse.data.property);
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

  const handleWasteChange = (category, subCategory, index, newValue) => {
    const wasteCategories = [
      "amountTotal",
      "waste",
      "locationWaste",
      "recycled",
      "locationRecycle",
    ];

    if (/^\d*\.?\d*$/.test(newValue)) {
      setBuildingData((prevData) => {
        // Make a copy of the previous state
        const newData = { ...prevData };

        // Check if the category and subCategory exist, if not, create them
        if (!newData[category]) {
          newData[category] = {};
        }
        if (!newData[category][subCategory]) {
          newData[category][subCategory] = {};
        }

        // Update the specific field with the new value
        newData[category][subCategory][wasteCategories[index]] = parseFloat(newValue);

        console.log("The category: ", category);
        calculateSumWasteValues(category);

        return newData;
      });
    }

    console.log("Updated waste: ", buildingData);
  };

  return (
    <div>
      <TableContainer component={Paper} style={tableStyle}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={8} style={tabletitle}>
                Rapporten gjelder
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableCell style={subHeaderCellStyle} rowSpan={2}>
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
      <TableContainer component={Paper} style={tableStyle}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={tabletitle} colSpan={7}>
                Detaljert sluttrapport med avfallsplan
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={headerCellStyle}></TableCell>
              <TableCell style={headerCellStyle}>PLAN</TableCell>
              <TableCell style={headerCellStyle} colSpan={5}>
                SLUTTRAPPORT
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={headerCellStyle}></TableCell>
              <TableCell style={headerCellStyle}>
                Beregnet mengde (tonn)
              </TableCell>
              <TableCell style={headerCellStyle} colSpan={4}>
                Disponeringsmåte (Angi mengde og leveringssted)
              </TableCell>
              <TableCell style={headerCellStyle}>
                Faktisk mengde (tonn) (2) + (4)
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={centerCellStyle}></TableCell>
              <TableCell style={centerCellStyle}>
                Fraksjoner som skal kildesorteres
              </TableCell>
              <TableCell style={centerCellStyle}>
                Mengde levert til godkjent avfallsanlegg
              </TableCell>
              <TableCell style={centerCellStyle}>Leveringssted</TableCell>
              <TableCell style={centerCellStyle}>
                Mengde levert direkte til ombruk/gjenvinning
              </TableCell>
              <TableCell style={centerCellStyle}>Leveringssted</TableCell>
              <TableCell style={centerCellStyle}>
                Fraksjoner som er kildesortert
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={subHeaderCellStyle}></TableCell>
              {Array.from({ length: 6 }, (_, index) => (
                <TableCell key={index} style={centerCellStyle}>
                  ({index + 1})
                </TableCell>
              ))}
            </TableRow>

            {/*ORDINARY WASTE */}
            <TableRow>
              <TableCell style={centerCellStyle}>
                <span style={boldText}>Ordinært avfall</span>
                <br />
                (listen er ikke uttømmende)
              </TableCell>
              {Array.from({ length: 6 }, (_, index) => (
                <TableCell key={index} style={centerCellStyle} />
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/*TODO: If we add locations to the information, this needs to be considered. */}
            {Object.entries(buildingData.ordinaryWaste).map(
              ([name, values], index) => (
                <TableRow key={index}>
                  <TableCell style={centerCellStyle}>{name}</TableCell>
                  {[
                    values.amountTotal,
                    values.waste,
                    "",
                    values.recycled,
                    "",
                  ].map((value, index) => (
                    <TableCell style={cellStyle} key={index}>
                      <TextField
                        defaultValue={value}
                        size="small"
                        variant="standard"
                        onChange={(e) =>
                          handleWasteChange(
                            "ordinaryWaste",
                            name,
                            index,
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                  ))}
                  <TableCell style={centerCellStyle}>
                    {parseFloat(values.waste) + parseFloat(values.recycled)}
                  </TableCell>
                </TableRow>
              )
            )}
            <TableRow>
              <TableCell style={subHeaderCellStyle}>
                Sum sortert ordinært avfall
              </TableCell>
              {[
                ordinaryWasteSums.totalAmountTotal,
                ordinaryWasteSums.totalWaste,
                "",
                ordinaryWasteSums.totalRecycled,
                "",
              ].map((value, index) => (
                <TableCell style={centerCellStyle} key={index}>
                  {value}
                </TableCell>
              ))}
              <TableCell style={centerCellStyle}>
                {parseFloat(ordinaryWasteSums.totalWaste) +
                  parseFloat(ordinaryWasteSums.totalRecycled)}
              </TableCell>
            </TableRow>


            {/*DANGEROUS WASTE */}
            <TableRow>
              <TableCell style={centerCellStyle}>
                <span style={boldText}>Farlig avfall</span>
                <br />
                (listen er ikke uttømmende)
              </TableCell>
              {Array.from({ length: 6 }, (_, index) => (
                <TableCell key={index} style={centerCellStyle} />
              ))}
            </TableRow>
            {Object.entries(buildingData.dangerousWaste).map(
              ([name, values], index) => (
                <TableRow key={index}>
                  <TableCell style={centerCellStyle}>{name}</TableCell>
                  {[
                    values.amountTotal,
                    values.waste,
                    "",
                    values.recycled,
                    "",
                  ].map((value, index) => (
                    <TableCell style={cellStyle} key={index}>
                      <TextField
                        defaultValue={value}
                        size="small"
                        variant="standard"
                        onChange={(e) =>
                          handleWasteChange(
                            "dangerousWaste",
                            name,
                            index,
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                  ))}
                  <TableCell style={centerCellStyle}>
                    {parseFloat(values.waste) + parseFloat(values.recycled)}
                  </TableCell>
                </TableRow>
              )
            )}

            <TableRow>
              <TableCell style={subHeaderCellStyle}>
                Sum sortert farlig avfall
              </TableCell>
              {[
                dangerousWasteSums.totalAmountTotal,
                dangerousWasteSums.totalWaste,
                "",
                dangerousWasteSums.totalRecycled,
                "",
              ].map((value, index) => (
                <TableCell style={centerCellStyle} key={index}>
                  {value}
                </TableCell>
              ))}
              <TableCell style={centerCellStyle}>
                {parseFloat(dangerousWasteSums.totalWaste) +
                  parseFloat(dangerousWasteSums.totalRecycled)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={subHeaderCellStyle}>Sum avfall i alt</TableCell>
              {["totalAmountTotal", "totalWaste", "", "totalRecycled", ""].map(
                (value, index) => (
                  <TableCell key={index} style={cellStyle}>
                    {value === ""
                      ? ""
                      : parseFloat(ordinaryWasteSums[value]) +
                        parseFloat(dangerousWasteSums[value])}
                  </TableCell>
                )
              )}
              <TableCell style={centerCellStyle}>
                {parseFloat(ordinaryWasteSums.totalWaste) +
                  parseFloat(ordinaryWasteSums.totalRecycled) +
                  parseFloat(dangerousWasteSums.totalWaste) +
                  parseFloat(dangerousWasteSums.totalRecycled)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={subHeaderCellStyle}>Sorteringsgrad</TableCell>
              {Array.from({ length: 6 }, (_, index) => (
                <TableCell key={index} style={cellStyle} />
              ))}
            </TableRow>
            <TableRow>
              <TableCell style={subHeaderCellStyle}>
                Avfall/areal (kg/m2)
              </TableCell>
              {Array.from({ length: 6 }, (_, index) => (
                <TableCell key={index} style={cellStyle} />
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>


      {/*DECLARATION AND SIGNATURE */}
      <TableContainer component={Paper} style={tableStyle}>
        <Table>
            <TableHead>
              <TableRow>
                <TableCell style={tabletitle}>Erklæring og underskrift</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={subHeaderCellStyle}>Ansvarlig søker for tiltaket</TableCell>
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
                          handlePropertyChange("declarationAndSignature", name, e.target.value)
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

export default WasteReport;

const tableStyle = {
  maxWidth: "90%",
  margin: "50px",
};

const cellStyle = {
  border: "1px solid #ddd",
};

const boldText = {
  fontWeight: "bold",
};

const tabletitle = {
  backgroundColor: "#d0d0d0",
  fontWeight: "bold",
  border: "1px solid #ddd",
};

const headerCellStyle = {
  backgroundColor: "#f0f0f0",
  fontWeight: "bold",
  border: "1px solid #ddd",
  textAlign: "center",
};

const subHeaderCellStyle = {
  backgroundColor: "#f5f5f5",
};

const centerCellStyle = {
  backgroundColor: "#f5f5f5",
  textAlign: "center",
  border: "1px solid #ddd",
};
