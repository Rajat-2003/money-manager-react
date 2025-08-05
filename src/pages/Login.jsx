import React, { use, useContext } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { assets } from "../assets/assets";
import { validateEmail } from "../util/validation";

import Input from '../components/Input';
import axiosConfig from '../util/axiosConfig';
import { API_ENDPOINTS } from '../util/apiEndpoints';
import { AppContext } from '../context/AppContext';
import { LoaderCircle } from 'lucide-react';
const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {setUser}=useContext(AppContext);

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setIsLoading(true);
    if (!validateEmail(email)) {
          setError("Please enter a valid email");
          setIsLoading(false);
          return;
        }
    
        if (!password.trim()) {
          setError("Please enter your password");
          setIsLoading(false);
          return;
        }

        setError("");

        // LOGIN API CALL

        try {
          const response = await axiosConfig.post(API_ENDPOINTS.LOGIN, {
            email,
            password,
          });

          const {token,user}=response.data;
          if(token)
          {
            localStorage.setItem("token",token);
            setUser(user);
            navigate("/dashboard");
          }
        } catch (error) {
          if(error.response && error.response.message)
          {
            setError(error.response.data.message);
          }else{
          console.error("something went wrong",error)
          setError(error.message);
          }
          
        }
        finally{
          setIsLoading(false);
        }

  }
  const navigate =useNavigate();
  return (
    <div className="h-screen w-full relative flex items-center justify-center overflow-hidden bg-gray-900">
      {/*background image*/}
      <img
        src={assets.login_bg}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="relative z-10 w-full max-w-lg px-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-h-[90vh] overflow-y-auto ">
          <h3 className="text-2xl font-semibold text-black text-center mb-2">
            Welcome back
          </h3>
          <p className="text-sm text-slate-700 text-center mb-2">
            Please enter your email and password to login
          </p>

          <form
          onSubmit={handleSubmit}
          className="space-y-4">
              

              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email address"
                type="text"
                placeholder="example@gmail.com"
              />

                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  label="password"
                  type="password"
                  placeholder="*******"
                />
            
            
            {error && (
              <p className="text-red-800 text-sm text-center bg-red-50 p-2 rounded">
                {error}
              </p>
            )}

            <button
            disabled={isLoading}
              className="w-full py-3 text-lg font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition duration-200"
              type="submit"
            >
              {isLoading?(
                <>
                <LoaderCircle  className='animate-spin w-5 h-5'/>
                Loggin in...
                </>
              ):
              (
                "LOGIN"
              )}
            </button>

            <p className="text-sm text-slate-800 text-center mt-6">
              Don't have an account?
              <Link
                to="/signup"
                className="font-medium text-primary underline hover:text-primary-dark transition-colors"
              >
                Signup
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;