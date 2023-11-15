import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { StatusChip1, StatusChip2, StatusChip3, StatusChip4, StatusChip5, StatusChip6 } from './StatusChips';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedRow, resetSelectedRow, selectedRowSelector } from 'store/selectedRowSlice';
import { setJobReqNo } from 'store/jobReqNoSlice';
import { jobReqNoSelector } from 'store/jobReqNoSlice';
import { useRef, useImperativeHandle, forwardRef } from 'react';
import CircleIcon from '@mui/icons-material/Circle';
import { Typography } from '@mui/material';
import { typography } from '@mui/system';
import { async } from 'q';

const StyledDataGrid = styled(DataGrid)(() => ({
  border: '1px solid #c0c0c0',
  '& .css-qvtrhg-MuiDataGrid-virtualScroller': {
    overflow: 'auto',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
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
}));

const ReqDataGrid = forwardRef(
  ({ rows, setRows, postStatusData, handleCombinedSearch, selectedChips, startDate, endDate, searchKeyword, defaultRow }, ref) => {
    const dispatch = useDispatch();
    const selectedRow = useSelector(selectedRowSelector);
    const jobReqNo = useSelector(jobReqNoSelector);
    const userId = useSelector((state) => state.userInfo.user_id);

    useEffect(() => {
      if (userId === 'admin') dispatch(setSelectedRow(defaultRow));
    }, [userId, dispatch.defaultRow]);

    const getRowClassName = (params) => {
      const isSelected = selectedRow && selectedRow.job_req_no === params.row.job_req_no;
      return isSelected ? 'selected-row' : '';
    };

    const handleRowClick = async (job_req_no) => {
      try {
        const response = await axios.get(`http://localhost:8888/admin/hire/jobreq/${job_req_no}`);

        dispatch(setSelectedRow(response.data));
        //console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const handleCheckedRowsDelete = async () => {
      try {
        const response = await axios.delete('http://localhost:8888/admin/hire/delete/checked', { data: { jobReqNo } });

        console.log(response);

        // const statusData = { selectedStatus: selectedChips };
        // const responseData = await postStatusData(statusData);
        // setRows(responseData);
        const searchData = await handleCombinedSearch(startDate, endDate, searchKeyword, selectedChips, userId);
        setRows(searchData);
        dispatch(resetSelectedRow());
      } catch (error) {
        console.error(error);
      }
    };

    const handleCheckedRowsUpdateStatus = async (reqStatus) => {
      console.log(reqStatus);
      const updateData = {
        jobReqs: jobReqNo.map((jobReqNo) => ({
          job_req_no: jobReqNo,
          req_status: reqStatus
        }))
      };
      console.log(updateData);
      try {
        const response = await axios.put('http://localhost:8888/admin/hire/update/status', updateData);

        console.log(response);

        const searchData = await handleCombinedSearch(startDate, endDate, searchKeyword, selectedChips, userId);
        setRows(searchData);
        dispatch(resetSelectedRow());
      } catch (error) {
        console.error(error);
      }
    };

    useImperativeHandle(ref, () => ({
      handleCheckedRowsDelete,
      handleCheckedRowsUpdateStatus
    }));

    const columns = [
      {
        field: 'job_req_date',
        headerName: '요청일자',
        width: 100,
        headerAlign: 'left',
        align: 'left',
        valueGetter: (params) => {
          const timestamp = params.value;
          const dateObject = dayjs(timestamp);
          const formattedDate = dateObject.format('YYYY-MM-DD');
          return formattedDate;
        }
      },
      { field: 'req_title', headerName: '제목', width: 200, headerAlign: 'left', align: 'left' },
      { field: 'job_group', headerName: '직군', width: 100, headerAlign: 'left', align: 'left' },
      { field: 'job_role', headerName: '직무', width: 120, headerAlign: 'left', align: 'left' },
      {
        field: 'req_status',
        headerName: '상태',
        width: 150,
        headerAlign: 'left',
        align: 'left',
        // renderCell: (params) => {
        //   const status = params.row.req_status;
        //   switch (status) {
        //     case '작성중':
        //       return <StatusChip1 label={status} variant="selected" />;
        //     case '요청완료':
        //       return <StatusChip2 label={status} variant="selected" />;
        //     case '승인':
        //       return <StatusChip3 label={status} variant="selected" />;
        //     case '반려':
        //       return <StatusChip4 label={status} variant="selected" />;
        //     case '공고중':
        //       return <StatusChip5 label={status} variant="selected" />;
        //     case '공고종료':
        //       return <StatusChip6 label={status} variant="selected" />;
        //   }
        // }
        renderCell: (params) => {
          const status = params.row.req_status;
          switch (status) {
            case '작성중':
              return (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CircleIcon fontSize="16px" style={{ color: '#FFBD33', marginRight: '8px' }} />
                  <Typography>{status}</Typography>
                </div>
              );
            case '요청완료':
              return (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CircleIcon fontSize="16px" style={{ color: '#D18AC7', marginRight: '8px' }} />
                  <Typography>{status}</Typography>
                </div>
              );
            case '승인':
              return (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CircleIcon fontSize="16px" style={{ color: '#7EBF6F', marginRight: '8px' }} />
                  <Typography>{status}</Typography>
                </div>
              );
            case '반려':
              return (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CircleIcon fontSize="16px" style={{ color: '#EC5C87', marginRight: '8px' }} />
                  <Typography>{status}</Typography>
                </div>
              );
            case '공고중':
              return (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CircleIcon fontSize="16px" style={{ color: '#5092E2', marginRight: '8px' }} />
                  <Typography>{status}</Typography>
                </div>
              );
            case '공고종료':
              return (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CircleIcon fontSize="16px" style={{ color: '#809B95', marginRight: '8px' }} />
                  <Typography>{status}</Typography>
                </div>
              );
          }
        }
      }
    ];

    return (
      <div style={{ height: 590, width: '98%', margin: 'auto' }}>
        <StyledDataGrid
          rows={rows}
          columns={columns}
          hideFooter
          checkboxSelection
          disableRowSelectionOnClick
          getRowId={(row) => row.job_req_no}
          onRowClick={(row) => {
            console.log(row);
            handleRowClick(row.row.job_req_no);
          }}
          getRowClassName={getRowClassName}
          onRowSelectionModelChange={(rows) => {
            console.log(rows);
            dispatch(setJobReqNo(rows));
          }}
        />
      </div>
    );
  }
);

export default ReqDataGrid;
