import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type Voxel = {
  id: string;
  position: [number, number, number];
  color: string;
};

export type InteractionMode = 'build' | 'view' | 'delete';

interface AppState {
  voxels: Voxel[];
  selectedColor: string;
  mode: InteractionMode;
  isHandDetected: boolean;
  
  // Actions
  addVoxel: (position: [number, number, number]) => void;
  removeVoxel: (id: string) => void;
  removeVoxelAt: (position: [number, number, number]) => void;
  setMode: (mode: InteractionMode) => void;
  setColor: (color: string) => void;
  setHandDetected: (detected: boolean) => void;
  clearScene: () => void;
}

export const useStore = create<AppState>((set) => ({
  voxels: [],
  selectedColor: '#3b82f6', // Default blue
  mode: 'build',
  isHandDetected: false,

  addVoxel: (position) => set((state) => {
    // Prevent duplicate voxels at the same position
    const exists = state.voxels.some(
      (v) => v.position[0] === position[0] && 
             v.position[1] === position[1] && 
             v.position[2] === position[2]
    );
    
    if (exists) return state;

    return {
      voxels: [
        ...state.voxels,
        { id: uuidv4(), position, color: state.selectedColor }
      ]
    };
  }),

  removeVoxel: (id) => set((state) => ({
    voxels: state.voxels.filter((v) => v.id !== id)
  })),

  removeVoxelAt: (position) => set((state) => ({
    voxels: state.voxels.filter(
      (v) => !(v.position[0] === position[0] && 
               v.position[1] === position[1] && 
               v.position[2] === position[2])
    )
  })),

  setMode: (mode) => set({ mode }),
  setColor: (selectedColor) => set({ selectedColor }),
  setHandDetected: (isHandDetected) => set({ isHandDetected }),
  clearScene: () => set({ voxels: [] }),
}));
