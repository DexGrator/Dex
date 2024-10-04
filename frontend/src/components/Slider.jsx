import React, { useState, useEffect, useRef } from 'react';

const Slider = ({ percentage, onPercentageChange, isLocked, isDisabled }) => {
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentPercentage, setCurrentPercentage] = useState(percentage); // Local state for smooth visual feedback

  const handleMouseDown = (e) => {
    if (!isLocked && !isDisabled) {
      setIsDragging(true);
      handleMouseMove(e);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && sliderRef.current && !isLocked && !isDisabled) {
      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newPercentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setCurrentPercentage(newPercentage); // Update local percentage for smoother UI feedback
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onPercentageChange(currentPercentage); // Commit the change when dragging ends
    }
  };

  // Use requestAnimationFrame for smoother movement
  useEffect(() => {
    const mouseMoveHandler = (e) => {
      if (isDragging) {
        requestAnimationFrame(() => handleMouseMove(e));
      }
    };

    const mouseUpHandler = () => handleMouseUp();

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);

    return () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };
  }, [isDragging, currentPercentage]);

  useEffect(() => {
    if (!isDragging) {
      setCurrentPercentage(percentage); // Sync external percentage with local state
    }
  }, [percentage]);

  const activeColor = isDisabled ? "#4A4A4A" : "#03e1ff";
  const inactiveColor = isDisabled ? "#2A2A2A" : "#1E1E1E";

  return (
    <div
      ref={sliderRef}
      className="relative w-full h-8 bg-[#111111] rounded-lg cursor-pointer overflow-hidden"
      onMouseDown={handleMouseDown}
    >
      {Array.from({ length: 31 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 bottom-0 w-px"
          style={{
            left: `${(i / 30) * 100}%`,
            backgroundColor: i / 3 <= currentPercentage / 10 ? activeColor : inactiveColor,
            opacity: i % 3 === 0 ? 1 : 0.5,
            height: i % 3 === 0 ? '100%' : '50%',
            top: i % 3 === 0 ? '0' : '25%',
            transition: 'background-color 0.1s ease, height 0.1s ease, top 0.1s ease'
          }}
        />
      ))}
    </div>
  );
};

export default Slider;
