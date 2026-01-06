import { Suspense } from 'react';
import Scene3D from './components/Scene3D';
import WebcamManager from './components/WebcamManager';
import UIOverlay from './components/UIOverlay';

function App() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900 text-white">
      
      {/* Debug Indicator */}
      <div className="absolute top-2 right-2 bg-green-500 px-2 py-1 rounded z-[100] text-xs font-bold">
        Status: Loaded
      </div>

      {/* 3D Scene Layer */}
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white z-40">
          Loading 3D Engine...
        </div>
      }>
        <Scene3D />
      </Suspense>

      {/* UI Layer */}
      <UIOverlay />

      {/* Logic / Input Layer */}
      <WebcamManager />
      
    </div>
  );
}

export default App;