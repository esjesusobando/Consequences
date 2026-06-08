import React, { useEffect } from 'react';
import type { ToolState } from '../../types/tools';

interface CursorManagerProps {
  toolState: ToolState;
}

export const CursorManager: React.FC<CursorManagerProps> = ({ toolState }) => {
  useEffect(() => {
    document.body.style.cursor = toolState.cursorType;
    return () => {
      document.body.style.cursor = 'default';
    };
  }, [toolState.cursorType]);

  return null;
};
