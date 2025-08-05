

import React, { useState } from 'react'
import { useRef } from 'react';
import Input from './Input';
import { Trash, Upload,  User } from 'lucide-react';

const ProfilePhotoSelector = ({image,setImage}) => {
    const inputRef=useRef(null);
    const [previewUrl,setPreviewUrl]=useState(null);
    const handleImageChange=(e)=>{
       const file = e.target.files[0];
       if(file)
       {
        setImage(file);

        const preview=URL.createObjectURL(file);
        setPreviewUrl(preview);
       }
    }

    const handleRemoveImage=(e)=>{
        e.preventDefault();
        setImage(null);
        setPreviewUrl(null);

    }

    const onChooseFile=(e)=>{
        e.preventDefault();
        inputRef.current.click();
    }
  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <div className="w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full relative">
          <User className="text-purple-500" size={35} />

          <button
            onClick={onChooseFile}
            className="w-6 h-6 flex items-center justify-center bg-purple-500 text-white rounded-full absolute -bottom-1 -right-1"
          >
            <Upload className="text-white" size={15} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl}
            className="w-20 h-20 rounded-full"
            alt="profile photo"
          />
          <button
            onClick={handleRemoveImage}
            className="w-8 h-8 flex items-center justify-center bg-red-800 text-white rounded-full "
          >
            <Trash size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfilePhotoSelector;