import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage } from '@react-three/drei';

// 1. 3D Model Component: Jo Duck ko screen par dikhayega
function Model({ url, wireframe }) {
  const { scene } = useGLTF(url);
  
  // Wireframe toggle karne ke liye model ki har mesh par loop
  scene.traverse((child) => {
    if (child.isMesh) {
      child.material.wireframe = wireframe;
    }
  });
  
  return <primitive object={scene} />;
}

function App() {
  const [modelUrl, setModelUrl] = useState(null);
  const [bgColor, setBgColor] = useState('#2d5a42'); // Default background color
  const [wireframe, setWireframe] = useState(false);

  // 2. Direct Upload Logic: Bina server ke browser memory se load karna
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Browser ka built-in function jo file ka temporary link bana deta hai
    const localUrl = URL.createObjectURL(file);
    setModelUrl(localUrl);
    
    alert("Duck.glb locally load ho gayi hai!");
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', margin: 0, padding: 0 }}>
      {/* Header / Navbar */}
      <header style={{ 
        padding: '10px 20px', 
        background: '#1a1a1a', 
        color: '#ffffff', 
        display: 'flex', 
        gap: '20px', 
        alignItems: 'center',
        boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
        zIndex: 10 
      }}>
        <strong style={{ fontSize: '1.2rem' }}>3D Product Viewer</strong>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>Upload:</span>
          <input type="file" accept=".glb,.gltf" onChange={handleUpload} style={{ color: 'white' }} />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>BG Color:</span>
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
        </div>
        
        <button 
          onClick={() => setWireframe(!wireframe)}
          style={{ 
            padding: '6px 12px', 
            cursor: 'pointer', 
            borderRadius: '4px', 
            border: 'none',
            background: wireframe ? '#ffc107' : '#6c757d',
            fontWeight: 'bold'
          }}
        >
          Wireframe: {wireframe ? "ON" : "OFF"}
        </button>
      </header>

      {/* 3D Scene / Canvas */}
      <main style={{ flex: 1, background: bgColor, position: 'relative' }}>
        <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
          {/* Lights */}
          <ambientLight intensity={0.7} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          
          <Suspense fallback={<mesh><boxGeometry /><meshStandardMaterial color="gray" /></mesh>}>
            {/* Stage: Jo model ko center karta hai aur lighting handle karta hai */}
            <Stage environment="studio" intensity={0.5} contactShadow={true} adjustCamera center shadowBias={-0.001}>
              {modelUrl && <Model url={modelUrl} wireframe={wireframe} />}
            </Stage>
          </Suspense>
          
          {/* Mouse Controls */}
          <OrbitControls makeDefault minDistance={2} maxDistance={15} />
        </Canvas>
        
        {!modelUrl && (
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            color: 'white',
            textAlign: 'center'
          }}>
            <h2>Duck.glb file select karein!</h2>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;