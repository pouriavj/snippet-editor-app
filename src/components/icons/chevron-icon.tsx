"use client";
// Rotating chevron icon on click
import { useState } from "react";

interface ChevronIconProps {
  size?: number;
  color?: string;
  initialDirection?: InitialDirection;
}
type InitialDirection = "right" | "bottom";

const chevronPath = "M6 3L11 8L6 13";

const ChevronIcon = ({
  size = 16,
  color = "currentColor",
  initialDirection = "right",
}: ChevronIconProps) => {
  const [direction, setDirection] = useState(initialDirection);

  const toggleDirection = () => {
    setDirection((prevDirection) =>
      prevDirection === "right" ? "bottom" : "right",
    );
  };

  // Determine the rotation angle based on the direction state
  // 0deg for 'right', 90deg for 'bottom'
  const rotationAngle = direction === "right" ? 0 : 90;

  return (
    <div onClick={toggleDirection} style={{ cursor: "pointer" }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          color: color,
          transitionProperty: "transform", // Transition the transform property
          transitionDuration: "300ms", // Animation speed
          transitionTimingFunction: "ease-in-out", // Smoothness
          transform: `rotate(${rotationAngle}deg)`, // Apply the rotation dynamically
          transformOrigin: "center", // Ensure rotation happens around the center
        }}
      >
        <path
          d={chevronPath}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default ChevronIcon;
