import axios from "axios";
import { BASE_URL } from "./apiEndpoints";

const axiosConfig = axios.create({
  baseURL: BASE_URL,
  headers:{
    "Content-Type": "application/json",
    Accept:"application/json"
  }
});


// do not require authorization header
const excludeEndpoints=["/login","/register","/staus","/activate","/health"];



// request interceptor
axiosConfig.interceptors.request.use((config)=>{
    const shouldSkipToken=excludeEndpoints.some((endpoint)=>{
       return config.url?.includes(endpoint);
    });

    if(!shouldSkipToken)
    {
        const accessToken =localStorage.getItem("token");
        if(accessToken)
        {
            config.headers.Authorization=`Bearer ${accessToken}`;
        }
    }

    return config;
},(error)=>{
    return Promise.reject(error);
});


// response interceptor
axiosConfig.interceptors.response.use((response)=>{
    return response;
},(error)=>{
    if(error.response){
        if(error.response.status===401){
            window.location.href="/login";
        }
        else if(error.response.status==500)
        {
            console.error("server error . please try again later");


        }
    }
    else if(error.code==="ECONNABORTED")
    {
        console.log("request timeout")
    }

    return Promise.reject(error);
})

export default axiosConfig;