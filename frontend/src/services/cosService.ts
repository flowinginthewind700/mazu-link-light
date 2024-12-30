// src/services/cosService.ts
import axios from "axios";

export const getFilesAndFolders = async (directory: string) => {
    try {
      console.log(`Requesting getFilesAndFolders for directory: ${directory}`);
      const response = await axios.get(`/api/cos`, {
        params: { action: 'getFilesAndFolders', path: directory }
      });
      console.log(`Response Data: ${JSON.stringify(response.data)}`);
      
      // 确保返回一个数组
      const files = response.data.Contents || [];
      const folders = response.data.CommonPrefixes || [];
      return [...folders, ...files];
    } catch (error) {
      console.error(`Error in getFilesAndFolders: ${(error as Error).message}`);
      throw error;
    }
  };

export const getTags = async (filePath: string) => {
  try {
    console.log(`Requesting getTags for filePath: ${filePath}`);
    const response = await axios.get(`/api/cos`, {
      params: { action: 'getTags', path: filePath }
    });
    console.log(`Response Data: ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    console.error(`Error in getTags: ${(error as Error).message}`);
    throw error;
  }
};

export const getObject = async (filePath: string) => {
    try {
      console.log(`Requesting getObject for filePath: ${filePath}`);
      const response = await axios.get(`/api/cos`, {
        params: { action: 'getObject', path: filePath }
      });
      console.log(`Response Data: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      console.error(`Error in getObject: ${(error as Error).message}`);
      throw error;
    }
  };
