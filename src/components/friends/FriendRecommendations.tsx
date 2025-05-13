"use client";

import { SoundscapeUser } from "@/types/user";


interface Friend {
  id: number;
  name: string;
  avatar: string;
}

interface FriendRecommendationsProps {
  recommendations: SoundscapeUser[];
}

const FriendRecommendations: React.FC<FriendRecommendationsProps> = ({ recommendations }) => {

  console.log('recommendations are', recommendations);
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-6">Friend Recommendations</h2>
      <div className="flex overflow-x-auto space-x-6 no-scrollbar">
        {recommendations.map((friend, index) => (
          <div key={index} className="flex-shrink-0 w-48 bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
            <a href={`/profile/${friend.profile}`}>
                <img
                    src={
                        friend.pfp
                            ? friend.pfp
                            : "/images/defaults/default.webp"
                    }
                    alt="Profile Picture"
                    className="w-16 h-16 rounded-full object-cover"
                />
            </a>
            <p className="mt-3 text-lg font-medium">{friend.username}</p>
            <p className="text-sm text-gray-500">
                                        {friend.email}
                                    </p>
            <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg">Add Friend</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendRecommendations;
