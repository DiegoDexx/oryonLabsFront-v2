//use fetch permite hacer peticiones a una API

import { useState, useEffect } from 'react';

import axiosInstance from '../utils/axiosInstance';


export const useGet = (url, token) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axiosInstance.get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.status !== 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const result = response.data; // Changed from response.json() to response.data
          setData(result);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [url, token]);
  
    return { data, loading, error };
  };


export const usePost = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const post = async (url, body, token) => {
        setLoading(true);
        try {
            const headers = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            } else {
                delete headers['Authorization'];
            }
            const response = await axiosInstance.post(url, body, { headers });
            setData(response.data);
            return response;
        } catch (e) {
            setError(e);
            throw e
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, post };
};


export const usePut = () => {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const put = async (url, body, token) => {
        setLoading(true);
        try { 
            const response = await axiosInstance.put(url, body, 
                {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }

            ); //with tokenbs
            setData(response.data);
            return response; // Return the response data
        } catch (e) {
    
            setError(e);
            throw e; // Return the error response data
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, put };
}
export const useDelete = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteRequest = async (url, token) => {
    setLoading(true);
    try {
      const response = await axiosInstance.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data);
      return response; // <-- IMPORTANTE: devolver la response
    } catch (e) {
      setError(e);
      throw e; // <-- para que apiActions pueda atraparlo
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, deleteRequest };
};

//exports fetch data 
export default { useGet, usePost, usePut, useDelete };





