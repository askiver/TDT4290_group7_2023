
import FilterButton from "./FilterButton"
import "../components/Filter.css"

export default function Filter() {

    return (
        <>
            <div className="filterContainer">
                <h1 className="filterTitle"> Filters </h1>   
                <div className="filterContainer_buildingFilter">
                    <h3 className="filterContainer_filterTypeText"> Building Filter </h3>
                    <hr className="filterContainer_filterTypeDivide"/>
                    <FilterButton 
                        name={"buildingfilter1"}
                        value={"1"}
                        displayName={"Bolig"}/>
                    <FilterButton 
                        name={"buildingfilter2"}
                        value={"2"}
                        displayName={"Industri og lagerbygning"}/>
                     <FilterButton 
                        name={"buildingfilter3"}
                        value={"3"}
                        displayName={"Kontor- og forretningsbygg"}/>
                    <FilterButton 
                        name={"buildingfilter4"}
                        value={"4"}
                        displayName={"Samferdsels- og kommunikasjonsbygning"}/>
                    <FilterButton 
                        name={"buildingfilter5"}
                        value={"5"}
                        displayName={"Hotell- og restaurantbygning"}/>
                    <FilterButton 
                        name={"buildingfilter6"}
                        value={"6"}
                        displayName={"Kultur- og forskningsbygg"}/>
                    <FilterButton 
                        name={"buildingfilter7"}
                        value={"7"}
                        displayName={"Helsebygning"}/>
                    <FilterButton 
                        name={"buildingfilter8"}
                        value={"8"}
                        displayName={"Fengsel, beredskapsbygning, mv."}/>
                </div>
                <div className="filterContainer_materialFilter">
                    <h3 className="filterContainer_filterTypeText"> Material Filter </h3>
                    <hr className="filterContainer_filterTypeDivide"/>
                    <FilterButton 
                        name={"materialfilter1"}
                        value={"steel"}
                        displayName={"Stål"}/>
                    <FilterButton 
                        name={"materialfilter2"}
                        value={"wood"}
                        displayName={"Trevirke"}/>
                    <FilterButton 
                        name={"materialfilter3"}
                        value={"3"}
                        displayName={"Betong"}/>
                </div>

            </div>
        </>
    )
}