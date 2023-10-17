import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';

const tableStyle = {
  maxWidth: '80%',
  margin: '0 auto',
};

const cellStyle = {
  border: '1px solid #ddd',
};

const boldText = {
  fontWeight: 'bold'
}

const headerCellStyle = {
  backgroundColor: '#f0f0f0',
  fontWeight: 'bold',
  border: '1px solid #ddd',
  textAlign: 'center',
};

const subHeaderCellStyle = {
  backgroundColor: '#f5f5f5',
}

const centerCellStyle = {
  backgroundColor: '#f5f5f5',
  textAlign: 'center',
  border: '1px solid #ddd',
}

// Rows that represent the rows of the ordinary waste from the waste report
const ordinaryRows = [
  'Trevirke (ikke kreosot- og CCA-impregnert)', 'Papir, papp og kartong', 'Glass', 'Jern og andre metaller', 'Gipsbaserte materialer', 'Plast', 'Betong, tegl, lett klinker og lignende', 'Forurenset betong og tegn (under grensen for farlig avfall)', 'EE-avfall (elektriske og elektroniske produkter)', 'Annet (fyll inn under)'
]

// Rows that represent the rows of the dangerous waste from the waste report
const dangerousRows = [
  '7051-55 Maling, lim, lakk, fugemasser, spraybokser, m.m (også "tomme" fugemasse-patroner)'
]

const WasteReport = () => {
  const initialData = Array.from({ length: 10 }, () => Array(7).fill(''));

  const [reportData, setReportData] = useState(initialData);

  const handleCellChange = (event, rowIndex, columnIndex) => {
    const newValue = event.target.value;
    const updatedData = [...reportData];
  
    updatedData[rowIndex][columnIndex] = newValue;
  
    setReportData(updatedData);
  };

  return (
    <TableContainer component={Paper} style={tableStyle}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={headerCellStyle}></TableCell>
            <TableCell style={headerCellStyle}>PLAN</TableCell>
            <TableCell style={headerCellStyle} colSpan={5}>SLUTTRAPPORT</TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={headerCellStyle}></TableCell>
            <TableCell style={headerCellStyle}>Beregnet mengde (tonn)</TableCell>
            <TableCell style={headerCellStyle} colSpan={4}>Disponeringsmåte (Angi mengde og leveringssted)</TableCell>
            <TableCell style={headerCellStyle}>Faktisk mengde (tonn) (2) + (4)</TableCell>
          </TableRow>
        </TableHead>
        <TableHead>
          <TableRow>
            <TableCell style={centerCellStyle}></TableCell>
            <TableCell style={centerCellStyle}>Fraksjoner som skal kildesorteres</TableCell>
            <TableCell style={centerCellStyle}>Mengde levert til godkjent avfallsanlegg</TableCell>
            <TableCell style={centerCellStyle}>Leveringssted</TableCell>
            <TableCell style={centerCellStyle}>Mengde levert direkte til ombruk/gjenvinning</TableCell>
            <TableCell style={centerCellStyle}>Leveringssted</TableCell>
            <TableCell style={centerCellStyle}>Fraksjoner som er kildesortert</TableCell>
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
            <TableCell style={centerCellStyle}><span style={boldText}>Ordinært avfall</span><br />
        (listen er ikke uttømmende)
      </TableCell>
            {Array.from({ length: 6 }, (_, index) => (
              <TableCell key={index} style={centerCellStyle}/>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {reportData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, columnIndex) => (
                <TableCell key={columnIndex} style={columnIndex === 0 ? subHeaderCellStyle : cellStyle}>
                  {columnIndex === 0 ? (
                    <div style={subHeaderCellStyle}>
                      {ordinaryRows[rowIndex]}
                    </div>
                  ) : (
                    <TextField
                      value={cell}
                      onChange={(event) => handleCellChange(event, rowIndex, columnIndex)}
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
            <TableCell style={subHeaderCellStyle}>Sum ordinært avfall</TableCell>
          </TableRow>
          <TableRow style={cellStyle}>
            <TableCell>Farlig avfall (listen er ikke utømmelig)</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WasteReport;
