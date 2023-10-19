import * as React from 'react';
//import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
//import Collapse from '@mui/material/Collapse';
//import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
//import Paper from '@mui/material/Paper';
//import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
//import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Checkbox from '@mui/material/Checkbox';
//import Card from '@mui/material/Card';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
//import ButtonGroup from '@mui/material/ButtonGroup';
import RequestModal from './RequestModal';
import { styled } from '@mui/material/styles';
import ReadReq from './ReadReq';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import { Paper } from '@mui/material';
//import { TextField } from '@mui/material';



function createData(date, title, job_role, status,) {
    return {
        date,
        title,
        job_role,
        status
    };
}


const rows = [
    createData('2023-10-17', '채용요청서1', '직무1', '작성중'),
    createData('2023-10-17', '채용요청서2', '직무2', '요청완료'),
    createData('2023-10-17', '채용요청서11', '직무1', '작성중'),
    createData('2023-10-17', '채용요청서3', '직무3', '승인'),
    createData('2023-10-17', '채용요청서4', '직무4', '공고중'),
    createData('2023-10-17', '채용요청서5', '직무5', '공고종료'),
    createData('2023-10-17', '채용요청서6', '직무5', '반려'),
];



export default function ReqTable() {
    const [open, setOpen] = React.useState(false);
    const [selectedChips, setSelectedChips] = React.useState([]);
    const [filteredRows, setFilteredRows] = React.useState(rows); // 1. filteredRows 추가

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const MyTable = styled(TableContainer)(() => ({
        padding: '0px 10px',
        height: 660,
        overflow: "auto",
        scrollbarWidth: "none",
        '&::-webkit-scrollbar': {
            display: 'none',
        },
        '&-ms-overflow-style:': {
            display: 'none',
        },

    }));

    const TableBox = styled(Box)(() => ({
        margin: '5px 5px',
        borderRadius: '8px',
        border: '3px solid #eef2f6',
        height: 640,
        overflow: "auto",
        scrollbarWidth: "none",
        '&::-webkit-scrollbar': {
            display: 'none',
        },
        '&-ms-overflow-style:': {
            display: 'none',
        },

    }));

    const StatusChip1 = styled(Chip)(() => ({
        border: '3px solid',
        borderColor: '#FFD699',
        color: '#FFD699',
        fontWeight: 900,
        '&.Mui-selected': {
            backgroundColor: '#FFD699',
            color: '#fff',
        },
        minWidth:'85px',
        width: '85px'
    }));

    const StatusChip2 = styled(Chip)(() => ({
        border: '3px solid',
        borderColor: '#E1BEE7',
        color: '#E1BEE7',
        fontWeight: 900,
        '&.Mui-selected': {
            backgroundColor: '#E1BEE7',
            color: '#fff',
        },
        minWidth:'85px',
        width: '85px'
    }));

    const StatusChip3 = styled(Chip)(() => ({
        border: '3px solid',
        borderColor: '#A5D6A7',
        color: '#A5D6A7',
        fontWeight: 900,
        '&.Mui-selected': {
            backgroundColor: '#A5D6A7',
            color: '#fff',
        },
        minWidth:'85px',
        width: '85px'
    }));

    const StatusChip4 = styled(Chip)(() => ({
        border: '3px solid',
        borderColor: '#F48FB1',
        color: '#F48FB1',
        fontWeight: 900,
        '&.Mui-selected': {
            backgroundColor: '#F48FB1',
            color: '#fff',
        },
        minWidth:'85px',
        width: '85px'
    }));

    const StatusChip5 = styled(Chip)(() => ({
        border: '3px solid',
        borderColor: '#90CAF9',
        color: '#90CAF9',
        fontWeight: 900,
        '&.Mui-selected': {
            backgroundColor: '#90CAF9',
            color: '#fff',
        },
        minWidth:'85px',
        width: '85px'
    }));

    const StatusChip6 = styled(Chip)(() => ({
        border: '3px solid',
        borderColor: '#B0BEC5',
        color: '#B0BEC5',
        fontWeight: 900,
        '&.Mui-selected': {
            backgroundColor: '#B0BEC5',
            color: '#fff',
        },
        minWidth:'85px',
        width: '85px'
    }));


    const handleChipClick = (status) => {
        const newSelectedChips = [...selectedChips];
        const statusIndex = selectedChips.indexOf(status);

        if (statusIndex === -1) {
            newSelectedChips.push(status);
        } else {
            newSelectedChips.splice(statusIndex, 1);
        }

        setSelectedChips(newSelectedChips);

        const newFilteredRows = rows.filter(row => newSelectedChips.includes(row.status) || newSelectedChips.length === 0);
        setFilteredRows(newFilteredRows);
    };


    return (
        <>
            <Paper sx={{
                height: 1

            }}>
                <Box sx={{
                    // border: '1px solid',
                    height: '140px'
                }}>
                <Typography sx={{ color: '#757575', padding: '40px 0px 20px 20px' }} variant="h2"><TaskOutlinedIcon/> 채용 요청 관리</Typography>

                <Box sx={{ padding: '0px 20px' }}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Grid container spacing={2}>
                                <Typography sx={{ marginTop: '28px', marginLeft: '20px' }}>신청일자</Typography>
                                <Grid item>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker slotProps={{ textField: { size: 'small' } }} />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item>
                                    <p>~</p>
                                </Grid>
                                <Grid item>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker slotProps={{ textField: { size: 'small' } }} />
                                    </LocalizationProvider>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                        </Grid>
                    </Grid>
                </Box>
                </Box>

                <Box sx={{
                    // border: '1px solid'
                }}>
                <Grid container sx={{ padding: '0px 10px' }}>
                    <Grid item xs={6}>
                        <TableBox>
                            <Grid container direction='column'>
                                <Grid item pt={2} pl={2} pr={2}>
                                    <Grid container justifyContent="space-between">
                                    <Grid item>
                                            <Stack direction="row">
                                                <Button size="small" variant="error" onClick={handleClickOpen}>등록</Button>
                                                <RequestModal open={open} handleClose={handleClose} />
                                                <Button size="small" variant="error">삭제</Button>
                                            </Stack>
                                        </Grid>
                                        <Grid item>
                                            <Stack direction="row" spacing={1}>
                                                <StatusChip1
                                                    label="작성중"
                                                    variant={selectedChips.includes('작성중') ? "selected" : "outlined"}
                                                    onClick={() => handleChipClick('작성중')}
                                                />
                                                <StatusChip2
                                                    label="요청완료"
                                                    variant={selectedChips.includes('요청완료') ? "selected" : "outlined"}
                                                    onClick={() => handleChipClick('요청완료')}
                                                />
                                                <StatusChip3
                                                    label="승인"
                                                    variant={selectedChips.includes('승인') ? "selected" : "outlined"}
                                                    onClick={() => handleChipClick('승인')}
                                                />
                                                <StatusChip4
                                                    label="반려"
                                                    variant={selectedChips.includes('반려') ? "selected" : "outlined"}
                                                    onClick={() => handleChipClick('반려')}
                                                />
                                                <StatusChip5
                                                    label="공고중"
                                                    variant={selectedChips.includes('공고중') ? "selected" : "outlined"}
                                                    onClick={() => handleChipClick('공고중')}
                                                />
                                                <StatusChip6
                                                    label="공고종료"
                                                    variant={selectedChips.includes('공고종료') ? "selected" : "outlined"}
                                                    onClick={() => handleChipClick('공고종료')}
                                                />
                                            </Stack>
                                        </Grid>

                                        
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <MyTable>
                                        <Table stickyHeader aria-label="basic table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>
                                                        <Checkbox />
                                                    </TableCell>
                                                    <TableCell>요청일자</TableCell>
                                                    <TableCell>제목</TableCell>
                                                    <TableCell>직무</TableCell>
                                                    <TableCell align='center'>상태</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {filteredRows.map((row) => (
                                                    <TableRow key={row.title}>
                                                        <TableCell>
                                                            <Checkbox />
                                                        </TableCell>
                                                        <TableCell >{row.date}</TableCell>
                                                        <TableCell >
                                                            {row.title}
                                                        </TableCell>
                                                        <TableCell>{row.job_role}</TableCell>
                                                        {/* <TableCell align='center'><Chip label={row.status} variant="outlined" /></TableCell> */}
                                                        <TableCell align='center'>
                                                            {row.status === '작성중' && (
                                                                <StatusChip1 label={row.status} variant="selected" />
                                                            )}
                                                            {row.status === '요청완료' && (
                                                                <StatusChip2 label={row.status} variant="selected" />
                                                            )}
                                                            {row.status === '승인' && (
                                                                <StatusChip3 label={row.status} variant="selected" />
                                                            )}
                                                            {row.status === '반려' && (
                                                                <StatusChip4 label={row.status} variant="selected" />
                                                            )}
                                                            {row.status === '공고중' && (
                                                                <StatusChip5 label={row.status} variant="selected" />
                                                            )}
                                                            {row.status === '공고종료' && (
                                                                <StatusChip6 label={row.status} variant="selected" />
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                            <TableFooter></TableFooter>
                                        </Table>
                                    </MyTable>
                                </Grid>
                            </Grid>
                        </TableBox>
                    </Grid>
                    <Grid item xs={6}>
                        <TableBox>
                            <ReadReq />
                        </TableBox>
                    </Grid>
                </Grid>
                </Box>
            </Paper>
        </>

    );
}
