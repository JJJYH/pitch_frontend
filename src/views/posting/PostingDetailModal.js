import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Box, Divider, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import { column } from 'stylis';

//import dayjs from 'dayjs';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    },
    '&-ms-overflow-style:': {
      display: 'none'
    }
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

const PostingDetailModal = ({ open, handleClose }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleToggle = () => {
    setIsLiked((prev) => !prev); // 현재 상태를 토글
  };

  const handleScroll = (e) => {
    const scrollY = e.target.scrollTop;

    if (scrollY > 200) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [open]);

  return (
    <div>
      <StyledDialog maxWidth="xl" onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
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

        <DialogContent style={{ width: '1200px', overflow: 'auto', padding: 0 }} onScroll={handleScroll}>
          <Box
            sx={{
              position: 'sticky',
              top: 0,
              backgroundColor: 'white',
              zIndex: 10,
              borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
              opacity: isSticky ? 1 : 0,
              height: '100px',
              transition: 'opacity 0.5s ease-in-out',
              display: isSticky ? 'block' : 'none'
            }}
          >
            제발 돼라
          </Box>
          <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
            <Grid item>
              <Box
                sx={{
                  width: '1100px',
                  // border: '1px solid',
                  height: '50px'
                }}
              >
                <Grid container sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }} spacing={2}>
                  <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                    {isLiked ? (
                      <FavoriteIcon style={{ fontSize: 30, color: '#FF6F6F' }} onClick={handleToggle} />
                    ) : (
                      <FavoriteBorderIcon style={{ fontSize: 30, color: ' #666666' }} onClick={handleToggle} />
                    )}
                    <Typography ml={1}>관심공고</Typography>
                  </Grid>
                  <Grid item sx={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                    <ShareRoundedIcon />
                    <Typography ml={1}>공유</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item>
              <Box
                sx={{
                  width: '1100px',
                  // border: '1px solid',
                  height: '150px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <Typography sx={{ fontSize: '35px', fontWeight: 'bold' }}>채용공고 제목입니다 어쩌구저쩌구어쩌구저쩌구</Typography>
                <Typography sx={{ fontSize: '16px', mt: 2 }}>신입인지... 경력인지..</Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box
                sx={{
                  width: '1100px',
                  // border: '1px solid',
                  height: '150px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Box
                  sx={{
                    width: '1100px',
                    border: '2px solid',
                    height: '90px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '30px'
                  }}
                >
                  <Grid container sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Grid item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Typography sx={{ fontSize: '24px', fontWeight: 'bold', mr: 1 }}>공고마감</Typography>
                      <Typography sx={{ fontSize: '24px', fontWeight: 'bold', color: '#38678f', mr: 1 }}>D-어쩌구</Typography>
                      <Typography sx={{ fontSize: '24px', fontWeight: 'bold' }}>확인해주세요!</Typography>
                    </Grid>
                    <Grid item sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography sx={{ fontSize: '16px' }}>게시</Typography>
                        <Typography ml={2} mr={2} sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                          공고시작날짜
                        </Typography>
                      </Grid>
                      <Typography ml={1} sx={{ fontSize: '24px', fontWeight: 'bold' }}>
                        |
                      </Typography>
                      <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography ml={2} sx={{ fontSize: '16px' }}>
                          마감
                        </Typography>
                        <Typography ml={2} sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                          공고종료날짜
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
            <Grid item>
              <Box
                sx={{
                  width: '1100px',
                  // border: '1px solid',
                  maxHeight: '1000px'
                }}
              >
                <Typography sx={{ fontSize: '25px', fontWeight: 'bold', mt: 4, mb: 4, ml: 3 }}>모집분야 및 지원자격</Typography>
                <Box
                  sx={{
                    width: '1100px',
                    border: '1px solid #ddd',
                    borderTop: ' 2px solid #364152',
                    maxHeight: '900px'
                  }}
                >
                  <Typography sx={{ fontSize: '20px', fontWeight: 'bold', mt: 3, mb: 3, ml: 5 }}>직무이름</Typography>
                  <Box sx={{ width: '1050px', borderTop: '1px solid #ddd', marginLeft: '25px', p: 2, pb: 3 }}>
                    <Grid container direction="column">
                      <Grid item>
                        <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mt: 3, mb: 3 }}>공통지원자격</Typography>
                        <Typography mb={1}>- 공통 필수사항 : 병역필 또는 면제자로, 해외여행에 결격 사유가 없는 자</Typography>
                        <Typography mb={1}>- 공통 우대사항 : 학사 취득 후 4년이상 유관경력 보유자</Typography>
                        <Typography mb={1}>※ 석/박사 학위취득(예정)자의 경우 수학기간을 경력기간으로 인정</Typography>
                      </Grid>
                      <Grid item>
                        <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mt: 3, mb: 3 }}>공통지원자격</Typography>
                        <Typography mb={1}>- 공통 필수사항 : 병역필 또는 면제자로, 해외여행에 결격 사유가 없는 자</Typography>
                        <Typography mb={1}>- 공통 우대사항 : 학사 취득 후 4년이상 유관경력 보유자</Typography>
                        <Typography mb={1}>※ 석/박사 학위취득(예정)자의 경우 수학기간을 경력기간으로 인정</Typography>
                      </Grid>
                      <Grid item>
                        <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mt: 3, mb: 3 }}>공통지원자격</Typography>
                        <Typography mb={1}>- 공통 필수사항 : 병역필 또는 면제자로, 해외여행에 결격 사유가 없는 자</Typography>
                        <Typography mb={1}>- 공통 우대사항 : 학사 취득 후 4년이상 유관경력 보유자</Typography>
                        <Typography mb={1}>※ 석/박사 학위취득(예정)자의 경우 수학기간을 경력기간으로 인정</Typography>
                      </Grid>
                      <Grid item>
                        <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mt: 3, mb: 3 }}>공통지원자격</Typography>
                        <Typography mb={1}>- 공통 필수사항 : 병역필 또는 면제자로, 해외여행에 결격 사유가 없는 자</Typography>
                        <Typography mb={1}>- 공통 우대사항 : 학사 취득 후 4년이상 유관경력 보유자</Typography>
                        <Typography mb={1}>※ 석/박사 학위취득(예정)자의 경우 수학기간을 경력기간으로 인정</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ width: '1100px', height: '200px', border: '1px solid' }}>첨부자료</Box>
            </Grid>
            <Grid item>
              <Box sx={{ width: '1100px', height: '400px', border: '1px solid' }}>채용절차</Box>
            </Grid>
            <Grid item>
              <Box sx={{ width: '1100px', height: '200px', border: '1px solid' }}>지원서 작성</Box>
            </Grid>
            <Grid item mb={3}>
              <Box sx={{ width: '1100px', height: '400px', border: '1px solid' }}>지원 안내, 기타사항</Box>
            </Grid>
          </Grid>
        </DialogContent>

        {/* <DialogActions>
          <Button type="submit" variant="contained" color="primary">
            등록
          </Button>
          <Button autoFocus onClick={handleClose}>
            Save changes
          </Button>
        </DialogActions> */}
      </StyledDialog>
    </div>
  );
};

export default PostingDetailModal;
