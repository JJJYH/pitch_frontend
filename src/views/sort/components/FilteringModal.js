import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import TuneIcon from '@mui/icons-material/Tune';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import CustomizedSlider from './Slider';
import { Box, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ScrollingApplicantList from './ScrollingApplicantList';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />} {...props} />
))(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)'
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1)
  }
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)'
}));

const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0
  },
  '&:before': {
    display: 'none'
  }
}));

const FilteringModal = () => {
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState('panel1');
  const theme = useTheme();

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div>
      <Button variant="contained" size="medium" style={{ marginRight: '5px' }} onClick={handleOpen}>
        필터링
      </Button>
      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth={'md'}>
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }} id="customized-dialog-title">
          <FilterAltOutlinedIcon />
          <Typography variant="h4">지원자 필터링</Typography>
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
        >
          <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" sx={{ display: 'flex', alignItems: 'center' }}>
              <TuneIcon />
              <Typography>필터 설정</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <CustomizedSlider name={'인적성'} />
              <CustomizedSlider name={'자격증'} />
              <CustomizedSlider name={'학력'} />
              <CustomizedSlider name={'어학점수'} />
              <CustomizedSlider name={'경력'} />
            </AccordionDetails>
          </Accordion>
          <Typography variant="h4" sx={{ mt: '20px', mb: '10px'}}>지원자 목록</Typography>
          <Divider />
          <ScrollingApplicantList height={400} width={768} itemSize={80} />
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ ml: '15px' }}>
            <Typography variant="h4">
              총 <b style={{ fontWeight: 'bold', fontSize: '25px', color: theme.palette.primary[800] }}>24</b> 지원자
            </Typography>
          </Box>
          <Box>
            <Button autoFocus onClick={handleClose}>
              불합격 처리
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
