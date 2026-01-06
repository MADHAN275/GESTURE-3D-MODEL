import { useEffect, useRef, useState } from 'react';
import { Hands, type Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { GestureEngine } from '../utils/GestureEngine';
import { HandInput } from '../utils/HandInput';
import { useStore } from '../store/useStore';

const WebcamManager: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const setHandDetected = useStore((state) => state.setHandDetected);
  const cameraRef = useRef<Camera | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoRef.current || cameraRef.current) return;

    try {
      const hands = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        },
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      hands.onResults((results: Results) => {
        const handData = GestureEngine.analyze(results);
        HandInput.update(handData);
        setHandDetected(!!handData);
      });

      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current) {
            await hands.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480,
      });

      camera.start()
        .catch(err => {
            setError("Camera failed to start: " + err.message);
        });

      cameraRef.current = camera;

    } catch (e: any) {
      setError("MediaPipe init failed: " + e.message);
    }
  }, [setHandDetected]);

  if (error) {
      return (
          <div className="fixed bottom-4 right-4 w-64 p-4 bg-red-900/90 text-white rounded-lg z-50 text-xs">
              Error: {error}
          </div>
      )
  }

  return (
    <div className="fixed bottom-4 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden border-2 border-gray-700 z-50">
      <video
        ref={videoRef}
        className="w-full h-full object-cover transform -scale-x-100" 
        playsInline
        muted
      />
    </div>
  );
};

export default WebcamManager;
