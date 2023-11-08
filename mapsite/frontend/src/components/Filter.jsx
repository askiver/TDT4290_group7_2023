import FilterButton from "./FilterButton"
import MaterialSelectionFilter from "./MaterialSelectionFilter";
import { useState } from "react";
import { ReactPropTypes } from "react";
import "../components/Filter.css"

export default function Filter(props) {
    const [isHidden, setIsHidden] = useState(true);

    console.log("This is isHidden");
    console.log(isHidden);


    const handleClick = () => {
        let buildingFilterArray = [];
        let materialFilterArray = [];
        let filter = {};

        if (!isHidden) {
            //Fix this so that it doesnt use magic number 9 and 4
            for (let i = 1; i < 8; i++) {
                buildingFilterArray.push(document.getElementById(`buildingfilter${i}`));
            }
    
            for (let i = 1; i < 11; i++) {
                materialFilterArray.push(document.getElementById(`materialfilter${i}`));
            }
    
            for (let i = 0; i < 7; i++) {
                if(buildingFilterArray[i].checked) {
                    filter[buildingFilterArray[i].getAttribute('name')] = buildingFilterArray[i].getAttribute('value');
                } else {
                    filter[buildingFilterArray[i].getAttribute('name')] = "";
                }
            }

            for (let i = 0; i < 10; i++) {
                if(materialFilterArray[i].checked) {
                    filter[materialFilterArray[i].getAttribute('value')] = materialFilterArray[i].getAttribute('value');
                } else {
                    filter[materialFilterArray[i].getAttribute('value')] = "";
                }
            }

            props.extractFilter(filter);
        }
        setIsHidden(!isHidden);
        
    }

    return (
        <>
        {isHidden
        ? null : 
            <div className="filterContainer" id="filterContainer">
                <h1 className="filterTitle"> Filters </h1>   
                <div className="filterContainer_buildingFilter">
                    <h3 className="filterContainer_filterTypeText"> Building Filter </h3>
                    <hr className="filterContainer_filterTypeDivide"/>
                    <FilterButton 
                        name={"buildingfilter1"}
                        value={"1"}
                        displayName={"Bolig"}
                        checked={props.checked[0]}
                        />
                    <FilterButton 
                        name={"buildingfilter2"}
                        value={"2"}
                        displayName={"Industri og lagerbygning"}
                        checked={props.checked[1]}/>
                     <FilterButton 
                        name={"buildingfilter3"}
                        value={"3"}
                        displayName={"Kontor- og forretningsbygg"}
                        checked={props.checked[2]}
                        />
                    <FilterButton 
                        name={"buildingfilter4"}
                        value={"4"}
                        displayName={"Samferdsels- og kommunikasjonsbygning"}
                        checked={props.checked[3]}
                        />
                    <FilterButton 
                        name={"buildingfilter5"}
                        value={"5"}
                        displayName={"Hotell- og restaurantbygning"}
                        checked={props.checked[4]}
                        />
                    <FilterButton 
                        name={"buildingfilter6"}
                        value={"6"}
                        displayName={"Kultur- og forskningsbygg"}
                        checked={props.checked[5]}
                        />
                    <FilterButton 
                        name={"buildingfilter7"}
                        value={"7"}
                        displayName={"Helsebygning"}
                        checked={props.checked[6]}
                        />
                </div>
                <div className="filterContainer_materialFilter">
                    <h3 className="filterContainer_filterTypeText"> Material Filter </h3>
                    <hr className="filterContainer_filterTypeDivide"/>
                    <MaterialSelectionFilter
                        checked={props.checked.slice(7)}
                    />
                </div>
                <button className="filterContainer_drawerButtonApply" id="filterContainer_drawerButton" onClick={handleClick}>Apply</button>    
            </div>
        }
        {isHidden ?
        <button className="filterContainer_drawerButtonShow" id="filterContainer_drawerButton" onClick={handleClick}>Filter</button> : null}
        </>
    )
}
