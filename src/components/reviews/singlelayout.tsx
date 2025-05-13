"use client";

import DashboardLayout from "@/app/dashboard/page";
import ReviewsHeader from "@/components/reviews/ReviewsHeader";
import ReviewsDisplay from "@/components/reviews/ReviewsDisplay";
import { Sidebar } from "@/components/dashboard/Sidebar";
import LastPlayed from "@/components/dashboard/LastPlayed";
import TopArtistsGrid from "@/components/dashboard/TopArtistsGrid";
import GenreStats from "@/components/dashboard/GenreStats";
import Recommendation from "@/components/dashboard/Recommendation";

import { fetchSingleTrack, putSingleReview, getReviewsForSong } from "../../api/api";
import { Track, Review } from "../../types";
import ReactStars from "react-stars";

import React, { useEffect, useState } from "react";

interface InputProp {
  spotifyId: string;
  trackId: string
}

const Layout: React.FC<InputProp> = ({ spotifyId, trackId}) => {

  // get recently played

  const [track, setTrack] = useState<Track | null>(null);
  const [savedTopTracks, setSavedTopTracks] = useState<Track[]>([]);
  const [showInput, setShowInput] = useState<boolean>(false);
  const [reviewText, setReviewText] = useState(""); // Track the input value
  const [error, setError] = useState(""); // Track error messages
  const [rating, setRating] = useState<number>(5); // Initial value is 5
  const [reviews, setReviews] = useState<Review[]>([]);
  const [addOrEdit, setAddOrEdit] = useState("add");
  const [whatThereAlready, setWhatThereAlready] = useState("");
  const [avgRating, setAvgRating] = useState<number>(0.0);

  // const [loading, setLoading] = useState<boolean>(true);

  // get top songs
  
    useEffect(() => {
      const getTrackArt = async () => {
        try {
          
          const data = await fetchSingleTrack(spotifyId, trackId);
          setTrack(data);
          console.log("track is: ", data);
          console.log('track art is: ', data.art);
        } catch (error) {
          console.error("Error fetching top genres:", error);
        } finally {
          // setLoading(false);
        }
      };
      
      const getReviewsBySong = async () => {
        try {    
          const data = await getReviewsForSong(trackId, spotifyId);
          setReviews(data);
          console.log("hi");
          console.log(data.length);
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

      getTrackArt();
      getReviewsBySong();

    }, [spotifyId, trackId]);


    const handleAddReviewClick = () => {
      setShowInput(true); // Show the input box when the button is clicked
    };
  
    const handleDiscardClick = () => {
      setReviewText(""); // Clear the input
      setError(""); // Clear any errors
      setShowInput(false); // Hide the input box when "Discard" is clicked
    };



    const handleSubmit = async () => {
      if (reviewText.length < 30 || reviewText.length > 1000) {
        setError("Review must be between 30 and 1000 characters long.");
      } else {
        setError(""); // Clear any previous errors
        console.log("Submitted Review:", reviewText); // Replace this with actual submission logic
        try {
          // Call the putSingleReview function to persist the data
          console.log('test');
          const response = await putSingleReview(trackId, spotifyId, reviewText, rating, new Date().toISOString());
          console.log('tesyt');
          // Check if the response indicates success
          console.log(response)
          if (response.status == 200) {
            console.log("Review updated successfully:", response);
            setReviewText(""); // Clear the input
          } else if (response.status == 201) {
            console.log("Review saved successfully:", response);
            setReviewText(""); // Clear the input            
          } else {
            setError("Failed to save review. Please try again.");
          }
        } catch (error) {
          console.error("Error saving review:", error);
          setError("An error occurred while saving your review. Please try again later.");
        }
        setReviewText(""); // Clear the input
        setShowInput(false);
      }
    };

    const handleRatingChange = (newRating: number) => {
      setRating(newRating); // Update the state with the selected rating
    };


  


  return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <img
              src={(track == null || track.art == null) ? "No image available!" : track.art}
              alt={track == null ? "No backup available!": track.name}
              className="w-full h-auto rounded-lg"
            />
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-4xl font-bold text-center">{track == null ? "No name" : track.name}</p>
            <p className="text-lg text-center">{track == null || track.artists == null ? "No name" : track.artists[0].name}</p>
            <p className="text-lg text-center">Average Rating: {avgRating}</p>
            <a
              href={track == null || track.external_urls == null || track.external_urls.spotify == null ? "https://open.spotify.com/" : track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-s text-white bg-[#1ED760] hover:bg-[#1DB954] px-4 py-2 rounded-lg"
              >
              Listen on Spotify
            </a>
          </div>
        </div>
        <div >
              <div className="flex items-center justify-between mt-4">
          <h1 className="text-4xl font-bold">Reviews</h1>

          {/* Button for adding a review */}
          <button 
            onClick={handleAddReviewClick}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-lg font-medium rounded-lg shadow-lg hover:bg-gray-800">
            <span className="text-xl font-bold">+</span>
            <span>{addOrEdit === "add" ? "Add Your Review" : "Edit Your Review"}</span>
          </button>
        </div>


        {/* Input Box and Buttons */}
        {showInput && (


          <div className="mt-4 space-y-4">
            {/* Input Box */}
            <div className="flex items-center gap-4">
              <p className="text-lg font-medium">Select a Rating:</p>
              <ReactStars count={5} size={24} color2={'#ffd700'} value={rating} edit={true} half={false} onChange={handleRatingChange} />
            </div>

            {/*<ReactStars count={5} size={24} color2={'#ffd700'} value={2} edit={true} half={false}/>*/}
            <textarea
              className="w-full h-24 border border-gray-300 rounded-lg p-3"
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)} // Update the input value
            ></textarea>



            {/* Submit and Discard Buttons */}
            <div className="flex gap-4 items-center">
              <button 
                onClick={handleSubmit}
                className="px-4 py-2 bg-black text-white rounded-lg shadow hover:bg-blue-600">
                Submit
              </button>
              <button
                onClick={handleDiscardClick}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400"
              >
                Discard
              </button>
            {/* Error Message */}
            {error && <p className="text-red-500">{error}</p>}
            </div>
          </div>
        )}


            {/* List of dummy reviews */}
            <div className="space-y-6 mt-6">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="border border-gray-300 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-bold text-lg">{review.un_id.substring(0, review.un_id.indexOf(","))}</p>
                      <p className="text-sm text-gray-500">{new Date(review.timestamp).toLocaleDateString()}</p>
                    </div>
                    <ReactStars count={5} size={18} color2={'#ffd700'} value={review.rating} edit={false} half={false} />
                  </div>
                  <p className="text-gray-700">
                    {review.text}
                  </p>
                </div>
              ))}
            </div>
        </div>

      </div>

  );
}

export default Layout;
