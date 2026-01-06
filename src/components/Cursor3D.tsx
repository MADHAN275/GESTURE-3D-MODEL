import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { HandInput } from '../utils/HandInput';
import { useStore } from '../store/useStore';

const SCALE_FACTOR = 10; // Maps 0-1 input to -5 to 5 world units roughly

const Cursor3D: React.FC = () => {
  const meshRef = useRef<Mesh>(null);
  const { addVoxel, removeVoxelAt, selectedColor, mode } = useStore();
  
  // Debounce for pinch action
  const lastPinchRef = useRef<number>(0);
  const [isPinchingVisual, setIsPinchingVisual] = useState(false);
  const [isDeletingVisual, setIsDeletingVisual] = useState(false);

  useFrame(() => {
    if (!meshRef.current) return;

    const hand = HandInput.current;

    if (!hand.isActive) {
      meshRef.current.visible = false;
      return;
    }

    meshRef.current.visible = true;

    // Map 2D (0-1) to 3D World Coordinates
    const targetX = -(hand.x - 0.5) * SCALE_FACTOR * 2; 
    const targetY = -(hand.y - 0.5) * SCALE_FACTOR * 1.5; 
    const targetZ = 0; 

    // Smooth movement (Lerp)
    const lerpFactor = 0.2;
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * lerpFactor;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * lerpFactor;
    meshRef.current.position.z += (targetZ - meshRef.current.position.z) * lerpFactor;

    // Grid Snapping
    const snapX = Math.round(meshRef.current.position.x);
    const snapY = Math.round(meshRef.current.position.y);
    const snapZ = Math.round(meshRef.current.position.z);

    // Interaction Logic
    if (hand.isPinching) {
      setIsPinchingVisual(true);
      setIsDeletingVisual(false);
      const now = Date.now();
      if (now - lastPinchRef.current > 500 && mode === 'build') {
        addVoxel([snapX, snapY, snapZ]);
        lastPinchRef.current = now;
      }
    } else if (hand.isMiddlePinching) {
      setIsPinchingVisual(false);
      setIsDeletingVisual(true);
      const now = Date.now();
      if (now - lastPinchRef.current > 500 && mode !== 'view') {
        removeVoxelAt([snapX, snapY, snapZ]);
        lastPinchRef.current = now;
      }
    } else {
      setIsPinchingVisual(false);
      setIsDeletingVisual(false);
    }
  });

  return (
    <mesh ref={meshRef} visible={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={isDeletingVisual ? '#ff0000' : (isPinchingVisual ? '#00ff00' : selectedColor)} 
        transparent 
        opacity={0.5} 
        wireframe
      />
    </mesh>
  );
};

export default Cursor3D;