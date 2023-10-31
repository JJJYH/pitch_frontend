import axios from 'axios';

export const handleCombinedSearch = async (startDate, endDate, searchKeyword, selectedStatus) => {
  try {
    const response = await axios.post('http://localhost:8888/admin/hire/search', {
      startDate,
      endDate,
      searchKeyword,
      selectedStatus
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
