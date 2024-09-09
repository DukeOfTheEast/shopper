// components/StarRating.js
import React from "react";
import { IoIosStarOutline } from "react-icons/io"; //empty
import { IoIosStarHalf } from "react-icons/io"; //half
import { IoIosStar } from "react-icons/io"; //full

const StarRating = ({ rating }) => {
  // Calculate full stars, half star, and empty stars
  const fullStars = Math.floor(rating); // Full stars
  const hasHalfStar =
    rating - fullStars >= 0.25 && rating - fullStars <= 0.75 ? 1 : 0; // Half star logic
  const emptyStars = 5 - fullStars - hasHalfStar; // Remaining empty stars

  return (
    <div className="flex">
      {/* Render full stars */}
      {Array(fullStars)
        .fill()
        .map((_, index) => (
          <IoIosStar key={`full-${index}`} style={{ color: "#FFD700" }} />
        ))}

      {/* Render half star if needed */}
      {hasHalfStar ? <IoIosStarHalf style={{ color: "#FFD700" }} /> : null}

      {/* Render empty stars */}
      {Array(emptyStars)
        .fill()
        .map((_, index) => (
          <IoIosStarOutline
            key={`empty-${index}`}
            style={{ color: "#FFD700" }}
          />
        ))}
    </div>
  );
};

export default StarRating;
