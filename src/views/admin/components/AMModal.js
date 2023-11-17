import { admin } from "api";
import { useEffect } from "react";
import { styled } from '@mui/material/styles';
import { Chip, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import EventNoteIcon from '@mui/icons-material/EventNote';
import Button from '@mui/material/Button';
import { Box, FormControlLabel, Grid, MenuItem, OutlinedInput, Radio, RadioGroup, Select, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2)
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1)
    }
}));

const AMModal = (props) => {
    const theme = useTheme();
    const { open, closeModal } = props;
    useEffect(() => {
        admin.noneAppHrList().then((res) => {
            console.log(res);
        });
    }, [])
    return (<>

        <BootstrapDialog onClose={closeModal} aria-labelledby="customized-dialog-title" open={open} maxWidth={'md'}>
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }} id="customized-dialog-title">
                <EventNoteIcon />
                <Typography variant="h4">&nbsp;승인 대기</Typography>
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={closeModal}
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

                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Box>
                    <Button variant="contained" autoFocus sx={{
                        backgroundColor: theme.palette.secondary.dark,
                        '&:hover': {
                            backgroundColor: theme.palette.secondary.main, // hover 시 적용할 색상
                        }
                    }}>
                        승인
                    </Button>
                    <Button variant="contained" autoFocus sx={{
                        backgroundColor: '#D32F2F', marginLeft: 1,
                        '&:hover': {
                            backgroundColor: '#F44336', // hover 시 적용할 색상
                        }
                    }}>
                        반려
                    </Button>
                </Box>
            </DialogActions>
        </BootstrapDialog>
    </>);
}

export default AMModal;