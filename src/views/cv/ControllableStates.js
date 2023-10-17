import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const options = ['React', 'Redis'];

export default function ControllableStates(props) {
  const { value, setValue, inputValue, setInputValue, addChipData } = props;

  console.log(inputValue);

  return (
    <div>
      <br />
      <Autocomplete
        value={value}
        freeSolo
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        onSubmit={() => addChipData()}
        id="controllable-states-demo"
        options={options}
        renderInput={(params) => <TextField {...params} fullWidth label="Skill" />}
      />
    </div>
  );
}
