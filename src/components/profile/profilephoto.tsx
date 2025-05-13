import React, { useState, ChangeEvent } from 'react';
import { PencilLine } from "lucide-react";
import axios from "axios";
import { DJANGO_USER_ENDPOINT } from "@/config/defaults";

interface Track {
  art?: string;
  name?: string;
  // add other properties as needed
}

interface ProfilePhotoProps {
  spotifyId: string;
  track: string | null;
  editable: boolean
}

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ spotifyId, track, editable }) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [newPhoto, setNewPhoto] = useState<string | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file);
    if (file) {
      // For demonstration, update local state to preview the new photo.
      // In a real application, you'll likely upload the file to your server.

      const formData = new FormData();
      formData.append('profilePhoto', file);

      try {
        const res = await fetch('/api/upload-profile-photo', {
          method: 'POST',
          body: formData,
        });
        
        if (res.ok) {
          // Optionally, get the file URL from the response
          const data = await res.json();
          console.log('File uploaded successfully:', data.fileUrl);
          const updateUrl = `${DJANGO_USER_ENDPOINT}/get-user-profile/?spotifyId=${spotifyId}&pfp=${encodeURIComponent(data.fileUrl)}/`;
          console.log(updateUrl);
          const updateRes = await fetch(updateUrl, {
            method: 'PUT',
          });
          if (updateRes.ok) {
            console.log('Profile photo updated in the database.');
          } else {
            console.error('Failed to update profile photo in the database.');
          }
        } else {
          console.error('Upload failed');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }

      setNewPhoto(URL.createObjectURL(file));
      setModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col justify-between items-center lg:h-full">
      {/* Image container with hover overlay */}
      <div className="relative group">
        <img
          src={track ? track : "/images/defaults/default.webp"}
          alt={"Profile Photo"}
          className="w-full object-contain rounded-lg"
        />
          
        {/* Hover overlay with edit icon */}
        {editable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setModalOpen(true)}
            className="text-white text-3xl focus:outline-none"
          >
            <PencilLine size={96}/>
          </button>
          </div>
        )}
      </div>
      <p className="mt-4 text-2xl text-center">Profile Photo</p>

      {/* Modal popup */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl mb-4">Upload a New Profile Photo</h2>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button
              onClick={() => setModalOpen(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePhoto;