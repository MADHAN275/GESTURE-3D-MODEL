import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import VoxelGrid from './VoxelGrid';
import Cursor3D from './Cursor3D';

const Scene3D: React.FC = () => {
  return (
    <div className="w-full h-screen bg-gray-900">
      <Canvas
        camera={{ position: [10, 10, 10], fov: 50 }}
        shadows
      >
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={1} 
          castShadow 
          shadow-mapSize={[1024, 1024]} 
        />
        
        <group>
            {/* The Voxel Grid System */}
            <VoxelGrid />
            
            {/* The User's Hand Cursor */}
            <Cursor3D />

            {/* Reference Grid */}
            <Grid 
                position={[0, -0.5, 0]} 
                args={[20, 20]} 
                cellColor="#6f6f6f" 
                sectionColor="#9d9d9d" 
                fadeDistance={30}
            />
        </group>

        <OrbitControls makeDefault />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default Scene3D;
