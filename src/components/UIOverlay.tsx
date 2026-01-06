import React from 'react';
import { useStore } from '../store/useStore';
import { Palette, Trash2, Save, Hand, MousePointer2, Box } from 'lucide-react';
import clsx from 'clsx';

const COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#ffffff', // White
  '#333333', // Black
];

const UIOverlay: React.FC = () => {
  const { 
    selectedColor, setColor, 
    mode, setMode, 
    clearScene, voxels, isHandDetected 
  } = useStore();

  const handleSave = () => {
    const data = JSON.stringify(voxels);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'model.json';
    a.click();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-10 flex flex-col justify-between p-4">
      {/* Header / Stats */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="bg-black/50 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Gesture Modeler
          </h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-300">
            <Box size={16} />
            <span>{voxels.length} Voxels</span>
          </div>
          <div className={clsx("flex items-center gap-2 mt-1 text-sm font-bold", isHandDetected ? "text-green-400" : "text-red-400")}>
            <Hand size={16} />
            <span>{isHandDetected ? "Hand Detected" : "No Hand Detected"}</span>
          </div>
        </div>
      </div>

      {/* Sidebar Controls */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-auto flex flex-col gap-4">
        {/* Color Picker */}
        <div className="bg-black/50 backdrop-blur-md p-3 rounded-xl border border-white/10 flex flex-col gap-3">
          <Palette size={20} className="text-gray-400 mx-auto" />
          <div className="h-px bg-white/20 w-full" />
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setColor(color)}
              className={clsx(
                "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
                selectedColor === color ? "border-white scale-110" : "border-transparent"
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Bottom Bar Controls */}
      <div className="self-center pointer-events-auto mb-4">
        <div className="bg-black/50 backdrop-blur-md p-2 rounded-xl border border-white/10 flex items-center gap-2">
          
          <button
            onClick={() => setMode('build')}
            className={clsx(
              "p-3 rounded-lg flex items-center gap-2 transition-colors",
              mode === 'build' ? "bg-blue-600 text-white" : "hover:bg-white/10 text-gray-400"
            )}
          >
            <Box size={20} />
            <span className="font-medium">Build</span>
          </button>

          <button
            onClick={() => setMode('view')}
            className={clsx(
              "p-3 rounded-lg flex items-center gap-2 transition-colors",
              mode === 'view' ? "bg-blue-600 text-white" : "hover:bg-white/10 text-gray-400"
            )}
          >
            <MousePointer2 size={20} />
            <span className="font-medium">View</span>
          </button>

          <div className="w-px h-8 bg-white/20 mx-2" />

          <button
            onClick={handleSave}
            className="p-3 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title="Save Model"
          >
            <Save size={20} />
          </button>

          <button
            onClick={clearScene}
            className="p-3 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
            title="Clear All"
          >
            <Trash2 size={20} />
          </button>

        </div>
      </div>
    </div>
  );
};

export default UIOverlay;
