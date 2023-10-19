import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { Box, FormControlLabel, Grid, MenuItem, OutlinedInput, Radio, RadioGroup, Select } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const NoticeModal = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('y');
  const [personName, setPersonName] = React.useState([]);

  const theme = useTheme();
  const handleChangeSelect = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <Button variant="outlined" size="medium" onClick={handleOpen}>
        합격등록
      </Button>
      <BootstrapDialog onClose={handleClose} 
        aria-labelledby="customized-dialog-title" open={open} maxWidth={'md'}>
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }} id="customized-dialog-title">
          <EventNoteIcon />
          <Typography variant="h4">합격 등록</Typography>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          dividers
          sx={{
            minWidth: '800px',
            minHeight: '500px',
            maxHeight: '900px',
            overflow: 'hidden'
          }}
        >
          <Grid container direction={'column'} spacing={2}>
            <Grid item container sx={{ display: 'flex', alignItems: 'center' }}>
              <Grid item xs={3}>
                <Typography variant="h4">발표 유형</Typography>
              </Grid>
              <Grid item xs={9}>
                <RadioGroup
                  row
                  aria-labelledby="demo-form-control-label-placement"
                  name="position"
                  defaultValue="top"
                  value={value}
                  onChange={handleChange}
                >
                  <MyRadio value="y" control={<Radio />} label="합격 안내" />
                  <MyRadio value="n" control={<Radio />} label="불합격 안내" />
                </RadioGroup>
              </Grid>
            </Grid>
            <Grid item container sx={{ display: 'flex', alignItems: 'center' }}>
              <Grid item xs={3}>
                <Typography variant="h4">발표 전형</Typography>
              </Grid>
              <Grid item xs={9}>
                <MySelect
                  displayEmpty
                  value={personName}
                  onChange={handleChangeSelect}
                  input={<MyInput />}
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return <em>전형 선택</em>;
                    }

                    return selected.join(', ');
                  }}
                  MenuProps={MenuProps}
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem disabled value="">
                    <em>전형 선택</em>
                  </MenuItem>
                  {names.map((name) => (
                    <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
                      {name}
                    </MenuItem>
                  ))}
                </MySelect>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button autoFocus onClick={handleClose}>
            미리보기
          </Button>
          <Box>
            <Button autoFocus onClick={handleClose}>
              발표 등록
            </Button>
            <Button autoFocus onClick={handleClose}>
              취소
            </Button>
          </Box>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

const MySelect = styled(Select)(({ theme }) => ({
  border: `${theme.palette.grey[300]} 1px solid`,
  width: '250px',
  borderRadius: '4px',
}));

const MyInput = styled(OutlinedInput)(({ theme }) => ({
  border: `${theme.palette.grey[300]} 1px solid`,
  width: '250px',
  borderRadius: '4px',
  background: 'transparent'
}));

const MyRadio = styled((props) => <FormControlLabel {...props} />)(({ theme }) => ({
  border: `${theme.palette.grey[300]} 1px solid`,
  padding: '7px',
  paddingRight: '70px',
  borderRadius: '4px',
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      borderRadius: '4px'
    },
  },
};

const names = [
  '서류전형',
  '인적성전형',
  '면접전형',
  '최종합격',
  '기타'
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default NoticeModal;
