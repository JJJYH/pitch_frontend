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
import {
    GridRowModes,
    DataGrid,
    GridToolbar,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from '@mui/x-data-grid';
import { DialogContentText } from '@mui/material';
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setBadge } from "store/adminSlice";
import { useSnackbar } from 'notistack';

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
    const [rows, setRows] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { handleApp } = props;

    const columns = [
        {
            field: 'user_id', headerName: 'ID', width: 120,
            editable:
                (params) => {
                    return params.row?.isNew; // 새 행일 때만 편집 허용
                }
        },
        { field: 'user_email', headerName: 'Email', width: 210 },
        { field: 'user_nm', headerName: '이름', width: 100 },
        {
            field: 'department',
            headerName: '부서',
            width: 100,
            valueGetter: (params) => params.row.department?.dept_name || '',
            type: 'singleSelect',
            valueOptions: ['경영', '마케팅', '연구개발', '영업', '인사', '회계'],
        },
        {
            field: 'user_phone',
            headerName: '연락처',
            width: 180,
        },
    ]
    useEffect(() => {
        admin.noneAppHrList().then((res) => {
            console.log(res);
            setRows(res.data);
            if (res.data.length == 0) {
                dispatch(setBadge(true));
            } else {
                dispatch(setBadge(false));
            }
        });
    }, []);

    useEffect(() => {
        if (rows.length == 0) {
            dispatch(setBadge(true));
        } else {
            dispatch(setBadge(false));
        }
    }, [rows])

    const appHandler = () => {
        admin.updateAppHr(selectedRow).then((res) => {
            admin.noneAppHrList().then((res) => {
                setRows(res.data);
                enqueueSnackbar("승인이 완료되었습니다.", { variant: "info" });
                handleApp();
            });
        });
    }

    const rejHandler = () => {
        admin.deleteRejHr(selectedRow).then((res) => {
            admin.noneAppHrList().then((res) => {
                setRows(res.data);
                enqueueSnackbar("반려가 완료되었습니다.", { variant: "error" });
            })
        })
    }
    return (<>

        <BootstrapDialog onClose={closeModal} aria-labelledby="customized-dialog-title" open={open} maxWidth={'870px'}>
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
                    minWidth: '850px',
                    minHeight: '500px',
                    maxHeight: '900px',
                    overflow: 'hidden'
                }}
            >
                <Grid container direction={'column'} spacing={2}>
                    <Grid item container sx={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ height: 480, width: '98%', margin: 'auto' }}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                hideFooter
                                checkboxSelection
                                getRowId={(row) => row.user_id}
                                onRowSelectionModelChange={(ids) => setSelectedRow(ids)}
                                sx={{
                                    border: '2px solid #c0c0c0',
                                    '& .css-qvtrhg-MuiDataGrid-virtualScroller': {
                                        overflow: 'auto',
                                        scrollbarWidth: 'none',
                                        '&::-webkit-scrollbar': {
                                            width: '8px', /* 스크롤 바의 너비 */
                                            height: '8px', /* 스크롤 바의 높이 */
                                            backgroundColor: '#f0f0f0' /* 스크롤 바의 배경색 */
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: '#777777'
                                        },
                                        '&-ms-overflow-style:': {
                                            display: 'none'
                                        }
                                    },
                                    '& .selected-row': {
                                        backgroundColor: '#f0f0f0'
                                    },
                                    '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
                                        outline: 'none !important'
                                    }
                                }}
                                slotProps={{
                                    toolbar: {},
                                }}
                            />
                        </div>
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
                    }}
                        onClick={() => appHandler()}>
                        승인
                    </Button>
                    <Button variant="contained" autoFocus sx={{
                        backgroundColor: '#D32F2F', marginLeft: 1,
                        '&:hover': {
                            backgroundColor: '#F44336', // hover 시 적용할 색상
                        }
                    }}
                        onClick={() => rejHandler()}>
                        반려
                    </Button>
                </Box>
            </DialogActions>
        </BootstrapDialog>
    </>);
}

export default AMModal;