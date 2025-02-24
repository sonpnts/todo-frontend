import axios from "axios";

// export const BASE_URL = 'http://192.168.1.8:8080/';

export const formatNS= (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
};


export const BASE_URL = 'https://todo-09z1.onrender.com'

export const endpoints = {
    'tasks': '/tasks/',

}

export default axios.create({
    baseURL: BASE_URL
});