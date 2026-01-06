import { type Results } from '@mediapipe/hands';

export type GestureType = 'pinch' | 'idle' | 'fist' | 'point';

export interface HandData {
  gesture: GestureType;
  position: { x: number; y: number; z: number }; // Normalized 0-1
  isPinching: boolean;
  isMiddlePinching: boolean;
}

export class GestureEngine {
  private static PINCH_THRESHOLD = 0.05;

  static analyze(results: Results): HandData | null {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      return null;
    }

    const landmarks = results.multiHandLandmarks[0];

    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];

    const pinchDist = Math.sqrt(
      Math.pow(thumbTip.x - indexTip.x, 2) +
      Math.pow(thumbTip.y - indexTip.y, 2) +
      Math.pow(thumbTip.z - indexTip.z, 2)
    );

    const middlePinchDist = Math.sqrt(
      Math.pow(thumbTip.x - middleTip.x, 2) +
      Math.pow(thumbTip.y - middleTip.y, 2) +
      Math.pow(thumbTip.z - middleTip.z, 2)
    );

    const isPinching = pinchDist < this.PINCH_THRESHOLD;
    const isMiddlePinching = middlePinchDist < this.PINCH_THRESHOLD;
    const gesture: GestureType = isPinching ? 'pinch' : 'idle';

    const position = {
      x: indexTip.x,
      y: indexTip.y,
      z: indexTip.z
    };

    return {
      gesture,
      position,
      isPinching,
      isMiddlePinching
    };
  }
}