import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';

const MainPageSearch = ({ value, handleSearchInputChange }) => {
  const [groups, setGroups] = useState([]);
  const [roles, setRoles] = useState([]);

  const SearchAutoComplete = styled(Autocomplete)(() => ({
    '& .MuiOutlinedInput-root': {
      padding: '7px'
    }
  }));

  useEffect(() => {
    axios
      .get('http://localhost:8888/admin/hire/getAllJobPostingList')
      .then((response) => {
        console.log(response.data);
        const roleSet = new Set();
        const groupSet = new Set();

        response.data.forEach((item) => {
          if (item.jobReq.job_role) {
            roleSet.add(item.jobReq.job_role);
          }
          if (item.jobReq.job_group) {
            groupSet.add(item.jobReq.job_group);
          }
        });

        const newRoles = Array.from(roleSet);
        const newGroups = Array.from(groupSet);

        setRoles(newRoles);
        setGroups(newGroups);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <SearchAutoComplete
      sx={{ width: '350px', mb: 2 }}
      freeSolo
      options={[...groups, ...roles]}
      getOptionLabel={(option) => option}
      value={value}
      onChange={(event, value) => {
        console.log(value);
        handleSearchInputChange(value);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="직군, 직무 검색"
          variant="outlined"
          name="search"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {params.InputProps.endAdornment}
                <SearchIcon />
              </>
            )
          }}
        />
      )}
      filterOptions={(options, params) => {
        const filteredOptions = options.filter(
          (option) => option.toLowerCase().includes(params.inputValue.toLowerCase()) && params.inputValue.length > 1
        );

        return filteredOptions;
      }}
    />
  );
};

export default MainPageSearch;
