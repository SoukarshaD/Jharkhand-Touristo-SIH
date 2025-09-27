import React, { useEffect, useRef } from 'react';

export default function VRViewer({ imageUrl, onClose }) {
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!viewerRef.current) return;

    // These PANOLENS and THREE variables are now globally available from the scripts
    const panorama = new window.PANOLENS.ImagePanorama(imageUrl);
    const viewer = new window.PANOLENS.Viewer({ container: viewerRef.current });
    
    viewer.add(panorama);

    return () => {
      viewer.destroy();
    };
  }, [imageUrl]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100]">
      <div ref={viewerRef} className="w-full h-full" />
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-white text-4xl font-bold"
      >
        &times;
      </button>
    </div>
  );
}