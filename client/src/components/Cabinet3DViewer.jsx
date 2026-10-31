import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Rotate3d, 
  Eye, 
  Sparkles, 
  Palette, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Sliders,
  Layers,
  Flame
} from 'lucide-react';

const RGB_THEMES = [
  { id: 'chroma', name: 'Chroma Cycle', color: '#6366f1', secondary: '#06b6d4', dynamic: true },
  { id: 'cyberpunk', name: 'Cyberpunk Neon', color: '#06b6d4', secondary: '#ec4899', dynamic: false },
  { id: 'neon_purple', name: 'Synthwave Purple', color: '#a855f7', secondary: '#3b82f6', dynamic: false },
  { id: 'matrix_green', name: 'Matrix Emerald', color: '#10b981', secondary: '#059669', dynamic: false },
  { id: 'crimson', name: 'Crimson Fury', color: '#ef4444', secondary: '#b91c1c', dynamic: false },
  { id: 'pure_white', name: 'Minimalist Frost', color: '#ffffff', secondary: '#94a3b8', dynamic: false },
  { id: 'stealth', name: 'Stealth Blackout', color: '#111827', secondary: '#000000', dynamic: false, off: true }
];

export default function Cabinet3DViewer({ 
  build = {}, 
  currentTheme = null,
  highlightComponent = null,
  onComponentClick = () => {} 
}) {
  const containerRef = useRef(null);
  const [rgbTheme, setRgbTheme] = useState(RGB_THEMES[0]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [viewAngle, setViewAngle] = useState('iso'); // 'iso', 'side', 'front', 'top'

  // Three.js internal references
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const animFrameRef = useRef(null);
  const meshesRef = useRef({});
  const lightsRef = useRef([]);
  const rotatingFansRef = useRef([]);

  // Mouse orbit controls state
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const cameraRotationRef = useRef({ theta: Math.PI / 4, phi: Math.PI / 6, radius: 14 });

  // Update camera position from spherical coords
  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { theta, phi, radius } = cameraRotationRef.current;
    cameraRef.current.position.x = radius * Math.sin(phi) * Math.sin(theta);
    cameraRef.current.position.y = radius * Math.cos(phi);
    cameraRef.current.position.z = radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.lookAt(0, 0, 0);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 600;
    const height = containerRef.current.clientHeight || 500;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x090915);
    scene.fog = new THREE.FogExp2(0x090915, 0.025);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    containerRef.current.replaceChildren(renderer.domElement);

    // 4. Lighting setup
    const ambientLight = new THREE.AmbientLight(0x1a1a2e, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xdbeafe, 1.4);
    keyLight.position.set(10, 15, 12);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x818cf8, 0.9);
    rimLight.position.set(-10, -5, -10);
    scene.add(rimLight);

    // Interior RGB Point Lights
    const rgbLight1 = new THREE.PointLight(0x6366f1, 2.5, 9);
    rgbLight1.position.set(0, 1.5, 0.5);
    scene.add(rgbLight1);

    const rgbLight2 = new THREE.PointLight(0x06b6d4, 2.2, 9);
    rgbLight2.position.set(0.8, -1.2, 1.0);
    scene.add(rgbLight2);

    lightsRef.current = [rgbLight1, rgbLight2];

    // Floor platform with grid
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({ 
      color: 0x0c0c1b, 
      roughness: 0.85, 
      metalness: 0.3 
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -3.8;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(26, 26, 0x312e81, 0x181832);
    grid.position.y = -3.79;
    scene.add(grid);

    // 5. Build 3D PC Cabinet & Components
    buildCabinetScene(scene, build, meshesRef, rotatingFansRef);

    // 6. Animation loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Spin fan blades
      rotatingFansRef.current.forEach(fan => {
        if (fan) fan.rotation.z += delta * 15;
      });

      // Dynamic Chroma RGB flow if selected
      if (rgbTheme.id === 'chroma' && !rgbTheme.off) {
        const hue1 = (elapsedTime * 0.2) % 1;
        const hue2 = (elapsedTime * 0.2 + 0.35) % 1;
        const c1 = new THREE.Color().setHSL(hue1, 0.9, 0.55);
        const c2 = new THREE.Color().setHSL(hue2, 0.9, 0.55);

        if (lightsRef.current[0]) lightsRef.current[0].color = c1;
        if (lightsRef.current[1]) lightsRef.current[1].color = c2;

        if (meshesRef.current.rgbMaterials) {
          meshesRef.current.rgbMaterials.forEach((mat, i) => {
            mat.color = i % 2 === 0 ? c1 : c2;
            mat.emissive = i % 2 === 0 ? c1 : c2;
          });
        }
      }

      // Auto-rotation
      if (autoRotate && !isDraggingRef.current) {
        cameraRotationRef.current.theta += delta * 0.4;
        updateCameraPosition();
      }

      renderer.render(scene, camera);
    };
    animate();

    // 7. Mouse Orbit interaction handlers
    const onMouseDown = (e) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      cameraRotationRef.current.theta -= deltaX * 0.007;
      cameraRotationRef.current.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, cameraRotationRef.current.phi - deltaY * 0.007));
      
      updateCameraPosition();
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      cameraRotationRef.current.radius = Math.max(7, Math.min(22, cameraRotationRef.current.radius + e.deltaY * 0.015));
      updateCameraPosition();
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Touch support for mobile
    let touchStart = { x: 0, y: 0 };
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - touchStart.x;
      const deltaY = e.touches[0].clientY - touchStart.y;
      cameraRotationRef.current.theta -= deltaX * 0.007;
      cameraRotationRef.current.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, cameraRotationRef.current.phi - deltaY * 0.007));
      updateCameraPosition();
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => { isDraggingRef.current = false; };
    dom.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
    };
  }, []);

  // Rebuild scene when selected build components or theme change
  useEffect(() => {
    if (!sceneRef.current) return;
    // Clean old meshes
    const scene = sceneRef.current;
    if (meshesRef.current.cabinetGroup) {
      scene.remove(meshesRef.current.cabinetGroup);
    }
    rotatingFansRef.current = [];
    buildCabinetScene(scene, build, meshesRef, rotatingFansRef, currentTheme);
    applyRgbTheme(rgbTheme);
  }, [build, currentTheme, rgbTheme]);

  // Sync RGB lighting with site theme when changed
  useEffect(() => {
    if (!currentTheme?.colors) return;
    setRgbTheme({
      id: currentTheme.id,
      name: currentTheme.name,
      color: currentTheme.colors.threeRgb,
      secondary: currentTheme.colors.threeSecondary || '#ffffff',
      dynamic: false
    });
  }, [currentTheme]);

  // Handle RGB theme changes
  useEffect(() => {
    applyRgbTheme(rgbTheme);
  }, [rgbTheme]);

  const applyRgbTheme = (theme) => {
    if (!lightsRef.current || lightsRef.current.length === 0) return;
    const c1 = new THREE.Color(theme.color);
    const c2 = new THREE.Color(theme.secondary);

    if (theme.off) {
      lightsRef.current.forEach(l => { if (l) l.intensity = 0; });
      if (meshesRef.current.rgbMaterials) {
        meshesRef.current.rgbMaterials.forEach(m => {
          m.color.setHex(0x222222);
          m.emissive.setHex(0x000000);
          m.emissiveIntensity = 0;
        });
      }
    } else {
      if (lightsRef.current[0]) {
        lightsRef.current[0].color = c1;
        lightsRef.current[0].intensity = 2.5;
      }
      if (lightsRef.current[1]) {
        lightsRef.current[1].color = c2;
        lightsRef.current[1].intensity = 2.2;
      }
      if (meshesRef.current.rgbMaterials) {
        meshesRef.current.rgbMaterials.forEach((m, i) => {
          const col = i % 2 === 0 ? c1 : c2;
          m.color = col;
          m.emissive = col;
          m.emissiveIntensity = 0.9;
        });
      }
    }
  };

  // Handle Glass Panel open/close animation
  useEffect(() => {
    const glass = meshesRef.current.glassPanel;
    if (!glass) return;

    if (panelOpen) {
      glass.position.z = 3.2;
      glass.position.x = 0.8;
      glass.rotation.y = Math.PI / 12;
    } else {
      glass.position.z = 2.05;
      glass.position.x = 0;
      glass.rotation.y = 0;
    }
  }, [panelOpen]);

  // Handle camera angle preset buttons
  const setCameraView = (type) => {
    setViewAngle(type);
    setAutoRotate(false);
    if (type === 'iso') {
      cameraRotationRef.current = { theta: Math.PI / 4, phi: Math.PI / 6, radius: 14 };
    } else if (type === 'side') {
      cameraRotationRef.current = { theta: 0, phi: Math.PI / 2.3, radius: 11 };
    } else if (type === 'front') {
      cameraRotationRef.current = { theta: -Math.PI / 2, phi: Math.PI / 2.3, radius: 12 };
    } else if (type === 'top') {
      cameraRotationRef.current = { theta: 0, phi: 0.15, radius: 13 };
    }
    updateCameraPosition();
  };

  return (
    <div className="relative w-full h-[520px] lg:h-[620px] rounded-2xl overflow-hidden bg-brand-surface border border-brand-border/80 shadow-2xl flex flex-col">
      {/* 3D Canvas Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      />

      {/* Floating Viewport Overlay: Header & Build Info */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <h3 className="font-display text-sm tracking-wider uppercase text-white font-bold drop-shadow-md">
            Interactive 3D Hardware Rig
          </h3>
        </div>
        <p className="text-xs text-slate-300 font-mono drop-shadow">
          {build.case?.title ? build.case.title.slice(0, 36) + "..." : "Custom PC Chassis - Dual Chamber Panoramic"}
        </p>
      </div>

      {/* Floating Camera & View Controls (Top Right) */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-brand-card/90 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-lg">
        <button
          onClick={() => setCameraView('iso')}
          className={`px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition-all ${viewAngle === 'iso' ? 'bg-indigo-600 text-white shadow-glow-primary' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}
          title="Isometric View"
        >
          ISO
        </button>
        <button
          onClick={() => setCameraView('side')}
          className={`px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition-all ${viewAngle === 'side' ? 'bg-indigo-600 text-white shadow-glow-primary' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}
          title="Side Interior View"
        >
          Side
        </button>
        <button
          onClick={() => setCameraView('front')}
          className={`px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition-all ${viewAngle === 'front' ? 'bg-indigo-600 text-white shadow-glow-primary' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}
          title="Front Intake View"
        >
          Front
        </button>
        <div className="w-[1px] h-5 bg-white/15 mx-0.5" />
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-1.5 rounded-lg text-xs transition-all ${autoRotate ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
          title={autoRotate ? "Pause 360° Rotation" : "Enable 360° Rotation"}
        >
          <Rotate3d className={`w-4 h-4 ${autoRotate ? 'animate-spin-slow' : ''}`} />
        </button>
      </div>

      {/* Bottom Control Bar: Panel Toggle, RGB Themes, Specs Badge */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Glass Panel and Zoom controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border backdrop-blur-md transition-all ${
              panelOpen 
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-lg' 
                : 'bg-brand-card/90 border-white/10 text-slate-300 hover:text-white hover:border-white/20'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{panelOpen ? "Close Side Glass" : "Open Glass Panel"}</span>
          </button>
        </div>

        {/* Center / Right: RGB Lighting Palette Selector */}
        <div className="flex items-center gap-1.5 bg-brand-card/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10">
          <Palette className="w-3.5 h-3.5 text-indigo-400 mr-1" />
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline mr-1">RGB Mode:</span>
          <div className="flex items-center gap-1.5">
            {RGB_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setRgbTheme(theme)}
                className={`w-5 h-5 rounded-full transition-transform border ${
                  rgbTheme.id === theme.id 
                    ? 'scale-125 border-white ring-2 ring-indigo-500 shadow-glow-primary' 
                    : 'border-white/20 hover:scale-110 opacity-70 hover:opacity-100'
                }`}
                style={{ 
                  background: theme.id === 'chroma' 
                    ? 'linear-gradient(135deg, #f43f5e, #8b5cf6, #06b6d4)' 
                    : theme.color 
                }}
                title={theme.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Builds the realistic 3D PC Cabinet, Motherboard, GPU, Cooler, RAM, and Case Fans
 */
function buildCabinetScene(scene, build, meshesRef, rotatingFansRef, currentTheme) {
  const cabinetGroup = new THREE.Group();
  meshesRef.current.cabinetGroup = cabinetGroup;
  meshesRef.current.rgbMaterials = [];

  const isWhiteCase = (build.case?.specs?.color || "").toLowerCase().includes("white") ||
                      (build.case?.title || "").toLowerCase().includes("white") ||
                      currentTheme?.colors?.cabinetColor === 'White';

  // Materials
  const themeChassisColor = currentTheme?.colors?.cabinetHex ?? 0x161622;
  const chassisColor = isWhiteCase ? 0xededf2 : themeChassisColor;
  const chassisMetal = new THREE.MeshStandardMaterial({
    color: chassisColor,
    metalness: 0.85,
    roughness: 0.25,
  });

  const interiorDarkMetal = new THREE.MeshStandardMaterial({
    color: isWhiteCase ? 0xd0d0dc : 0x111119,
    metalness: 0.8,
    roughness: 0.35,
  });

  const pcbMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.2,
    roughness: 0.5,
  });

  const heatsinkMat = new THREE.MeshStandardMaterial({
    color: 0x2d3748,
    metalness: 0.9,
    roughness: 0.2,
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xd8b4fe,
    metalness: 0.95,
    roughness: 0.1,
  });

  // RGB Lightbars material
  const rgbMat1 = new THREE.MeshStandardMaterial({
    color: 0x6366f1,
    emissive: 0x6366f1,
    emissiveIntensity: 0.9,
    roughness: 0.1,
  });
  const rgbMat2 = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.9,
    roughness: 0.1,
  });
  meshesRef.current.rgbMaterials.push(rgbMat1, rgbMat2);

  // Tempered Glass Physical Material (Transparent, Reflective)
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x8899aa,
    transmission: 0.92,
    opacity: 1,
    transparent: true,
    roughness: 0.08,
    metalness: 0.1,
    ior: 1.52,
    reflectivity: 0.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  });

  // 1. Chassis Proportions & Architecture based on selected Cabinet Style
  const isPanoramic = (build.case?.specs?.cabinet_style || "").includes("Panoramic") || 
                      (build.case?.title || "").toLowerCase().includes("o11") || 
                      (build.case?.title || "").toLowerCase().includes("vision") ||
                      (build.case?.title || "").toLowerCase().includes("dual chamber");

  const isFullTower = (build.case?.specs?.form_factor || "").includes("Full Tower") || 
                      (build.case?.title || "").toLowerCase().includes("7000") ||
                      (build.case?.title || "").toLowerCase().includes("xl");

  const isMiniTower = (build.case?.specs?.form_factor || "").includes("Micro-ATX") || 
                      (build.case?.specs?.form_factor || "").includes("Mini") ||
                      (build.case?.title || "").toLowerCase().includes("mini");

  const caseWidth = isPanoramic ? 3.3 : (isMiniTower ? 2.6 : 2.8);
  const caseHeight = isFullTower ? 6.2 : (isMiniTower ? 4.8 : 5.6);
  const caseDepth = isPanoramic ? 5.2 : (isMiniTower ? 4.5 : 4.8);

  // Bottom PSU Shroud / Base
  const baseGeo = new THREE.BoxGeometry(caseWidth, 1.2, caseDepth);
  const baseMesh = new THREE.Mesh(baseGeo, interiorDarkMetal);
  baseMesh.position.set(0, -caseHeight / 2 + 0.6, 0);
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  cabinetGroup.add(baseMesh);

  // PSU Shroud Logo Plate
  const psuCutoutGeo = new THREE.BoxGeometry(0.05, 0.4, 1.6);
  const psuPlate = new THREE.Mesh(psuCutoutGeo, rgbMat1);
  psuPlate.position.set(caseWidth / 2 + 0.01, -caseHeight / 2 + 0.6, 0.4);
  cabinetGroup.add(psuPlate);

  // Rear Panel (Chassis Back)
  const rearGeo = new THREE.BoxGeometry(0.15, caseHeight, caseDepth);
  const rearMesh = new THREE.Mesh(rearGeo, chassisMetal);
  rearMesh.position.set(-caseWidth / 2 + 0.075, 0, 0);
  rearMesh.castShadow = true;
  cabinetGroup.add(rearMesh);

  // Motherboard Tray (interior back wall)
  const mbTrayGeo = new THREE.BoxGeometry(caseWidth - 0.2, caseHeight - 1.4, 0.1);
  const mbTray = new THREE.Mesh(mbTrayGeo, interiorDarkMetal);
  mbTray.position.set(0, 0.6, -caseDepth / 2 + 0.4);
  cabinetGroup.add(mbTray);

  // Top Radiator Mount / Roof Panel
  const topGeo = new THREE.BoxGeometry(caseWidth, 0.2, caseDepth);
  const topMesh = new THREE.Mesh(topGeo, chassisMetal);
  topMesh.position.set(0, caseHeight / 2 - 0.1, 0);
  topMesh.castShadow = true;
  cabinetGroup.add(topMesh);

  // Front Panel (Seamless Glass if Panoramic, Chassis Frame if Mesh)
  const frontFrameGeo = new THREE.BoxGeometry(caseWidth, caseHeight, isPanoramic ? 0.08 : 0.2);
  const frontMesh = new THREE.Mesh(frontFrameGeo, isPanoramic ? glassMat : chassisMetal);
  frontMesh.position.set(0, 0, caseDepth / 2 - 0.1);
  cabinetGroup.add(frontMesh);

  // Glass Side Panel (Interactive)
  const glassGeo = new THREE.BoxGeometry(caseWidth - 0.1, caseHeight - 0.4, 0.08);
  const glassMesh = new THREE.Mesh(glassGeo, glassMat);
  glassMesh.position.set(0, 0.1, caseDepth / 2 - 0.45);
  glassMesh.castShadow = false;
  glassMesh.receiveShadow = true;
  meshesRef.current.glassPanel = glassMesh;
  cabinetGroup.add(glassMesh);

  // 2. Motherboard Component
  const mbGeo = new THREE.BoxGeometry(2.3, 2.7, 0.08);
  const mbMesh = new THREE.Mesh(mbGeo, pcbMat);
  mbMesh.position.set(0, 0.9, -caseDepth / 2 + 0.48);
  mbMesh.castShadow = true;
  cabinetGroup.add(mbMesh);

  // VRM Heatsinks on Motherboard
  const vrm1Geo = new THREE.BoxGeometry(0.3, 1.4, 0.35);
  const vrm1 = new THREE.Mesh(vrm1Geo, heatsinkMat);
  vrm1.position.set(-0.7, 1.4, -caseDepth / 2 + 0.65);
  cabinetGroup.add(vrm1);

  const vrm2Geo = new THREE.BoxGeometry(1.2, 0.3, 0.35);
  const vrm2 = new THREE.Mesh(vrm2Geo, heatsinkMat);
  vrm2.position.set(0.1, 2.05, -caseDepth / 2 + 0.65);
  cabinetGroup.add(vrm2);

  // 3. RAM Modules (2x or 4x DIMMs with glowing RGB Diffusers)
  const ramCount = 2;
  const ramSpacing = 0.12;
  for (let i = 0; i < ramCount; i++) {
    const xPos = 0.55 + i * ramSpacing;
    // RAM heatspreader
    const ramGeo = new THREE.BoxGeometry(0.06, 0.8, 0.08);
    const ramMesh = new THREE.Mesh(ramGeo, heatsinkMat);
    ramMesh.position.set(xPos, 1.35, -caseDepth / 2 + 0.6);
    cabinetGroup.add(ramMesh);

    // RAM RGB top lightbar
    const ramRgbGeo = new THREE.BoxGeometry(0.06, 0.12, 0.08);
    const ramRgb = new THREE.Mesh(ramRgbGeo, rgbMat1);
    ramRgb.position.set(xPos, 1.78, -caseDepth / 2 + 0.6);
    cabinetGroup.add(ramRgb);
  }

  // 4. CPU Cooler (Air Cooler or Liquid AIO)
  const isLiquidCooler = (build.cooler?.specs?.cooler_type || "").toLowerCase().includes("liquid") ||
                         (build.cooler?.title || "").toLowerCase().includes("liquid") ||
                         (build.cooler?.title || "").toLowerCase().includes("aio") ||
                         !build.cooler; // default to modern AIO

  if (isLiquidCooler) {
    // AIO Pump Block over CPU
    const pumpGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.35, 32);
    const pumpMesh = new THREE.Mesh(pumpGeo, heatsinkMat);
    pumpMesh.rotation.x = Math.PI / 2;
    pumpMesh.position.set(-0.05, 1.35, -caseDepth / 2 + 0.68);
    cabinetGroup.add(pumpMesh);

    // Pump Infinity Mirror Face with RGB
    const pumpMirrorGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 32);
    const pumpMirror = new THREE.Mesh(pumpMirrorGeo, rgbMat2);
    pumpMirror.rotation.x = Math.PI / 2;
    pumpMirror.position.set(-0.05, 1.35, -caseDepth / 2 + 0.86);
    cabinetGroup.add(pumpMirror);

    // Top Radiator
    const radGeo = new THREE.BoxGeometry(2.4, 0.25, 1.2);
    const radMesh = new THREE.Mesh(radGeo, interiorDarkMetal);
    radMesh.position.set(0, caseHeight / 2 - 0.3, 0);
    cabinetGroup.add(radMesh);

    // Top Radiator RGB Fans (2x 120mm)
    createRgbFan(cabinetGroup, rotatingFansRef, rgbMat1, 0.45, caseHeight / 2 - 0.5, 0, Math.PI / 2, 0.42);
    createRgbFan(cabinetGroup, rotatingFansRef, rgbMat2, -0.45, caseHeight / 2 - 0.5, 0, Math.PI / 2, 0.42);

    // Flexible Braided Coolant Tubes
    const tubeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.05, 1.45, -caseDepth / 2 + 0.8),
      new THREE.Vector3(0.3, 2.0, -0.5),
      new THREE.Vector3(0.4, caseHeight / 2 - 0.4, 0.1)
    ]);
    const tubeGeo = new THREE.TubeGeometry(tubeCurve, 20, 0.05, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.6 });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    cabinetGroup.add(tubeMesh);
  } else {
    // Air Cooler Heatsink Stack
    const towerGeo = new THREE.BoxGeometry(0.9, 1.1, 0.8);
    const towerMesh = new THREE.Mesh(towerGeo, heatsinkMat);
    towerMesh.position.set(-0.05, 1.35, -caseDepth / 2 + 1.05);
    cabinetGroup.add(towerMesh);

    // Air cooler center RGB fan
    createRgbFan(cabinetGroup, rotatingFansRef, rgbMat1, -0.05, 1.35, -caseDepth / 2 + 1.5, 0, 0.45);
  }

  // 5. Graphics Card (GPU) in PCIe Slot
  const gpuGeo = new THREE.BoxGeometry(2.2, 0.65, 0.5);
  const gpuMesh = new THREE.Mesh(gpuGeo, interiorDarkMetal);
  gpuMesh.position.set(0.1, 0.2, -caseDepth / 2 + 1.1);
  gpuMesh.castShadow = true;
  cabinetGroup.add(gpuMesh);

  // GPU Metal Backplate
  const gpuPlateGeo = new THREE.BoxGeometry(2.2, 0.04, 0.5);
  const gpuPlate = new THREE.Mesh(gpuPlateGeo, chromeMat);
  gpuPlate.position.set(0.1, 0.54, -caseDepth / 2 + 1.1);
  cabinetGroup.add(gpuPlate);

  // GPU Side Illuminated Logo Badge
  const gpuLogoGeo = new THREE.BoxGeometry(1.0, 0.15, 0.03);
  const gpuLogo = new THREE.Mesh(gpuLogoGeo, rgbMat1);
  gpuLogo.position.set(0.2, 0.25, -caseDepth / 2 + 1.36);
  cabinetGroup.add(gpuLogo);

  // GPU Dual/Triple Fans facing downward
  createRgbFan(cabinetGroup, rotatingFansRef, rgbMat2, -0.55, -0.14, -caseDepth / 2 + 1.1, Math.PI / 2, 0.28);
  createRgbFan(cabinetGroup, rotatingFansRef, rgbMat1, 0.2, -0.14, -caseDepth / 2 + 1.1, Math.PI / 2, 0.28);
  createRgbFan(cabinetGroup, rotatingFansRef, rgbMat2, 0.75, -0.14, -caseDepth / 2 + 1.1, Math.PI / 2, 0.28);

  // 6. Case Fans (Front Intakes & Rear Exhaust)
  // 3x Front Intake Fans
  createRgbFan(cabinetGroup, rotatingFansRef, rgbMat1, 0, 1.4, caseDepth / 2 - 0.25, 0, 0.45);
  createRgbFan(cabinetGroup, rotatingFansRef, rgbMat2, 0, 0.2, caseDepth / 2 - 0.25, 0, 0.45);
  createRgbFan(cabinetGroup, rotatingFansRef, rgbMat1, 0, -1.0, caseDepth / 2 - 0.25, 0, 0.45);

  // 1x Rear Exhaust Fan
  createRgbFan(cabinetGroup, rotatingFansRef, rgbMat2, -caseWidth / 2 + 0.3, 1.4, -0.8, Math.PI / 2, 0.42);

  scene.add(cabinetGroup);
}

/**
 * Creates an animated RGB fan with rotating blades and glowing halo ring
 */
function createRgbFan(parentGroup, rotatingFansRef, rgbMat, x, y, z, rotX = 0, radius = 0.45) {
  const fanGroup = new THREE.Group();
  fanGroup.position.set(x, y, z);
  fanGroup.rotation.x = rotX;

  // Outer Fan Frame (Dark)
  const frameGeo = new THREE.TorusGeometry(radius, 0.04, 12, 32);
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x181824, roughness: 0.6 });
  const frame = new THREE.Mesh(frameGeo, frameMat);
  fanGroup.add(frame);

  // RGB Halo Ring
  const ringGeo = new THREE.TorusGeometry(radius * 0.94, 0.03, 12, 32);
  const ring = new THREE.Mesh(ringGeo, rgbMat);
  fanGroup.add(ring);

  // Rotating Blade Group
  const bladesGroup = new THREE.Group();
  const hubGeo = new THREE.CylinderGeometry(radius * 0.28, radius * 0.28, 0.08, 16);
  const hub = new THREE.Mesh(hubGeo, rgbMat);
  hub.rotation.x = Math.PI / 2;
  bladesGroup.add(hub);

  const numBlades = 7;
  for (let i = 0; i < numBlades; i++) {
    const angle = (i / numBlades) * Math.PI * 2;
    const bladeGeo = new THREE.BoxGeometry(radius * 0.58, 0.08, 0.02);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      transparent: true,
      opacity: 0.85,
      roughness: 0.3
    });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.x = Math.cos(angle) * (radius * 0.45);
    blade.position.y = Math.sin(angle) * (radius * 0.45);
    blade.rotation.z = angle + 0.4;
    bladesGroup.add(blade);
  }

  fanGroup.add(bladesGroup);
  rotatingFansRef.current.push(bladesGroup);
  parentGroup.add(fanGroup);
}
