import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useState } from 'react';

/* mui components */
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Box, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import SaveAsOutlinedIcon from '@mui/icons-material/SaveAsOutlined';

const DownloadModal = ({ setChecked }) => {
  const [open, setOpen] = useState(false);
  const [checkedValues, setCheckedValues] = useState([]);

  const handleDownloadOpen = () => {
    setOpen(true);
  };
  const handleDownloadClose = () => {
    setOpen(false);
  };

  const handleCheckboxChange = (value) => () => {
    if (checkedValues.includes(value)) {
      setCheckedValues((prevValues) => prevValues.filter((item) => item !== value));
    } else {
      setCheckedValues((prevValues) => [...prevValues, value]);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        size="medium"
        style={{ marginRight: '5px', borderColor: '#38678f', background: '#38678f' }}
        onClick={handleDownloadOpen}
      >
        <SaveAsOutlinedIcon />
        저장하기
      </Button>
      <BootstrapDialog onClose={handleDownloadClose} aria-labelledby="customized-dialog-title" open={open} maxWidth={'sm'}>
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }} id="customized-dialog-title">
          <SaveAsOutlinedIcon />
          <Typography variant="h4">저장하기</Typography>
          <IconButton aria-label="setting" size="large"></IconButton>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleDownloadClose}
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
            minWidth: '300px',
            minHeight: '300px',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={checkedValues.includes('CV')} onChange={handleCheckboxChange('CV')} />}
              label="입사지원서(.xlsx)"
            />
            <FormControlLabel
              control={<Checkbox checked={checkedValues.includes('Statement')} onChange={handleCheckboxChange('Statement')} />}
              label="자기소개서"
            />
            <FormControlLabel
              control={<Checkbox checked={checkedValues.includes('Career')} onChange={handleCheckboxChange('Career')} />}
              label="경력기술서"
            />
            <FormControlLabel
              control={<Checkbox checked={checkedValues.includes('Portfolio')} onChange={handleCheckboxChange('Portfolio')} />}
              label="포트폴리오"
            />
            <FormControlLabel
              control={<Checkbox checked={checkedValues.includes('etcDocs')} onChange={handleCheckboxChange('etcDocs')} />}
              label="기타"
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Box>
            <Button
              autoFocus
              onClick={() => {
                setChecked([...checkedValues]);
                handleDownloadClose();
              }}
            >
              저장
            </Button>
            <Button autoFocus onClick={handleDownloadClose}>
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

export default DownloadModal;
