import React from 'react';
import type { ToolState } from '../../types/tools';

export const ToolOverlay: React.FC<{ toolState: ToolState }> = ({ toolState }) => {
  if (!toolState.isActive) return null;
  return (
    <div style={{ 
        position: 'absolute', 
        top: '20px', 
        left: '20px', 
        background: 'rgba(15, 15, 25, 0.8)', 
        color: '#cbff6a', 
        padding: '8px 16px', 
        borderRadius: '12px',
        border: '1px solid #cbff6a',
        fontFamily: 'Inter, sans-serif',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        pointerEvents: 'none'
    }}>
      Herramienta: {toolState.mode}
    </div>
  );
};
