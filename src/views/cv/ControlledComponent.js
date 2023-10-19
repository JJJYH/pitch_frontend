import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function ControlledComponent({ labelName, BeforeDay, StartDate, EndDate, name }) {
  const [value, setValue] = React.useState(null);
  console.log('props name : ' + name);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        sx={{ width: '100%' }}
        value={value}
        name={name}
        onChange={(newValue) => {
          setValue(newValue);
          StartDate ? StartDate(newValue) : false;
          EndDate ? EndDate(newValue) : false;
        }}
        label={labelName}
        format="YYYY.MM.DD"
        shouldDisableDate={(day) => (BeforeDay ? dayjs(day).isBefore(BeforeDay, 'YYYY/MM/DD') : false)}
      />
    </LocalizationProvider>
  );
}
