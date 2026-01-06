import React from 'react';
import { useStore } from '../store/useStore';
import { Edges } from '@react-three/drei';

const VoxelGrid: React.FC = () => {
  const voxels = useStore((state) => state.voxels);

  return (
    <group>
      {voxels.map((voxel) => (
        <mesh key={voxel.id} position={voxel.position}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={voxel.color} />
          <Edges color="black" threshold={15} />
        </mesh>
      ))}
    </group>
  );
};

export default VoxelGrid;