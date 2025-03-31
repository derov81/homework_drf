import axios from "axios";

export const getDataOrder = async (path) =>{
    try {
    const response = await axios.get(path);
    return response.data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    throw error;
  }
};

export const getDataDetails = async (path) =>{
    try {
    const response = await axios.get(path);
    return response.data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    throw error;
  }
};