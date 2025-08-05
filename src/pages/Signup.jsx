import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import Input from '../components/Input';
import { validateEmail } from '../util/validation';
import axiosConfig from '../util/axiosConfig';
import toast from 'react-hot-toast';
import { LoaderCircle } from 'lucide-react';
import { API_ENDPOINTS } from "../util/apiEndpoints";
import ProfilePhotoSelector from '../components/ProfilePhotoSelector';
import uploadProfileImage from '../util/uploadProfileImage';
const Signup = () => {

  const [fullName, setFullName]=useState("");
  const [email, setEmail]=useState("");
  const [password, setPassword]=useState("");
  const [error,setError]=useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const navigate= useNavigate();

  const handleSubmit=async(e)=>{
    e.preventDefault();
    let profileImageUrl="";
    setIsLoading(true);

    if(!fullName.trim())
    {
      setError("Please enter your fullname ");
      setIsLoading(false);
      return;
    }
    
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

    //SIGNUP API CALL

    try {
      if(profilePhoto)
      {
       const imageUrl = await uploadProfileImage(profilePhoto);
       profileImageUrl=imageUrl || "";
      }
      const response =await axiosConfig.post(API_ENDPOINTS.REGISTER,
        {
          fullName,
          email,
          password,
          profileImageUrl
        }
      )

      if(response.status===201)
      {
        toast.success("Profile created successfully");
        navigate("/login")
      }
      
    } catch (error) {

      console.error("something went worng",error);
      setError(error.message);
      
    }
    finally{
      setIsLoading(false);
    }

  }
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
            Create an account
          </h3>
          <p className="text-sm text-slate-700 text-center mb-2">
            Start tracking your expenses and stay on top of your finances
          </p>

          <form
          onSubmit={handleSubmit} 
          className="space-y-4">
            <div className="flex justify-center mb-6">
              <ProfilePhotoSelector image={profilePhoto} setImage={setProfilePhoto}/>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
              />

              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email address"
                type="text"
                placeholder="example@gmail.com"
              />

              <div className="col-span-2">
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  label="password"
                  type="password"
                  placeholder="*******"
                />
              </div>
            </div>
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
              <LoaderCircle className='aniamte-spin w-5 h-5'/>
              Signing up...
              </>
             ):(
              "SIGN UP"
             )}
            </button>

            <p className="text-sm text-slate-800 text-center mt-6">
              Already have an account?
              <Link
                to="/login"
                className="font-medium text-primary underline hover:text-primary-dark transition-colors"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;