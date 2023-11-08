import { styled } from '@mui/material/styles';
import { admin } from 'api';
import { useState } from 'react';
import { useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    GridRowModes,
    DataGrid,
    GridToolbar,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from '@mui/x-data-grid';
import {
    randomId,
} from '@mui/x-data-grid-generator';
import { useImperativeHandle } from 'react';
import { forwardRef } from 'react';

const AMDataGrid = forwardRef((props, ref) => {
    const [rows, setRows] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});

    useImperativeHandle(ref, () => {
        return {
            addHandler: () => {
                handleClick()
            }
        }
    })



    const handleClick = () => {
        const id = randomId();
        setRows((oldRows) => [{ id: id, user_id: '', user_email: '', user_nm: '', role: 'HR', user_phone: '', department: '', isNew: true }, ...oldRows]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'user_id' },
        }));
    };

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
        console.log(params.reason);
    };

    const handleEditClick = (id) => () => {
        console.log(rowModesModel);
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
        console.log(rowModesModel);
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow) => {
        console.log(newRow);
        if (newRow.user_email === '' && newRow.user_id !== '') {
            newRow.user_email = `${newRow.user_id}@douzone.kr`;
        }
        let updatedRow = {};
        if (newRow.isNew) {
            updatedRow = {
                ...newRow,
                department: { dept_name: newRow.department }, isNew: false
            };
        } else {
            updatedRow = {
                ...newRow,
                department: { dept_name: newRow.department }, isNew: false
            };
        }
        console.log(updatedRow);
        //const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        console.log(newRowModesModel);
        setRowModesModel(newRowModesModel);
    };



    const columns = [
        {
            field: 'user_id', headerName: 'ID', width: 180, editable: (params) => {
                return params.row?.isNew || true; // 새 행일 때만 편집 허용
            }
        },
        { field: 'user_email', headerName: 'Email', width: 290, editable: true },
        { field: 'user_nm', headerName: '이름', width: 150, editable: true },
        {
            field: 'role', headerName: '역할', width: 180,
            valueGetter: (params) => {
                const role = params.row?.role
                if (role === 'HR') {
                    return '인사담당자';
                } else if (role === 'ADMIN') {
                    return '관리자';
                } else {
                    return '지원자';
                }
            }
        },
        {
            field: 'department',
            headerName: '부서',
            width: 150,
            valueGetter: (params) => params.row.department?.dept_name || '',
            editable: true,
            type: 'singleSelect',
            valueOptions: ['경영', '마케팅', '연구개발', '영업', '인사', '회계'],
        },
        {
            field: 'user_phone',
            headerName: '연락처',
            width: 220,
            editable: true,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: '',
            width: 100,
            flex: 0.5,
            cellClassName: 'actions',
            justifyContent: 'flex-end',
            alignSelf: 'auto',
            align: 'right',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    console.log(id);
                    return [
                        <GridActionsCellItem
                            key={"save"}
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            key={"cancel"}
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        key={'Edit'}
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        key={'del'}
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },

    ]


    useEffect(() => {
        admin.hrList().then((res) => {
            console.log(res.data);
            const rows = res.data.map((row) => {
                const id = randomId();
                row.id = row.id ?? id;
                //row.isNew = row.isNew ?? false;
                return row;
            })
            setRows(rows);
        })
    }, [])

    const handleCellChange = (params) => {
        console.log(params.rowId, params.columnId, params.oldValue, params.newValue);
    };
    const handleRowEditStart = (params, event) => {
        console.log(params);
    };


    return (
        <div style={{ height: 700, width: '98%', margin: 'auto' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                hideFooter
                disableRowSelectionOnClick
                editMode="row"
                //getRowId={(row) => row.user_id}
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStart={handleRowEditStart}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
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
    );

})

export default AMDataGrid;