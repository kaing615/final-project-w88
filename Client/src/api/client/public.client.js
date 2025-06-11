import axios from 'axios';
import queryString from 'query-string';

const baseURL = "http://127.0.0.1:5050/api/v1";

const publicClient = axios.create({
    baseURL,
    paramsSerializer: {
        encode: params => queryString.stringify(params)
    }
});

publicClient.interceptors.request.use(
    async (config) => {
        config.headers = {
            ...config.headers,
            'Content-Type': 'application/json'
        };
        return config;
    },
    (error) => Promise.reject(error)
);

publicClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    (error) => {
        throw error.response.data;
    }
);

export default publicClient;
