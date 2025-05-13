"use client";

import DashboardLayout from "@/app/dashboard/page";
import ReviewsHeader from "@/components/reviews/ReviewsHeader";
import ReviewsDisplay from "@/components/reviews/ReviewsDisplay";
import { Sidebar } from "@/components/dashboard/Sidebar";
import LastPlayed from "@/components/dashboard/LastPlayed";
import TopArtistsGrid from "@/components/dashboard/TopArtistsGrid";
import GenreStats from "@/components/dashboard/GenreStats";
import Recommendation from "@/components/dashboard/Recommendation";

import { fetchSingleTrack, putSingleReview, getReviewsForUser, getSoundscape, replaceSocialMedia } from "../../api/api";
import { Track, Review, SoundscapeUser } from "../../types";
import ProfilePhoto from "@/components/profile/profilephoto";
import ReactStars from "react-stars";
import { FaYoutube, FaTwitter, FaInstagram } from "react-icons/fa";

import React, { useEffect, useState } from "react";

interface InputProp {
  spotifyId: string;
  editable: boolean
}

const Profile: React.FC<InputProp> = ({ spotifyId, editable}) => {

  // get recently played

  const [savedTopTracks, setSavedTopTracks] = useState<Track[]>([]);
  const [showInput, setShowInput] = useState<boolean>(false);
  const [reviewText, setReviewText] = useState(""); // Track the input value
  const [error, setError] = useState(""); // Track error messages
  const [rating, setRating] = useState<number>(5); // Initial value is 5


  const [showSocialMediaPopup, setShowSocialMediaPopup] = useState(false);
  const [hasSocialMedia, setHasSocialMedia] = useState<boolean>(false);


  const [reviews, setReviews] = useState<Review[]>([]);
  const [addOrEdit, setAddOrEdit] = useState("add");
  const [whatThereAlready, setWhatThereAlready] = useState("");
  const [avgRating, setAvgRating] = useState<number>(0.0);

  const [userInfo, setUserInfo] = useState<SoundscapeUser | null>(null);
  const [x, setX] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");

  // const [loading, setLoading] = useState<boolean>(true);

      // Stub for saving social media links
  const handleSocialMediaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here, call your API or update your state to save the social media URLs.
    console.log("Saved social media links: , socialMediaURLs go here in a list eventually");
    if (userInfo) {
      replaceSocialMedia(userInfo.profile_id, x, instagram, youtube);
    }

    setShowSocialMediaPopup(false);
  };

  // Renders the social media icons.
  const renderSocialMediaIcons = () => (
    <div className="flex space-x-4">
      {userInfo?.youtube && (
        <a href={userInfo.youtube} target="_blank" rel="noopener noreferrer">
          <FaYoutube size={24} />
        </a>
      )}
      {userInfo?.x && (
        <a href={userInfo.x} target="_blank" rel="noopener noreferrer">
          <FaTwitter size={24} />
        </a>
      )}
      {userInfo?.instagram && (
        <a href={userInfo.instagram} target="_blank" rel="noopener noreferrer">
          <FaInstagram size={24} />
        </a>
      )}
    </div>
  );

  // get top songs
  
    useEffect(() => {

      const getSoundscapeProfile = async () => {
        try {
          console.log('truck lifted')
          const data = await getSoundscape(spotifyId);
          console.log(data);

          setUserInfo(data);
          console.log('userinfo statu is: ', data);
          const socialMediaStatus = Boolean(data.youtube || data.instagram || data.x);
          setYoutube(data.youtube || "");
          setX(data.x || "");
          setInstagram(data.instagram || "");
          console.log("status of social media situation: ", socialMediaStatus);
          setHasSocialMedia(socialMediaStatus);
          console.log(data);
        } catch (error) {
          console.error("Error fetching top genres:", error);
        } finally {
          // setLoading(false);
        }
      };
      
      const getReviewsByUser = async () => {
        try {
          const data = await getReviewsForUser(spotifyId);
          setReviews(data);
          console.log("hi");
          console.log(data.length);
          console.log(data);
          var sum = 0;
          for (var i = 0; i < data.length; i++) {
            sum = sum + data[i].rating;
            console.log('sum is now: ', sum);
            console.log(data[i].un_id.substring(0, data[i].un_id.indexOf(",")));
            if (data[i].un_id.substring(0, data[i].un_id.indexOf(",")) === spotifyId) {
              setAddOrEdit("edit");
              setRating(data[i].rating);
              setReviewText(data[i].text);
            }
          }
          setAvgRating(sum / data.length);
          console.log("check out the data here it's ", data);
        } catch (error) {
          console.error("Error fetching reviews for this song", error);
        } finally {
          // setLoading(false);
        }        
      }

      getSoundscapeProfile();
      getReviewsByUser();

    }, [spotifyId]);


  return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Left column: Image + Display Name */}
          <div className="flex flex-col justify-between items-center lg:h-full">
            <ProfilePhoto spotifyId={spotifyId} track={userInfo == null ? "" : userInfo.pfp} editable = {editable} />
            {/* <img
              src={track == null || track.art == null ? "No profile photo!" : track.art}
              alt={track == null ? "No backup available!" : track.name}
              className="w-full object-contain rounded-lg"
            /> */}
          </div>

          {/* Right column: Personal Info */}
          <div className="flex flex-col justify-center items-center space-y-4">
            <p className="mt-4 text-2xl text-center">
                {`Username: ${userInfo == null || userInfo.profile_id == null ? "Username Missing" : userInfo.name}`}
              </p>
            {/* For non-editable profiles, show social media icons above Spotify ID */}
            {hasSocialMedia && renderSocialMediaIcons()}
            {/* For editable profiles, display the Edit Social Media button */}
            {editable && (
              <button
                onClick={() => setShowSocialMediaPopup(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Edit Social Media
              </button>
            )}


            <p className="text-lg text-center">
                {`Spotify ID: ${userInfo == null || userInfo.profile_id == null ? "No Spotify connected" : userInfo.profile_id}`}
              </p>
            {editable && (
              <p className="text-lg text-center">
              {`Email: ${userInfo == null ? "No email" : userInfo.email}`}
              </p>
            )}

            <p className="text-lg text-center">
              Date Joined: {userInfo == null ? "No Date Joined" : new Date(userInfo.timestamp).toLocaleDateString()}
            </p>
            <a
              href={
                userInfo == null ?
                 "https://open.spotify.com/user/" : "https://open.spotify.com/user/" + userInfo.profile_id
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-s text-white bg-[#1ED760] hover:bg-[#1DB954] px-4 py-2 rounded-lg"
            >
              View Spotify Profile
            </a>
            {showSocialMediaPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="text-xl mb-4 text-center">Edit Social Media</h2>
            <form onSubmit={handleSocialMediaSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Youtube URL
                </label>
                <input
                  type="text"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">X URL</label>
                <input
                  type="text"
                  value={x}
                  onChange={(e) => setX(e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Instagram URL
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowSocialMediaPopup(false)}
                  className="mr-2 px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
          </div>
        </div>
        <div >
              <div className="flex items-center justify-between mt-4">
          <h1 className="text-4xl font-bold">{editable ? "Your Reviews" : "Reviews Written"}</h1>

        </div>


            {/* List of dummy reviews */}
            <div className="space-y-6 mt-6">
              {reviews.map((review, index) => (
                <a href={"/reviews/" + review.track.track_id} key={index} className="block">
                  <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="font-bold text-lg">
                          {review.track.name}
                          <span className="text-sm text-gray-500 ml-2">
                            {review.track.artists.map((artist) => artist.name).join(", ")}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(review.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <ReactStars
                        count={5}
                        size={18}
                        color2="#ffd700"
                        value={review.rating}
                        edit={false}
                        half={false}
                      />
                    </div>
                    <p className="text-gray-700">{review.text}</p>
                  </div>
                </a>
              ))}
            </div>
        </div>
      </div>

  );
}

export default Profile;
