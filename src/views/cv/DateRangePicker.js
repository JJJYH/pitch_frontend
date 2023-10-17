import React, { useState } from 'react';
import { DateRangePicker } from 'mui-daterange-picker';
import { CalendarIcon } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { IconButton, InputAdornment, OutlinedInput } from '@mui/material';
const DateRangePickerComponent = () => {
  const [open, setOpen] = useState(true);
  // dateRange 변수는 아직 사용되지 않지만 나중에 사용할 것입니다.
  // eslint-disable-next-line no-unused-vars

  const [dateRange, setDateRange] = useState({});

  for (const key in dateRange) {
    console.log('DATE LANGE : ' + `${key}: ${dateRange[key]}`);
  }
  const toggle = () => setOpen(!open);
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CalendarIcon onClick={toggle} />
        <DateRangePicker open={open} toggle={toggle} value={dateRange} onChange={(range) => setDateRange(range)} />
      </LocalizationProvider>
    </>
  );
};

export default DateRangePickerComponent;
