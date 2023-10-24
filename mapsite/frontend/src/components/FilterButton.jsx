
export default function FilterButton(props) {
    const filterName = props.name;
    const displayName = props.displayName;
    const value = props.value;
    const checked = props.checked;

    return (
        <div className="filterButton_container">
                <input type="checkbox" id={filterName} name={filterName} value={value} defaultChecked={checked}/>
                <label htmlFor={filterName}> {displayName} </label>
        </div>
    )
}