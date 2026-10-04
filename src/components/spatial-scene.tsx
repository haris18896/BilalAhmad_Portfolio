'use client';

import { Suspense, useRef, useSyncExternalStore, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, useGLTF, Center, Bounds, OrthographicCamera } from '@react-three/drei';
import { DoubleSide, MathUtils, Vector3, PCFShadowMap, type Group } from 'three';
import type { ModelMode } from './model-viewer';

const motionQuery = '(prefers-reduced-motion: reduce), (max-width: 800px)';
function subscribeMotion(callback: () => void) {
  const media = window.matchMedia(motionQuery);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}
function ResponsiveCamera() {
  const { size } = useThree();
  return <OrthographicCamera makeDefault position={[9,6.4,10]} zoom={Math.min(size.width / 13.5, size.height / 7.8, 70)} near={.1} far={100} />;
}

function Block({ position = [0,0,0], size, color = '#d8d2c2', mode = 'exterior' }: { position?: [number,number,number]; size: [number,number,number]; color?: string; mode?: ModelMode }) {
  return <mesh position={position} castShadow receiveShadow><boxGeometry args={size} /><meshStandardMaterial color={mode === 'bim' ? '#73806a' : color} roughness={.86} wireframe={mode === 'bim'} /></mesh>;
}
function Tree({ position, scale = 1 }: { position: [number,number,number]; scale?: number }) {
  return <group position={position} scale={scale}>
    <mesh position={[0,.75,0]} castShadow><cylinderGeometry args={[.055,.095,1.5,8]} /><meshStandardMaterial color="#726044" /></mesh>
    {[[-.26,1.5,.08],[.26,1.7,.12],[0,2.02,0],[-.1,1.8,-.3],[.27,1.45,-.25]].map((p,i) => <mesh key={i} position={p as [number,number,number]} castShadow><icosahedronGeometry args={[.46,1]} /><meshStandardMaterial color={['#8f9671','#777f5d','#9da37d'][i%3]} roughness={1} /></mesh>)}
    <mesh position={[0,.035,0]} receiveShadow><cylinderGeometry args={[.52,.55,.07,24]} /><meshStandardMaterial color="#afae96" /></mesh>
  </group>;
}
function Pavilion({ mode }: { mode: ModelMode }) {
  const roof = useRef<Group>(null);
  const foundation = useRef<Group>(null);
  useFrame((_, delta) => {
    if (roof.current) roof.current.position.y = MathUtils.damp(roof.current.position.y, mode === 'interior' ? 4.8 : mode === 'bim' ? 5.35 : 3.45, 5, delta);
    if (foundation.current) foundation.current.position.y = MathUtils.damp(foundation.current.position.y, mode === 'bim' ? -.35 : 0, 5, delta);
  });
  return <group position={[0,-.6,0]}>
    <group ref={foundation}>
      <mesh receiveShadow position={[0,-.14,0]}><cylinderGeometry args={[5.6,5.65,.24,96]} /><meshStandardMaterial color="#d4d0c5" roughness={.95} /></mesh>
      <mesh receiveShadow position={[0,.005,0]}><cylinderGeometry args={[5.36,5.36,.025,96]} /><meshStandardMaterial color="#dcd8cd" roughness={1} /></mesh>
      <Block size={[6.7,.2,4.25]} position={[0,.2,0]} mode={mode} color="#c6c1b1" />
      <Block size={[5.7,.13,.42]} position={[0,.08,2.4]} mode={mode} color="#c6c1b1" />
      <Block size={[4.5,.09,.42]} position={[0,.005,2.8]} mode={mode} color="#c6c1b1" />
    </group>
    <Block size={[6.2,.14,3.65]} position={[0,.37,0]} mode={mode} color="#dbd1b9" />
    <Block size={[6.3,2.25,.18]} position={[0,1.5,-1.75]} mode={mode} color="#d1c8b3" />
    <Block size={[.23,2.25,3.65]} position={[-3.06,1.5,0]} mode={mode} color="#c4bca9" />
    <Block size={[2.3,2.2,.15]} position={[-1.7,1.5,.4]} mode={mode} color="#9e825e" />
    {Array.from({ length: 25 },(_,i) => <Block key={i} size={[.045,2.18,.14]} position={[-2.87+i*.087,1.52,.51]} color="#795c3c" mode={mode} />)}
    {[-2.98,-1.45,0,1.5,3.03].map(x => <Block key={x} size={[.045,2.3,.045]} position={[x,1.54,1.8]} color="#55594e" mode={mode} />)}
    {[-1.75,-.55,.6,1.8].map(z => <Block key={z} size={[.045,2.3,.045]} position={[3.08,1.54,z]} color="#55594e" mode={mode} />)}
    <Block size={[6.2,.045,.05]} position={[0,2.67,1.8]} color="#55594e" mode={mode} />
    <Block size={[6.2,.045,.05]} position={[0,.43,1.8]} color="#55594e" mode={mode} />
    {mode !== 'bim' && <><mesh position={[.65,1.53,1.8]}><planeGeometry args={[4.8,2.16]} /><meshStandardMaterial color="#bed2ce" transparent opacity={mode === 'interior' ? .04 : .16} roughness={.1} metalness={.25} side={DoubleSide} depthWrite={false} /></mesh><mesh position={[3.09,1.53,0]} rotation={[0,Math.PI/2,0]}><planeGeometry args={[3.5,2.16]} /><meshStandardMaterial color="#bed2ce" transparent opacity={.12} roughness={.1} side={DoubleSide} depthWrite={false} /></mesh></>}
    <group ref={roof} position={[0,3.45,0]}>
      <Block size={[6.8,.23,4.15]} mode={mode} color="#d7d2c5" />
      {Array.from({length:28},(_,i) => <Block key={i} size={[.055,.045,3.7]} position={[-3.1+i*.23,-.14,0]} color="#a48960" mode={mode} />)}
    </group>
    <Block size={[1.9,.35,.8]} position={[.7,.67,-.7]} color="#c9c3ad" mode={mode} />
    <Block size={[1.9,.42,.2]} position={[.7,.98,-1.03]} color="#c9c3ad" mode={mode} />
    <Block size={[.22,.42,.8]} position={[-.24,.98,-.7]} color="#c9c3ad" mode={mode} />
    <Block size={[.22,.42,.8]} position={[1.64,.98,-.7]} color="#c9c3ad" mode={mode} />
    <mesh position={[.7,.54,.5]} castShadow><cylinderGeometry args={[.5,.5,.18,32]} /><meshStandardMaterial color={mode === 'bim' ? '#73806a' : '#827764'} wireframe={mode === 'bim'} /></mesh>
    <Block size={[2.9,.015,1.8]} position={[.7,.45,0]} color="#ded7c2" mode={mode} />
    <Block size={[.72,.32,.72]} position={[2.2,.65,.55]} color="#c5bea8" mode={mode} />
    <Block size={[.72,.38,.16]} position={[2.2,.92,.86]} color="#c5bea8" mode={mode} />
    <Block size={[.9,.65,.55]} position={[-2.03,.77,-.9]} color="#9a7d56" mode={mode} />
    <Block size={[.95,.06,.6]} position={[-2.03,1.11,-.9]} color="#d9d2bc" mode={mode} />
    <Tree position={[-3.9,0,-1.65]} scale={1.2} /><Tree position={[3.8,0,-2.2]} scale={1.05} /><Tree position={[-4.2,0,1.2]} scale={.67} />
    {Array.from({length:9},(_,i) => <mesh key={i} position={[-3.65+i*.87,.11,-2.7]} scale={[.45,.22,.33]} castShadow><icosahedronGeometry args={[.6,1]} /><meshStandardMaterial color={i%2 ? '#aaa68e' : '#bbb7a2'} roughness={1} /></mesh>)}
    <mesh position={[1.8,.025,3.6]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.7,40]} /><meshStandardMaterial color="#afc0b7" roughness={.23} metalness={.25} /></mesh>
  </group>;
}
function HotspotPositions({ buttons, mode }: { buttons: RefObject<(HTMLButtonElement | null)[]>; mode: ModelMode }) {
  const point = useRef(new Vector3());
  useFrame(({ camera, size }) => {
    const positions = [[-3.05,1.9,1.7],[2.15,1,.9],[1.8,mode === 'bim' ? 4.75 : mode === 'interior' ? 4.2 : 2.85,-.6]];
    positions.forEach((position,index) => {
      const button = buttons.current[index];
      if (!button) return;
      point.current.set(position[0],position[1],position[2]).project(camera);
      button.style.transform = `translate(${(point.current.x + 1) * size.width / 2}px, ${(-point.current.y + 1) * size.height / 2}px) translate(-50%, -50%)`;
      button.style.visibility = Math.abs(point.current.x) <= 1 && Math.abs(point.current.y) <= 1 && point.current.z < 1 ? 'visible' : 'hidden';
    });
  });
  return null;
}
function UploadedModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <Bounds fit clip observe margin={1.2}><Center><primitive object={scene} /></Center></Bounds>;
}
export default function SpatialScene({ mode, modelUrl, hotspotButtons, onFailure }: { mode: ModelMode; modelUrl?: string; hotspotButtons: RefObject<(HTMLButtonElement | null)[]>; onFailure: () => void }) {
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => window.matchMedia(motionQuery).matches, () => true);
  return <Canvas shadows={{ type: PCFShadowMap }} orthographic dpr={[1,1.6]} camera={{ position: [9,6.4,10], zoom: 43, near: .1, far: 100 }} gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }} onCreated={({ gl }) => { gl.domElement.addEventListener('webglcontextlost', onFailure, { once: true }); }} fallback={<div className="model-loading">Interactive 3D is unavailable on this device.</div>}>
    {!modelUrl && <ResponsiveCamera />}
    <ambientLight intensity={1.6} /><hemisphereLight args={['#fffdf3','#b1aa94',1.3]} />
    <directionalLight position={[-5,10,4]} intensity={3.5} castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-bias={-.001} />
    <Suspense fallback={null}>{modelUrl ? <UploadedModel url={modelUrl} /> : <Pavilion mode={mode} />}</Suspense>
    {!modelUrl && <HotspotPositions buttons={hotspotButtons} mode={mode} />}
    {!modelUrl && <ContactShadows position={[0,-.92,0]} opacity={.36} scale={18} blur={2.7} far={6} resolution={256} color="#6a614e" frames={1} />}
    <OrbitControls makeDefault target={[0,1.2,0]} enablePan={false} enableZoom={false} minPolarAngle={.5} maxPolarAngle={Math.PI/2.15} autoRotate={!reducedMotion} autoRotateSpeed={.22} />
  </Canvas>;
}
