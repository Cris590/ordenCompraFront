
import { Tooltip } from '@mui/material';
import React from 'react';

interface ColorCircleProps {
  color: string;
  description?: string;
  size: string;
}

export const ColorCircle: React.FC<ColorCircleProps> = ({ color, description, size }) => {
  
  // Ensure the color starts with a #
  const validColor = color.startsWith('#') ? color : `#${color}`;

  return (

    <Tooltip title={description}>
      <div
        className="relative inline-block mx-1 my-1"
      >
        <div
          style={{
            width: size + 'rem',
            height: size + 'rem',
            backgroundColor: validColor,
          }}
          className='rounded-full border border-dotted'
        ></div>
      </div>
    </Tooltip>
  );
};
