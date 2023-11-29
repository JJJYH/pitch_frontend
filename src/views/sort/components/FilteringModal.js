import * as React from 'react';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { sort } from 'api';

/* mui components */
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { Box, Divider } from '@mui/material';
import Button from '@mui/material/Button';

/* custom components */
import ScrollingApplicantList from './ScrollingApplicantList';
import { useSnackbar } from 'notistack';
import Filter from './Filter';

const FilteringModal = ({ postingNo, postingInfo, setIsChanged, isChanged }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [openModal, setOpenModal] = useState(false);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [max, setMax] = useState(0);
  const [selected, setSelected] = useState([
    { key: 3, label: '우대사항', value: 5 },
    { key: 0, label: '경력', value: 30 },
    { key: 1, label: '자격증', value: 15 },
    { key: 2, label: '어학점수', value: 20 },
    { key: 4, label: '학력', value: 30 }
  ]);
  const [isBtnClicked, setIsBtnClicked] = useState(false);

  const handleOpen = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    const filtert = setFilter();
    sort.applicantSortList(postingNo, { ...filtert }).then((res) => {
      setList([...res.data]);
      setMax(res.data.length);
      setTotal(res.data.length);
    });
  }, []);

  useEffect(() => {
    const filtert = setFilter();
    sort.applicantSortList(postingNo, { ...filtert }).then((res) => {
      setList([...res.data]);
    });
  }, [selected]);

  useEffect(() => {
    if (isBtnClicked) {
      enqueueSnackbar('불합격처리가 완료되었습니다.', { variant: 'info' });
      setIsChanged(!isChanged);
    }
  }, [isBtnClicked]);

  const setFilter = () => {
    const filter = {
      job_type: postingInfo.job_type,
      job_year: postingInfo.job_year,
      job_group: postingInfo.job_group,
      education: postingInfo.education
    };

    const selectedF = selected.reduce((accumulator, f) => {
      if (f.label === '우대사항') {
        accumulator.advantageScore = f.value;
      } else if (f.label === '경력') {
        accumulator.careerScore = f.value;
      } else if (f.label === '자격증') {
        accumulator.certificationScore = f.value;
      } else if (f.label === '어학점수') {
        accumulator.languageScore = f.value;
      } else if (f.label === '학력') {
        accumulator.educationScore = f.value;
      }
      return accumulator;
    }, {});

    return { ...selectedF, ...filter };
  };

  return (
    <div>
      {postingInfo && (
        <Button
          variant="contained"
          size="medium"
          style={{ marginRight: '5px', borderColor: '#38678f', background: '#38678f' }}
          onClick={handleOpen}
        >
          지원자 선별
        </Button>
      )}
      <BootstrapDialog onClose={handleCloseModal} aria-labelledby="customized-dialog-title" open={openModal} maxWidth={'xl'}>
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }} id="customized-dialog-title">
          <FilterAltOutlinedIcon />
          <Typography variant="h4">지원자 선별</Typography>
          <IconButton aria-label="setting" size="large"></IconButton>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseModal}
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
            minHeight: '600px',
            maxHeight: '900px',
            overflow: 'hidden',
            display: 'flex'
          }}
        >
          <Filter max={max} total={total} setSelected={setSelected} setTotal={setTotal} />
          <Box sx={{ ml: '30px', width: '1px' }}>
            <Divider orientation="vertical" />
          </Box>
          <Box sx={{ ml: '30px' }}>
            <Typography variant="h4" sx={{ mt: '20px', mb: '10px' }}>
              지원자 목록
            </Typography>
            <Divider sx={{ mb: '20px' }} />
            <ScrollingApplicantList
              height={500}
              width={400}
              itemSize={80}
              list={list}
              isBtnClicked={isBtnClicked}
              setIsBtnClicked={setIsBtnClicked}
              total={total}
              setOpenModal={setOpenModal}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Box sx={{ mt: '5px', mb: '5px' }}>
            <Button
              autoFocus
              onClick={() => {
                setIsBtnClicked(true);
              }}
              variant="contained"
              size="medium"
              style={{ marginRight: '5px', borderColor: '#38678f', background: '#38678f' }}
            >
              불합격대기
            </Button>
            <Button
              autoFocus
              onClick={handleCloseModal}
              variant="outlined"
              size="medium"
              sx={{
                borderColor: '#38678f',
                color: '#38678f',
                mr: '10px',
                '&:hover': {
                  borderColor: '#38678f'
                }
              }}
            >
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

export default FilteringModal;
