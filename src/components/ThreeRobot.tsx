'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Environment, Float, ContactShadows, Sparkles } from '@react-three/drei';

// Hook to detect mobile
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
}

// Camera controller for mobile zoom
function CameraController({ isMobile }: { isMobile: boolean }) {
    const { camera } = useThree();

    useEffect(() => {
        if (isMobile) {
            camera.position.set(0, -1.2, 4.5); // Move camera down even more
        } else {
            camera.position.set(0, 0, 5);
        }
        camera.updateProjectionMatrix();
    }, [isMobile, camera]);

    return null;
}

function CuteBeanRobot({ scale = 1 }: { scale?: number }) {
    const headRef = useRef<any>(null);
    const bodyRef = useRef<any>(null);

    useFrame((state) => {
        if (!headRef.current || !bodyRef.current) return;
        const mouse = state.pointer;
        const time = state.clock.getElapsedTime();

        // Bouncy head tracking
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -mouse.y * 0.4, 0.1);
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, mouse.x * 0.4, 0.1);
        headRef.current.position.y = 0.6 + Math.sin(time * 3) * 0.03; // Bobbing head

        // Body follows slightly delayed
        bodyRef.current.rotation.y = THREE.MathUtils.lerp(bodyRef.current.rotation.y, mouse.x * 0.2, 0.05);
        bodyRef.current.position.y = -0.2 + Math.sin(time * 3 - 0.5) * 0.03; // Bobbing body
    });

    return (
        <Float speed={5} rotationIntensity={0.1} floatIntensity={0.8}>
            <group scale={[scale, scale, scale]}>

                {/* BODY - Chubby and Soft */}
                <group ref={bodyRef} position={[0, -0.3, 0]}>
                    <mesh>
                        {/* Squashed sphere for chubby look */}
                        <sphereGeometry args={[0.55, 32, 32]} />
                        <meshPhysicalMaterial
                            color="#ffffff"
                            roughness={0.3}
                            metalness={0.1}
                            clearcoat={0.2}
                        />
                    </mesh>

                    {/* Cute Feet - Nubs */}
                    <mesh position={[-0.25, -0.45, 0.1]} rotation={[0.2, 0, 0]}>
                        <sphereGeometry args={[0.15, 32, 32]} />
                        <meshPhysicalMaterial color="#ffffff" roughness={0.3} />
                    </mesh>
                    <mesh position={[0.25, -0.45, 0.1]} rotation={[0.2, 0, 0]}>
                        <sphereGeometry args={[0.15, 32, 32]} />
                        <meshPhysicalMaterial color="#ffffff" roughness={0.3} />
                    </mesh>

                    {/* Belly Button / Light - Soft Glow */}
                    <mesh position={[0, -0.1, 0.5]}>
                        <circleGeometry args={[0.1, 32]} />
                        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1.5} toneMapped={false} />
                    </mesh>
                </group>

                {/* HEAD - Big and Expressive (Chibi Proportions) */}
                <group ref={headRef} position={[0, 0.6, 0]}>
                    {/* Head Shape - Slightly wider */}
                    <mesh>
                        <sphereGeometry args={[0.6, 64, 64]} />
                        <meshPhysicalMaterial
                            color="#ffffff"
                            roughness={0.2}
                            metalness={0.1}
                            clearcoat={0.5}
                        />
                    </mesh>

                    {/* Face Screen - Large Black Glass */}
                    <mesh position={[0, 0.05, 0.45]}>
                        <sphereGeometry args={[0.52, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
                        <meshPhysicalMaterial
                            color="#111111"
                            roughness={0.0}
                            metalness={0.5}
                            clearcoat={1}
                        />
                    </mesh>

                    {/* EYES - Big Glowing Ovals */}
                    <group position={[0, 0.1, 0.92]} rotation={[-0.1, 0, 0]}>
                        {/* Left Eye */}
                        <mesh position={[-0.2, 0, 0]}>
                            <capsuleGeometry args={[0.12, 0.15, 4, 16]} />
                            <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={3} toneMapped={false} />
                        </mesh>
                        {/* Right Eye */}
                        <mesh position={[0.2, 0, 0]}>
                            <capsuleGeometry args={[0.12, 0.15, 4, 16]} />
                            <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={3} toneMapped={false} />
                        </mesh>
                    </group>

                    {/* Antenna - Bobble */}
                    <mesh position={[0, 0.6, 0]}>
                        <cylinderGeometry args={[0.02, 0.02, 0.3]} />
                        <meshStandardMaterial color="#888" />
                    </mesh>
                    <mesh position={[0, 0.75, 0]}>
                        <sphereGeometry args={[0.08]} />
                        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
                    </mesh>

                    {/* Blush / Cheeks (Optional cute detail) */}
                    <mesh position={[-0.35, -0.15, 0.8]} rotation={[-0.2, 0.3, 0]}>
                        <circleGeometry args={[0.08]} />
                        <meshBasicMaterial color="#ff69b4" transparent opacity={0.3} />
                    </mesh>
                    <mesh position={[0.35, -0.15, 0.8]} rotation={[-0.2, -0.3, 0]}>
                        <circleGeometry args={[0.08]} />
                        <meshBasicMaterial color="#ff69b4" transparent opacity={0.3} />
                    </mesh>
                </group>

                {/* HANDS - Floating Nubs */}
                <group position={[-0.7, 0, 0.2]}>
                    <mesh>
                        <sphereGeometry args={[0.15]} />
                        <meshPhysicalMaterial color="#ffffff" roughness={0.2} />
                    </mesh>
                </group>
                <group position={[0.7, 0, 0.2]}>
                    <mesh>
                        <sphereGeometry args={[0.15]} />
                        <meshPhysicalMaterial color="#ffffff" roughness={0.2} />
                    </mesh>
                </group>

            </group>
        </Float>
    );
}

export default function ThreeRobot() {
    const isMobile = useIsMobile();

    return (
        <div className="three-wrapper">
            <Canvas camera={{ position: [0, 0, 5], fov: isMobile ? 50 : 45 }} gl={{ antialias: true }}>
                <CameraController isMobile={isMobile} />

                {/* Lighting - Sharper and more dramatic */}
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <spotLight position={[-10, -10, -10]} angle={0.3} penumbra={1} intensity={2} color="#3b82f6" />

                {/* Sci-fi Floor Grid - Darker and subtle */}
                {/* Sci-fi Floor Grid - Removed for pure black background */}
                {/* <Grid ... /> removed */}

                <CuteBeanRobot scale={isMobile ? 1.1 : 0.8} />

                {/* Particles - Starry Night - reduce on mobile for performance */}
                <Sparkles count={isMobile ? 100 : 200} scale={10} size={2} speed={0.2} opacity={0.8} color="#ffffff" />

                {/* Post Processing Removed for maximum sharpness */}
                {/* <EffectComposer disableNormalPass>
                    <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.0} height={300} intensity={0.4} />
                    <ChromaticAberration offset={new THREE.Vector2(0.0005, 0.0005)} />
                </EffectComposer> */}

                <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} color="#000000" />
                <Environment preset="city" blur={0} background={false} />
            </Canvas>

            <style jsx>{`
        .three-wrapper {
          width: 100%;
          height: 100%;
          min-height: 300px;
          background: transparent;
        }
      `}</style>
        </div>
    );
}
