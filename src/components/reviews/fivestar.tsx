import React, { useState } from "react";

interface StarRatingProps {
  editable: boolean;
  numHighlighted: number;
  size: number; // Height in pixels
}

const FiveStar: React.FC<StarRatingProps> = ({ editable, numHighlighted, size }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number>(numHighlighted);

  const handleMouseEnter = (index: number) => {
    if (editable) {
      setHoverIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (editable) {
      setHoverIndex(null);
    }
  };

  const handleClick = (index: number) => {
    if (editable) {
      setClickedIndex(index);
    }
  };

  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, index) => {
        const isHighlighted = hoverIndex !== null ? index < hoverIndex : index < clickedIndex;

        return (
          <div
            key={index}
            onMouseEnter={() => handleMouseEnter(index + 1)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index + 1)}
            className="cursor-pointer"
            style={{
              width: size,
              height: size,
              marginRight: size * 0.1, // Add spacing relative to size
              backgroundColor: isHighlighted ? "black" : "transparent",
              border: "20px solid black", // Outline for unfilled stars
              clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
              cursor: editable ? "pointer" : "default", // Set cursor dynamically
            }}
          />
        );
      })}
    </div>
  );
};

export default FiveStar;