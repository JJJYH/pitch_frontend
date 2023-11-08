import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography,
    useMediaQuery,
    Paper,
    Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import AMDataGrid from './components/AMDataGrid';
import { useRef } from 'react';

const AdminManagePage = () => {

    const ref = useRef();

    const StyledBox = styled(Box)(() => ({
        margin: '10px',
        borderRadius: '4px',
        // border: '3px solid #f0f0f0',
        border: '1px solid #c0c0c0',
        height: 680,
        overflow: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
            display: 'none'
        },
        '&-ms-overflow-style:': {
            display: 'none'
        }
    }));



    return (
        <Paper sx={{ height: 1 }}>
            <Box sx={{ height: '140px' }}>
                <Typography sx={{ color: '#364152', padding: '35px 0px 20px 20px' }} variant="h2">
                    권한 관리
                </Typography>
                <Box sx={{ padding: '0px 20px' }}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Grid container spacing={1}>
                                <Grid item sx={{ marginLeft: '4px' }}>
                                    <TextField
                                        size='small'
                                    />
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        style={{ height: '38px', minWidth: '40px', width: '40px', backgroundColor: '#38678f' }}
                                    >
                                        <SearchIcon fontSize="small" />
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Stack direction="row" spacing={1} marginRight={1}>
                                <Button variant="contained" style={{ backgroundColor: '#38678f ' }} onClick={() => ref.current.addHandler()}>
                                    추가
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Grid container sx={{ padding: '0px 10px' }}>
                <Grid item xs={12}>
                    {/* <StyledBox>
                        <Grid container direction="column">
                            <Grid item p={2}>
                                <Grid container justifyContent="space-between">
                                    <Grid item pl={1}>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Box
                                    sx={{
                                        height: 590,
                                        width: '96%',
                                        margin: 'auto'
                                    }}
                                >
                                </Box>
                            </Grid>
                        </Grid>
                    </StyledBox> */}
                    <AMDataGrid ref={ref} />
                </Grid>
            </Grid>
        </Paper>
    );
}

export default AdminManagePage;