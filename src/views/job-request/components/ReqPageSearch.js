import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const ReqPageSearch = ({ value, handleSearchInputChange }) => {
  const [groups, setGroups] = useState([]);
  const [roles, setRoles] = useState([]);

  const SearchAutoComplete = styled(Autocomplete)(() => ({
    '& .MuiOutlinedInput-root': {
      padding: '2.5px'
    }
  }));

  useEffect(() => {
    axios
      .get('http://localhost:8888/admin/hire/reqlist')
      .then((response) => {
        const roleSet = new Set();
        const groupSet = new Set();

        response.data.forEach((item) => {
          if (item.job_role) {
            roleSet.add(item.job_role);
          }
          if (item.job_group) {
            groupSet.add(item.job_group);
          }
        });

        const newRoles = Array.from(roleSet);
        const newGroups = Array.from(groupSet);

        setRoles(newRoles);
        setGroups(newGroups);
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      });
  }, []);

  return (
    <SearchAutoComplete
      sx={{ width: '250px' }}
      freeSolo
      options={[...groups, ...roles]}
      getOptionLabel={(option) => option}
      value={value}
      onChange={(event, value) => {
        console.log(value);
        handleSearchInputChange(value);
      }}
      renderInput={(params) => <TextField {...params} placeholder="직군, 직무 검색" variant="outlined" name="search" />}
      filterOptions={(options, params) => {
        const filteredOptions = options.filter(
          (option) => option.toLowerCase().includes(params.inputValue.toLowerCase()) && params.inputValue.length > 1
        );

        return filteredOptions;
      }}
    />
  );
};

export default ReqPageSearch;
