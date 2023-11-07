import { List, ListItem, ListItemText } from "@mui/material"
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function ReportsContainer({ listOfReports }) {

  const navigate = useNavigate()

  console.log("List of reports: ", listOfReports)
  console.log("First report: ", listOfReports[0])
  console.log("First report name: ", listOfReports[0].name)

  return(
      <List sx={style} aria-label="saved reports">
      {listOfReports.map( (report, index) => (
        <ListItem button key={index} style={listItemStyle} onClick={() => (navigate("/report/" + report.id))}>
          <ListItemText primary={report.name} />
        </ListItem>
      ))}
      </List>   
  )
}

// TO BE CHANGED WHEN ACTUAL DATA FORMAT IS GIVEN
ReportsContainer.propTypes = {
  listOfReports: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const style = {
  width: '100%',
  bgcolor: 'background.paper',
};

const listItemStyle = {
  border: '1px solid grey'
}