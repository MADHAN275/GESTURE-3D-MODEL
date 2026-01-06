import { type HandData } from './GestureEngine';

export const HandInput = {
  current: {
    x: 0,
    y: 0,
    z: 0,
    gesture: 'idle' as string,
    isPinching: false,
    isMiddlePinching: false,
    isActive: false, 
  },
  
  update(data: HandData | null) {
    if (data) {
      this.current.isActive = true;
      this.current.x = data.position.x;
      this.current.y = data.position.y;
      this.current.z = data.position.z;
      this.current.gesture = data.gesture;
      this.current.isPinching = data.isPinching;
      this.current.isMiddlePinching = data.isMiddlePinching;
    } else {
      this.current.isActive = false;
      this.current.isPinching = false;
      this.current.isMiddlePinching = false;
      this.current.gesture = 'idle';
    }
  }
};