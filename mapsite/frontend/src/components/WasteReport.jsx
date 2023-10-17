import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";

const tableStyle = {
  maxWidth: "80%",
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

// Rows that represent the rows of the ordinary waste from the waste report
const ordinaryRows = [
  "Trevirke (ikke kreosot- og CCA-impregnert)",
  "Papir, papp og kartong",
  "Glass",
  "Jern og andre metaller",
  "Gipsbaserte materialer",
  "Plast",
  "Betong, tegl, lett klinker og lignende",
  "Forurenset betong og tegn (under grensen for farlig avfall)",
  "EE-avfall (elektriske og elektroniske produkter)",
  "Annet (fyll inn under)",
];

// Rows that represent the rows of the dangerous waste from the waste report
const dangerousRows = [
  '7051-55 Maling, lim, lakk, fugemasser, spraybokser, m.m (også "tomme" fugemasse-patroner)',
  "Annet (fyll inn under)",
];

const reportInfo = [
  "Gnr.",
  "Bnr.",
  "Festenr.",
  "Seksjonsnr.",
  "Bygningsnr.",
  "Bolignr.",
  "Kommune",
];

const addressInfo = ["Adresse", "Postnr.", "Poststed"];

const WasteReport = () => {
  const initialData = Array.from({ length: 10 }, () => Array(7).fill(""));
  const initialDangerousData = Array.from({ length: 5 }, () =>
    Array(7).fill("")
  );

  const [reportData, setReportData] = useState(initialData);
  const [dangerousData, setDangerousData] = useState(initialDangerousData);

  const handleCellChange = (event, rowIndex, columnIndex) => {
    const newValue = event.target.value;
    const updatedData = [...reportData];

    updatedData[rowIndex][columnIndex] = newValue;

    setReportData(updatedData);
  };

  const handleDangerousCellChange = (event, rowIndex, columnIndex) => {
    const newValue = event.target.value;
    const updatedData = [...dangerousData];

    updatedData[rowIndex][columnIndex] = newValue;

    setDangerousData(updatedData);
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
            {/*TODO: Handle changes to address. How and where do we store this information?*/}
            <TableCell style={subHeaderCellStyle} rowSpan={2}>Eiendom/byggested</TableCell>
            <TableCell style={{ display: "flex", alignItems: "center" }}>
              {reportInfo.map((name, index) => (
                <TextField
                  key={index}
                  label={name}
                  id={`standard-size-small-${index}`}
                  defaultValue=""
                  size="small"
                  variant="standard"
                  onChange={(event) =>
                    handleCellChange(event, rowIndex, columnIndex)
                  }
                />
              ))}
            </TableCell>
            <TableRow>
              <TableCell colSpan={7}>
                {addressInfo.map((name, index) => (
                  <TextField
                    key={index}
                    label={name}
                    id={`standard-size-small-${index}`}
                    defaultValue=""
                    size="small"
                    variant="standard"
                    onChange={(event) =>
                      handleCellChange(event, rowIndex, columnIndex)
                    }
                  />
                ))}
              </TableCell>
            </TableRow>
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
          </TableHead>
          <TableHead>
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
            {reportData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, columnIndex) => (
                  <TableCell
                    key={columnIndex}
                    style={columnIndex === 0 ? subHeaderCellStyle : cellStyle}
                  >
                    {columnIndex === 0 ? (
                      <div style={subHeaderCellStyle}>
                        {ordinaryRows[rowIndex]}
                      </div>
                    ) : (
                      <TextField
                        value={cell}
                        onChange={(event) =>
                          handleCellChange(event, rowIndex, columnIndex)
                        }
                        fullWidth
                        variant="standard"
                        InputProps={{
                          readOnly: columnIndex === 0,
                        }}
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow>
              <TableCell style={subHeaderCellStyle}>
                Sum sortert ordinært avfall
              </TableCell>
              {/*TODO: Add functionality to sum the ordinary waste*/}
            </TableRow>
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
            {dangerousData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, columnIndex) => (
                  <TableCell
                    key={columnIndex}
                    style={columnIndex === 0 ? subHeaderCellStyle : cellStyle}
                  >
                    {columnIndex === 0 ? (
                      <div style={subHeaderCellStyle}>
                        {dangerousRows[rowIndex]}
                      </div>
                    ) : (
                      <TextField
                        value={cell}
                        onChange={(event) =>
                          handleDangerousCellChange(
                            event,
                            rowIndex,
                            columnIndex
                          )
                        }
                        fullWidth
                        variant="standard"
                        InputProps={{
                          readOnly: columnIndex === 0,
                        }}
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow>
              <TableCell style={subHeaderCellStyle}>
                Sum sortert farlig avfall
              </TableCell>
              {/*TODO: Add functionality to sum the dangerous waste*/}
            </TableRow>
            <TableRow>
              <TableCell style={subHeaderCellStyle}>
                Blandet avfall / restavfall
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={subHeaderCellStyle}>Sum avfall i alt</TableCell>
              {/*TODO: Add functionality to sum the total waste*/}
            </TableRow>
            <TableRow>
              <TableCell style={subHeaderCellStyle}>Sorteringsgrad</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={subHeaderCellStyle}>
                Avfall/areal (kg/m2)
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default WasteReport;
