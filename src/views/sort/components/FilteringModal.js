import * as React from 'react';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
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
import {
  Box,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  OutlinedInput,
  Slider,
  TextField
} from '@mui/material';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';

/* custom components */
import ScrollingApplicantList from './ScrollingApplicantList';
import { useSnackbar } from 'notistack';

const FilteringModal = ({ postingNo, postingInfo, setIsChanged, isChanged }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [selectedFilter, setSelectedFilter] = useState([
    { key: 3, label: '우대사항', value: 5 },
    { key: 0, label: '경력', value: 30 },
    { key: 1, label: '자격증', value: 15 },
    { key: 2, label: '어학점수', value: 20 },
    { key: 4, label: '학력', value: 30 }
  ]);
  const [filterList, setFilterList] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [openModal, setOpenModal] = useState(false);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [max, setMax] = useState(0);
  const [isBtnClicked, setIsBtnClicked] = useState(false);
  const [totalSliderValue, setTotalSliderValue] = useState(100);

  const handleSliderChange = (event, filter) => {
    const updatedFilterList = selectedFilter.map((item) => {
      if (item.key == filter.key) {
        return { ...item, value: event.target.value };
      }
      return item;
    });

    const totalValue = updatedFilterList.reduce((total, item) => total + item.value, 0);

    if (totalValue <= 100) {
      setSelectedFilter(updatedFilterList);
      setTotalSliderValue(100 - totalValue);
    }
  };

  const handleOpen = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const addFilter = (filter) => {
    const updatedList = filterList.filter((item) => item.key !== filter.key);
    setFilterList(updatedList);
    const updatedSelected = [...selectedFilter, { ...filter }];
    setSelectedFilter(updatedSelected);
  };

  const removeFilter = (filter) => {
    setSelectedFilter((prevSelectedFilter) => prevSelectedFilter.filter((item) => item.key !== filter.key));
    setFilterList((prevFilterList) => [...prevFilterList, filter]);
  };

  const handleClear = () => {
    setSelectedFilter([
      { key: 3, label: '우대사항', value: 5 },
      { key: 0, label: '경력', value: 30 },
      { key: 1, label: '자격증', value: 15 },
      { key: 2, label: '어학점수', value: 20 },
      { key: 4, label: '학력', value: 30 }
    ]);
    setFilterList([]);
    setTotalSliderValue(100);
    setTotal(max);
  };

  useEffect(() => {
    const filter = setFilter();
    sort.applicantSortList(postingNo, filter).then((res) => {
      setList([...res.data]);
      setMax(res.data.length);
      setTotal(res.data.length);
    });

    let val = 0;

    selectedFilter.map((fil) => {
      val += fil.value;
    });

    setTotalSliderValue(100 - val);
  }, []);

  useEffect(() => {
    let val = 0;
    selectedFilter.map((fil) => {
      val += fil.value;
    });

    setTotalSliderValue(100 - val);
  }, [selectedFilter]);

  useEffect(() => {
    const filter = setFilter();
    sort.applicantSortList(postingNo, filter).then((res) => {
      setList([...res.data]);
    });
  }, [selectedFilter, totalSliderValue]);

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

    const selected = selectedFilter.reduce((accumulator, f) => {
      if (f.label === '우대사항') {
        accumulator.advantageScore = f.value;
      } else if (f.label === '경력') {
        accumulator.experienceScore = f.value;
      } else if (f.label === '자격증') {
        accumulator.certificationScore = f.value;
      } else if (f.label === '어학점수') {
        accumulator.languageScore = f.value;
      } else if (f.label === '학력') {
        accumulator.educationScore = f.value;
      }

      return accumulator;
    }, {});

    return { ...selected, ...filter };
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
          <Box>
            <Typography variant="h4" sx={{ mt: '20px', mb: '10px' }}>
              선별 기준
            </Typography>
            <Divider sx={{ mb: '20px' }} />
            <Grid container direction={'column'}>
              <Grid item container sx={{ display: 'flex', alignItems: 'center', mb: '20px' }}>
                <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Typography variant="h5">
                    <b>선별인원수</b>
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <PrettoSlider
                    sx={{ ml: '20px' }}
                    valueLabelDisplay="auto"
                    aria-label="pretto slider"
                    defaultValue={20}
                    max={max}
                    value={total}
                    onChange={(e) => {
                      setTotal(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={3} sx={{ display: 'flex', alignItems: 'end', justifyContent: 'center' }}>
                  <TextField
                    id="standard-number"
                    label="미분류"
                    InputLabelProps={{
                      shrink: true
                    }}
                    sx={{ width: '50px', ml: '110px' }}
                    variant="standard"
                    value={total}
                    onChange={(e) => {
                      setTotal(e.target.value);
                    }}
                  />
                  <Typography variant="h3" sx={{ ml: '5px' }}>
                    /{max}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container sx={{ display: 'flex', alignItems: 'center' }}>
                <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', pr: '10px' }}>
                  <Typography variant="h5">
                    <b>선별조건</b>
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={10}
                  sx={{
                    height: '60px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    border: '1px solid black',
                    alignItems: 'center'
                  }}
                >
                  <Box sx={{ width: '620px', display: 'flex', justifyContent: 'start', ml: '10px' }}>
                    {selectedFilter.map((data) => {
                      return (
                        <Chip
                          sx={{ mr: '6px' }}
                          key={data.key}
                          label={data.label}
                          onDelete={(e) => {
                            e.stopPropagation();
                            data.label === '기본' ? undefined : removeFilter(data);
                          }}
                        />
                      );
                    })}
                  </Box>
                  <Box>
                    <IconButton
                      color="primary"
                      aria-label="add to list"
                      onClick={handleClick}
                      aria-controls={open ? 'account-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                      style={{ color: '#38678f' }}
                    >
                      <AddCircleOutlinedIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      id="account-menu"
                      open={open}
                      onClose={handleClose}
                      onClick={handleClose}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      {filterList.map((filter) => {
                        return (
                          <MenuItem
                            key={filter.key}
                            onClick={() => {
                              addFilter(filter);
                            }}
                          >
                            {filter.label}
                          </MenuItem>
                        );
                      })}
                    </Menu>
                  </Box>
                </Grid>
              </Grid>
              <Grid item container sx={{ mt: ' 20px' }}>
                <Grid item xs={2}></Grid>
                <Grid item xs={8} container>
                  {selectedFilter?.map((filter) => {
                    return (
                      <Grid item container key={filter.key}>
                        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <Typography variant="h5">{filter.label}</Typography>
                        </Grid>
                        <Grid item xs={7}>
                          <PrettoSlider
                            onChange={(e, val) => {
                              handleSliderChange(e, filter);
                            }}
                            sx={{ ml: '5px', maxWidth: '338px' }}
                            valueLabelDisplay="auto"
                            aria-label="pretto slider"
                            max={100}
                            value={filter.value}
                          />
                        </Grid>
                        <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <TextField
                            sx={{ maxWidth: '60px', textAlign: 'center' }}
                            id="standard-number"
                            InputLabelProps={{
                              shrink: true
                            }}
                            variant="standard"
                            value={filter.value}
                            aria-readonly
                          />
                        </Grid>
                      </Grid>
                    );
                  })}
                </Grid>
                <Grid item container sx={{ mt: '70px', display: 'flex', justifyContent: 'flex-end', mr: '10px' }}>
                  <Button
                    onClick={handleClear}
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
                    초기화
                  </Button>
                  <FormControl sx={{ maxWidth: '85px' }}>
                    <InputLabel htmlFor="outlined-adornment-amount">잔여</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-amount"
                      endAdornment={<InputAdornment position="end">%</InputAdornment>}
                      value={totalSliderValue}
                      label="잔여"
                      aria-readonly
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ ml: '30px', width: '1px' }}>
            <Divider orientation="vertical" />
          </Box>
          <Box sx={{ ml: '30px' }}>
            <Typography variant="h4" sx={{ mt: '20px', mb: '10px' }}>
              지원자 목록
            </Typography>
            <Divider sx={{ mb: '20px' }} />
            <ScrollingApplicantList
              height={400}
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

const PrettoSlider = styled(Slider)({
  color: '#38678f',
  height: 8,
  '& .MuiSlider-track': {
    border: 'none'
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit'
    },
    '&:before': {
      display: 'none'
    }
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: '#38678f',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)'
    },
    '& > *': {
      transform: 'rotate(45deg)'
    }
  }
});

export default FilteringModal;
