import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import ReportsContainer from "../components/ReportsContainer";
import "../components/css/WasteReport.css";

/**
 *  This template should display the user's submitted waste reports and saved waste prognoses.
 */ 
export default function ReportsPage() {
  const morereports = [
    {
      name: "Report 1",
      id: "1",
      date: "2023-11-07",
    },
    {
      name: "Report 2",
      id: "2",
      date: "2023-11-08",
    },
    {
      name: "Report 3",
      id: "3",
      date: "2023-11-09",
    },
  ];

  return (
    <div>
      <h3>Oversikt over dine avfallsprognoser- og rapporter</h3>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="table-title">
              Lagrede avfallsprognoser
            </TableCell>
          </TableRow>
          <TableRow>
            <ReportsContainer listOfReports={morereports} />
          </TableRow>
          <TableRow>
            <TableCell className="table-title">
              {" "}
              Innsendte avfallsrapporter
            </TableCell>
          </TableRow>
          <TableRow>
            <ReportsContainer listOfReports={morereports} />
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
