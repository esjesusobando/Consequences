import { useState, useEffect, useCallback } from 'react';
import type { ToolMode, ToolState } from '../types/tools';

export const useToolManager = () => {
  const [mode, setMode] = useState<ToolMode>('rotate');
  const [isTempHand, setIsTempHand] = useState(false);

  const toggleSelection = useCallback(() => {
    setMode(prev => prev === 'selection' ? 'default' : 'selection');
  }, []);

  const activateTempHand = useCallback(() => {
    setIsTempHand(true);
  }, []);

  const deactivateTempHand = useCallback(() => {
    setIsTempHand(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'v') {
        toggleSelection();
      }
      if (e.key === ' ') {
        e.preventDefault();
        activateTempHand();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        deactivateTempHand();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [toggleSelection, activateTempHand, deactivateTempHand]);

  const currentMode = isTempHand ? 'hand' : mode;
  
  let cursorType: 'default' | 'crosshair' | 'grab' | 'grabbing' = 'default';
  if (currentMode === 'selection') cursorType = 'crosshair';
  if (currentMode === 'hand') cursorType = 'grab';

  const toolState: ToolState = {
    mode: currentMode,
    isActive: currentMode !== 'default',
    isTempHand,
    cursorType
  };

  return {
    ...toolState,
    isSelectionMode: currentMode === 'selection',
    isPanMode: currentMode === 'hand',
    setMode,
    toggleSelection
  };
};
