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
import { setJobPostingNo, jobPostingNoSelector } from 'store/jobPostingNoSlice';
import { useRef, useImperativeHandle, forwardRef } from 'react';
import CircleIcon from '@mui/icons-material/Circle';
import { Typography } from '@mui/material';

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

    useEffect(() => {
      //console.log(defaultRow);
      dispatch(setSelectedRow(defaultRow.jobReq));
      dispatch(setJobPostingNo(defaultRow.job_posting_no));
    }, []);

    const getRowClassName = (params) => {
      const isSelected = selectedRow && selectedRow.job_req_no === params.row.jobReq.job_req_no;
      return isSelected ? 'selected-row' : '';
    };

    const handleRowClick = async (job_req_no) => {
      try {
        const response = await axios.get(`http://localhost:8888/admin/hire/jobreq/${job_req_no}`);
        dispatch(setSelectedRow(response.data));
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const handleCheckedRowsDelete = async () => {
      try {
        const response = await axios.delete(`http://localhost:8888/admin/hire/delete/checked`, { data: { jobReqNo } });

        console.log(response);

        // const statusData = { selectedStatus: selectedChips };
        // const responseData = await postStatusData(statusData);
        // setRows(responseData);
        const searchData = await handleCombinedSearch(startDate, endDate, searchKeyword, selectedChips);
        setRows(searchData);
        dispatch(resetSelectedRow());
      } catch (error) {
        console.error(error);
      }
    };

    useImperativeHandle(ref, () => ({
      handleCheckedRowsDelete
    }));

    const columns = [
      {
        field: 'jobReq.posting_start',
        headerName: '공고시작',
        width: 150,
        headerAlign: 'center',
        align: 'center',
        valueGetter: (params) => {
          //console.log(params);
          const timestamp = params.row.jobReq.posting_start;
          const dateObject = dayjs(timestamp);
          const formattedDate = dateObject.format('YYYY-MM-DD');
          return formattedDate;
        }
      },

      {
        field: 'jobReq.req_title',
        headerName: '제목',
        width: 150,
        headerAlign: 'center',
        align: 'center',
        valueGetter: (params) => {
          const reqTitle = params.row.jobReq.req_title;
          return reqTitle;
        }
      },
      {
        field: 'jobReq.job_role',
        headerName: '직무',
        width: 150,
        headerAlign: 'center',
        align: 'center',
        valueGetter: (params) => {
          const jobRole = params.row.jobReq.job_role;
          return jobRole;
        }
      },
      {
        field: 'jobReq.req_status',
        headerName: '상태',
        width: 180,
        headerAlign: 'center',
        align: 'left',

        renderCell: (params) => {
          const status = params.row.jobReq.req_status;
          switch (status) {
            case '작성중':
              return (
                <div style={{ display: 'flex', alignItems: 'center', margin: '45px' }}>
                  <CircleIcon fontSize="16px" style={{ color: '#FFBD33', marginRight: '8px' }} />
                  <Typography>{status}</Typography>
                </div>
              );
            case '요청완료':
              return (
                <div style={{ display: 'flex', alignItems: 'center', margin: '45px' }}>
                  <CircleIcon fontSize="16px" style={{ color: '#D18AC7', marginRight: '8px' }} />
                  <Typography>{status}</Typography>
                </div>
              );
            case '승인':
              return (
                <div style={{ display: 'flex', alignItems: 'center', margin: '45px' }}>
                  <CircleIcon fontSize="16px" style={{ color: '#7EBF6F', marginRight: '8px' }} />
                  <Typography>{status}</Typography>
                </div>
              );
            case '반려':
              return (
                <div style={{ display: 'flex', alignItems: 'center', margin: '45px' }}>
                  <CircleIcon fontSize="16px" style={{ color: '#EC5C87', marginRight: '8px' }} />
                  <Typography>{status}</Typography>
                </div>
              );
            case '공고중':
              return (
                <div style={{ display: 'flex', alignItems: 'center', margin: '45px' }}>
                  <CircleIcon fontSize="16px" style={{ color: '#5092E2', marginRight: '8px' }} />
                  <Typography>{status}</Typography>
                </div>
              );
            case '공고종료':
              return (
                <div style={{ display: 'flex', alignItems: 'center', margin: '45px' }}>
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
          getRowId={(row) => row.job_posting_no}
          onRowClick={(row) => {
            console.log(row);
            dispatch(setJobPostingNo(row.row.job_posting_no));
            handleRowClick(row.row.jobReq.job_req_no);
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
