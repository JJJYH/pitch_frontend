import * as React from 'react';
import { useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

/* mui components */
import { Chip } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import EventNoteIcon from '@mui/icons-material/EventNote';
import Button from '@mui/material/Button';
import {
  Box,
  FormControlLabel,
  Grid,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField,
  TextareaAutosize
} from '@mui/material';
import { sort } from 'api';

/* custom components */

const NoticeModal = () => {
  const [open, setOpen] = React.useState(false);
  const [radioValue, setRadioValue] = React.useState('pass');
  const [processType, setProcessType] = React.useState('');
  const [noticeArea, setNoticeArea] = React.useState();
  const [cursorPos, setCursorPos] = React.useState(0);
  const noticeAreaRef = useRef(null);

  const handleChangeSelect = (event) => {
    setProcessType(event.target.value);
    setNoticeArea(noticeText[radioValue][event.target.value]);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleTextFieldFocus = (event) => {
    setCursorPos(event.target.selectionStart);
  };

  const handleChangeTextArea = (event) => {
    setNoticeArea(event.target.value);
  };

  const handleChangeRadio = (event) => {
    setRadioValue(event.target.value);
    setProcessType('');
    setNoticeArea('');
  };

  const addToText = (txt) => {
    const textarea = noticeAreaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const prefix = noticeArea.substring(0, start);
    const suffix = noticeArea.substring(end);
    setNoticeArea(prefix + txt + suffix);
    // 커서 위치 조정
    textarea.setSelectionRange(start + txt.length, start + txt.length);
    textarea.focus();
  };

  useEffect(() => {
    if (noticeArea && cursorPos === 0) {
      setCursorPos(noticeArea.length);
    }
  }, [noticeArea, cursorPos]);

  return (
    <div>
      <Button variant="outlined" size="medium" onClick={handleOpen} style={{ borderColor: '#b2cce1', color: '#b2cce1' }}>
        합격발표
      </Button>
      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth={'md'}>
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }} id="customized-dialog-title">
          <EventNoteIcon />
          <Typography variant="h4">합격 발표</Typography>
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
                  value={radioValue}
                  onChange={handleChangeRadio}
                  sx={{ marginLeft: '12px' }}
                >
                  <MyRadio value="pass" control={<Radio />} label="합격" />
                  <MyRadio value="fail" control={<Radio />} label="불합격" />
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
                  value={processType}
                  onChange={handleChangeSelect}
                  input={<MyInput />}
                  renderValue={(selected) => {
                    if (selected !== '') {
                      return selected;
                    }
                    return <em>전형 선택</em>;
                  }}
                  MenuProps={MenuProps}
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem disabled value="">
                    <em>전형 선택</em>
                  </MenuItem>
                  {names[radioValue].map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </MySelect>
              </Grid>
            </Grid>
            <Grid item container sx={{ display: 'flex', alignItems: 'center' }}>
              <Grid item xs={3}>
                <Typography variant="h4">발표 문구</Typography>
              </Grid>
            </Grid>
            <Grid item container sx={{ display: 'flex', alignItems: 'center' }}>
              <Grid item xs={12}>
                <TextField
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ display: 'flex', marginTop: '5px' }}>
                        <StatusChip1
                          label={'지원자명'}
                          onClick={(event) => {
                            event.stopPropagation();
                            addToText('%지원자명%');
                          }}
                        />
                        <StatusChip2
                          label={'회사명'}
                          onClick={(event) => {
                            event.stopPropagation();
                            addToText('%회사명%');
                          }}
                        />
                        <StatusChip5
                          label={'공고명'}
                          onClick={(event) => {
                            event.stopPropagation();
                            addToText('%공고명%');
                          }}
                        />
                      </Box>
                    )
                  }}
                  id="notice_textarea"
                  multiline
                  rows={12}
                  value={noticeArea}
                  onChange={handleChangeTextArea}
                  onFocus={handleTextFieldFocus}
                  inputRef={noticeAreaRef}
                  sx={{
                    width: '98%',
                    '& .MuiInputBase-root': {
                      flexDirection: 'column'
                    },
                    '& .MuiInputBase-input': {
                      pl: '25px',
                      pr: '25px'
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button autoFocus onClick={handleClose}>
            미리보기
          </Button>
          <Box>
            <Button autoFocus onClick={onClickNotice}>
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

const onClickNotice = (event) => {
  sort
    .noticeHandle(1, {
      //job_posting_no 넣어야 됨
      type: radioValue,
      status_type: processType,
      contents: noticeArea
    })
    .then(() => {
      console.log('fff');
    });
};

/* styled components */

const StatusChip1 = styled(Chip)(() => ({
  border: '3px solid',
  borderColor: '#FFD699',
  borderRadius: '8px',
  color: '#fff',
  fontWeight: 900,
  backgroundColor: '#FFD699',
  minWidth: '82px',
  width: '82px',
  marginRight: '15px',
  ':hover': {
    borderColor: '#FFD699',
    background: '#fff',
    color: '#FFD699'
  },
  cursor: 'pointer'
}));

const StatusChip2 = styled(Chip)(() => ({
  border: '3px solid',
  borderColor: '#E1BEE7',
  borderRadius: '8px',
  color: '#fff',
  fontWeight: 900,
  backgroundColor: '#E1BEE7',
  minWidth: '82px',
  width: '82px',
  marginRight: '15px',
  ':hover': {
    borderColor: '#E1BEE7',
    background: '#fff',
    color: '#E1BEE7'
  },
  cursor: 'pointer'
}));

const StatusChip5 = styled(Chip)(() => ({
  border: '3px solid',
  borderColor: '#90CAF9',
  borderRadius: '8px',
  color: '#fff',
  fontWeight: 900,
  backgroundColor: '#90CAF9',
  minWidth: '82px',
  width: '82px',
  marginRight: '15px',
  ':hover': {
    borderColor: '#90CAF9',
    background: '#fff',
    color: '#90CAF9'
  },
  cursor: 'pointer'
}));

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
  width: '250px'
}));

const MyInput = styled(OutlinedInput)(({ theme }) => ({
  border: `${theme.palette.grey[300]} 1px solid`,
  width: '250px',
  background: 'transparent'
}));

const MyRadio = styled((props) => <FormControlLabel {...props} />)(({ theme }) => ({
  border: `${theme.palette.grey[300]} 1px solid`,
  padding: '7px',
  paddingRight: '70px',
  borderRadius: '4px'
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const names = {
  pass: ['서류전형', '인적성전형', '면접전형', '최종합격', '기타'],
  fail: ['서류전형', '최종합격', '기타']
};

const noticeText = {
  fail: {
    서류전형: `
      안녕하세요, %이름% 님
      %회사명% 채용담당자입니다.
        
      %공고명% 채용 전형에 관심 갖고, 지원해주셔서 감사드립니다.
      아쉽게도 이번에는 합격 소식을 전해드리지 못하게 되었습니다.
      비록 이번 기회에는 %이름%님과 함께 하지 못하지만, 향후 또 다른 기회로 만나 뵙기를 희망합니다.    
      감사합니다.\n
      %회사명% 드림`,
    최종합격: `
      안녕하세요, %이름% 님
      %회사명% 채용담당자입니다.
        
      %공고명% 채용 전형에 관심 갖고, 지원해주셔서 감사드립니다.
      아쉽게도 이번에는 합격 소식을 전해드리지 못하게 되었습니다.
      많은 시간과 노력을 들여주셨음에도 아쉬운 결과를 전달드리게 되어 죄송하다는 말씀 드립니다.
      비록 이번 기회에는 %이름% 님과 함께 하지 못하지만, 향후 또 다른 기회로 만나 뵙기를 희망합니다.    
      앞으로 %이름% 님의 앞날에 빛나는 일만 가득하시기를 진심으로 기원합니다.
      감사합니다.\n
      %회사명% 드림`,
    기타: `
      안녕하세요, %이름% 님
      %회사명% 채용담당자입니다.
        
      
      %회사명% 드림`
  },
  pass: {
    인적성전형: `
    안녕하세요. %이름% 님, %회사명%입니다.
    인적성 검사를 안내드립니다.
    ###`,
    면접전형: `
    안녕하세요, %이름% 님
    %회사명% 채용담당자 입니다.
    
    %공고명% 채용 전형에 관심 갖고, 지원해주셔서 감사드립니다.
    %이름% 께서 정성스럽게 작성해주신 이력서를 보니, 꼭 만나뵙고 싶다는 생각이 들었습니다.
    
    면접 안내 사항 정리하여 전달 드립니다.
    - 면접 일시 :
    - 면접 장소 :
    - 소요 시간 :
    
    1차 면접은 실무진이 참여할 예정입니다.
    
    궁금한 사항은 본 메일을 통해 문의 바랍니다.
    %이름% 님과 만날 날을 기다리고 있겠습니다.
    
    감사합니다.
    %회사명% 드림`,
    서류전형: `
    안녕하세요, %이름% 님
    %회사명% 채용담당자입니다.
      
    %공고명% 채용 전형에 관심 갖고, 지원해주셔서 감사드립니다.
    기쁘게도 %이름% 님께 좋은 소식을 전해 드릴 수 있게 되었습니다.
    이후의 일정은 추후 별도로 안내드릴 예정입니다.
    감사합니다.\n
    %회사명% 드림`,
    최종합격: `
    축하합니다! %이름% 님
      
    %공고명% 채용에 최종 합격하셨음을 안내드립니다.
    진심으로 축하드립니다!
    최선을 다해 채용과정에 임해주신 것에 감사드리며,
    %이름% 님을 동료로 맞이할 수 있게 되어 영광입니다!

    이후의 일정은 추후 별도로 안내드릴 예정입니다.
    감사합니다.\n
    %회사명% 드림`,
    기타: `
    안녕하세요, %이름% 님
    %회사명% 채용담당자입니다.

    기쁘게도 %이름% 님께 좋은 소식을 전해 드릴 수 있게 되었습니다.

    감사합니다.\n
    %회사명% 드림`
  }
};

export default NoticeModal;
