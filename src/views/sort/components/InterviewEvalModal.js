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
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AssignmentIndRoundedIcon from '@mui/icons-material/AssignmentIndRounded';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

const FilteringModal = () => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="contained"
        size="medium"
        style={{ marginRight: '5px', borderColor: '#38678f', background: '#38678f' }}
        onClick={handleOpen}
      >
        평가등록
      </Button>
      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth={'md'}>
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }} id="customized-dialog-title">
          <AssignmentIndRoundedIcon />
          <Typography variant="h4">면접 평가</Typography>
          <IconButton aria-label="setting" size="large"></IconButton>
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
        ></DialogContent>
        <DialogActions>
          <Box>
            <Button autoFocus onClick={handleClose}>
              평가 등록
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

export default FilteringModal;
