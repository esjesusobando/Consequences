import * as THREE from "three";

export type ToolMode = 'selection' | 'hand' | 'default' | 'rotate';

export interface ToolState {
  mode: ToolMode;
  isActive: boolean;
  isTempHand: boolean;
  cursorType: 'default' | 'crosshair' | 'grab' | 'grabbing';
}

export interface SelectionResult {
  objectName: string;
  objectType: 'bit' | 'target' | 'axis';
  point: THREE.Vector3;
}
