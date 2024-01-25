import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export default function FutureDatePicker(props) {
  const tomorrow = dayjs(Date.now()).add(1, 'day');
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker format='DD/MM/YYYY' minDate={tomorrow} defaultValue={tomorrow} {...props} />
    </LocalizationProvider>
  );
}
