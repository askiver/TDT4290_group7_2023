

export default function MaterialSelectionFilter(props) {
    const checked = props.checked;

    return (
        <div className="filter_MaterialSelection">
            <div className="filter_RadioButton">
                <input type='radio' id='materialfilter1' name='filter_materialSelectionRadio' value='wood' defaultChecked={checked[0]}/>
                <label htmlFor='materialfilter1'>Trevirke</label>
            </div>
            <div className="filter_RadioButton">
                <input type='radio' id='materialfilter2' name='filter_materialSelectionRadio' value='paper' defaultChecked={checked[1]}/>
                <label htmlFor='materialfilter2'>Papir, papp, og kartong</label>
            </div>
            <div className="filter_RadioButton">
                <input type='radio' id='materialfilter3' name='filter_materialSelectionRadio' value='glass' defaultChecked={checked[2]}/>
                <label htmlFor='materialfilter3'>Glass</label>
            </div>
            <div className="filter_RadioButton">
                <input type='radio' id='materialfilter4' name='filter_materialSelectionRadio' value='metal' defaultChecked={checked[3]}/>
                <label htmlFor='materialfilter4'>Jern og andre metaller</label>
            </div>
            <div className="filter_RadioButton">
                <input type='radio' id='materialfilter5' name='filter_materialSelectionRadio' value='plaster' defaultChecked={checked[4]}/>
                <label htmlFor='materialfilter5'>Gipsbaserte materialer</label>
            </div>
            <div className="filter_RadioButton">
                <input type='radio' id='materialfilter6' name='filter_materialSelectionRadio' value='plastic' defaultChecked={checked[5]}/>
                <label htmlFor='materialfilter6'>Plast</label>
            </div>
            <div className="filter_RadioButton">
                <input type='radio' id='materialfilter7' name='filter_materialSelectionRadio' value='concrete' defaultChecked={checked[6]}/>
                <label htmlFor='materialfilter7'>Betong</label>
            </div>
            <div className="filter_RadioButton">
                <input type='radio' id='materialfilter8' name='filter_materialSelectionRadio' value='pConcrete' defaultChecked={checked[7]}/>
                <label htmlFor='materialfilter8'>Forurenset betong</label>
            </div>
            <div className="filter_RadioButton">
                <input type='radio' id='materialfilter9' name='filter_materialSelectionRadio' value='eWaste' defaultChecked={checked[8]}/>
                <label htmlFor='materialfilter9'>EE-avfall</label>
            </div>
            <div className="filter_RadioButton">
              <input type='radio' id='materialfilter10' name='filter_materialSelectionRadio' value='surfaceTreatmentWaste' defaultChecked={checked[9]}/>
                <label htmlFor='materialfilter10'>Overflatebehandlingsavfall</label>
            </div>
        </div>
    )
}