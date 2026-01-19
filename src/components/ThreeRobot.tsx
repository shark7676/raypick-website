'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Environment, Float, ContactShadows, Sparkles, Text, Stars } from '@react-three/drei';

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
            camera.position.set(0, -0.5, 5.0); // Mobile: Zoom out (5.0) and move down (-0.5)
        } else {
            camera.position.set(0, 0, 5);
        }
        camera.updateProjectionMatrix();
    }, [isMobile, camera]);

    return null;
}

type Expression = 'happy' | 'sad' | 'neutral';

function StarAntenna() {
    const starShape = useMemo(() => {
        const shape = new THREE.Shape();
        const outerRadius = 0.08;
        const innerRadius = 0.04;
        const points = 5;

        for (let i = 0; i < points * 2; i++) {
            const angle = (i * Math.PI) / points;
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) shape.moveTo(x, y);
            else shape.lineTo(x, y);
        }
        shape.closePath();
        return shape;
    }, []);

    const extrudeSettings = {
        depth: 0.03,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.01,
        bevelSegments: 2
    };

    const antennaRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (antennaRef.current) {
            antennaRef.current.rotation.y += 0.02; // Gentle spin
            antennaRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 2) * 0.1; // Cute wobble
        }
    });

    return (
        <group position={[0, 0.45, 0]}> {/* Top of head */}
            {/* Stem */}
            <mesh position={[0, 0.08, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 0.16, 8]} />
                <meshPhysicalMaterial color="#cccccc" metalness={0.5} roughness={0.2} />
            </mesh>

            {/* Star */}
            <group ref={antennaRef} position={[0, 0.16, 0]}>
                <mesh rotation={[0, 0, 0]}>
                    <extrudeGeometry args={[starShape, extrudeSettings]} />
                    <meshStandardMaterial
                        color="#ff007f"
                        emissive="#ff007f"
                        emissiveIntensity={2}
                        toneMapped={false}
                    />
                </mesh>
            </group>
        </group>
    );
}

function WhiteCuteRobot({ scale = 1 }: { scale?: number }) {
    const groupRef = useRef<THREE.Group>(null);
    const headRef = useRef<THREE.Group>(null);
    const leftArmRef = useRef<THREE.Group>(null);
    const rightArmRef = useRef<THREE.Group>(null);

    // Expression State
    const [expression, setExpression] = useState<Expression>('happy');

    // Cycle Expressions
    useEffect(() => {
        const interval = setInterval(() => {
            setExpression(prev => {
                if (prev === 'happy') return 'neutral';
                if (prev === 'neutral') return 'sad';
                return 'happy';
            });
        }, 2500); // Change every 2.5 seconds

        return () => clearInterval(interval);
    }, []);

    useFrame((state) => {
        if (!groupRef.current || !headRef.current || !leftArmRef.current || !rightArmRef.current) return;
        const mouse = state.pointer;
        const time = state.clock.getElapsedTime();

        // Smooth floating animation
        groupRef.current.position.y = Math.sin(time * 1.5) * 0.1;

        // Head tracking
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, mouse.x * 0.5, 0.1);
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -mouse.y * 0.3, 0.1);

        // Body slight rotation
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * 0.2, 0.05);

        // Arms swaying
        leftArmRef.current.rotation.z = 0.5 + Math.sin(time * 2) * 0.1;
        rightArmRef.current.rotation.z = -0.5 - Math.sin(time * 2) * 0.1;
    });

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <group ref={groupRef} scale={[scale, scale, scale]}>

                {/* BODY - Rounded Torso */}
                <mesh position={[0, -0.3, 0]} castShadow receiveShadow>
                    <sphereGeometry args={[0.45, 32, 32]} />
                    <meshPhysicalMaterial
                        color='#ffffff'
                        roughness={0.2}
                        metalness={0.1}
                        clearcoat={1}
                        clearcoatRoughness={0.05}
                        reflectivity={1}
                    />

                    {/* CHEST TEXT - RAYPICK */}
                    <group position={[0, 0.1, 0.46]} rotation={[0, 0, 0]}>
                        <Text
                            fontSize={0.12}
                            letterSpacing={0.05}
                            color="#ff007f"
                            anchorX="center"
                            anchorY="middle"
                            outlineWidth={0.005}
                            outlineColor="#ff007f"
                        >
                            RAYPICK
                            <meshStandardMaterial
                                color="#ff007f"
                                emissive="#ff007f"
                                emissiveIntensity={2}
                                toneMapped={false}
                            />
                        </Text>
                    </group>
                </mesh>

                {/* HEAD GROUP */}
                <group ref={headRef} position={[0, 0.45, 0]}>
                    {/* Head Shape - Smaller Size */}
                    <mesh castShadow receiveShadow>
                        <sphereGeometry args={[0.48, 64, 64]} />
                        <meshPhysicalMaterial
                            color='#ffffff'
                            roughness={0.2}
                            metalness={0.1}
                            clearcoat={1}
                            clearcoatRoughness={0.05}
                            reflectivity={1}
                        />
                    </mesh>

                    {/* PINK STAR ANTENNA */}
                    <StarAntenna />

                    {/* ANIMATED EYES */}
                    <group position={[0, 0.12, 0.54]}>
                        {/* HAPPY EXPRESSION (^^) */}
                        {expression === 'happy' && (
                            <>
                                <group position={[-0.17, 0.02, 0]}><mesh><torusGeometry args={[0.08, 0.025, 16, 32, Math.PI]} /><meshBasicMaterial color='#00ffff' toneMapped={false} /></mesh></group>
                                <group position={[0.17, 0.02, 0]}><mesh><torusGeometry args={[0.08, 0.025, 16, 32, Math.PI]} /><meshBasicMaterial color='#00ffff' toneMapped={false} /></mesh></group>
                            </>
                        )}
                        {/* SAD EXPRESSION (><) */}
                        {expression === 'sad' && (
                            <>
                                <group position={[-0.17, 0, 0]}>
                                    <mesh rotation={[0, 0, Math.PI / 3]} position={[-0.01, 0, 0]}><capsuleGeometry args={[0.03, 0.12, 4, 8]} /><meshBasicMaterial color='#00ffff' toneMapped={false} /></mesh>
                                    <mesh rotation={[0, 0, -Math.PI / 3]} position={[-0.01, 0, 0]}><capsuleGeometry args={[0.03, 0.12, 4, 8]} /><meshBasicMaterial color='#00ffff' toneMapped={false} /></mesh>
                                </group>
                                <group position={[0.17, 0, 0]}>
                                    <mesh rotation={[0, 0, -Math.PI / 3]} position={[0.01, 0, 0]}><capsuleGeometry args={[0.03, 0.12, 4, 8]} /><meshBasicMaterial color='#00ffff' toneMapped={false} /></mesh>
                                    <mesh rotation={[0, 0, Math.PI / 3]} position={[0.01, 0, 0]}><capsuleGeometry args={[0.03, 0.12, 4, 8]} /><meshBasicMaterial color='#00ffff' toneMapped={false} /></mesh>
                                </group>
                            </>
                        )}
                        {/* NEUTRAL EXPRESSION (--) */}
                        {expression === 'neutral' && (
                            <>
                                <mesh position={[-0.17, 0, 0]} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.035, 0.18, 4, 16]} /><meshBasicMaterial color='#00ffff' toneMapped={false} /></mesh>
                                <mesh position={[0.17, 0, 0]} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.035, 0.18, 4, 16]} /><meshBasicMaterial color='#00ffff' toneMapped={false} /></mesh>
                            </>
                        )}
                    </group>

                    {/* EARS - Pink Tipped */}
                    <group position={[-0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <mesh><cylinderGeometry args={[0.1, 0.1, 0.1, 32]} /><meshPhysicalMaterial color='#ffffff' roughness={0.2} metalness={0.1} clearcoat={1} clearcoatRoughness={0.05} reflectivity={1} /></mesh>
                        <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.08, 0.08, 0.02, 32]} /><meshStandardMaterial color='#ff007f' emissive='#ff007f' emissiveIntensity={3} toneMapped={false} /></mesh>
                    </group>
                    <group position={[0.45, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                        <mesh><cylinderGeometry args={[0.1, 0.1, 0.1, 32]} /><meshPhysicalMaterial color='#ffffff' roughness={0.2} metalness={0.1} clearcoat={1} clearcoatRoughness={0.05} reflectivity={1} /></mesh>
                        <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.08, 0.08, 0.02, 32]} /><meshStandardMaterial color='#ff007f' emissive='#ff007f' emissiveIntensity={3} toneMapped={false} /></mesh>
                    </group>
                </group>

                {/* ARMS */}
                <group ref={leftArmRef} position={[-0.45, -0.2, 0]}>
                    <mesh position={[0, -0.2, 0]}><capsuleGeometry args={[0.08, 0.4, 4, 16]} /><meshPhysicalMaterial color='#ffffff' roughness={0.2} metalness={0.1} clearcoat={1} clearcoatRoughness={0.05} reflectivity={1} /></mesh>
                    <mesh position={[0, -0.45, 0]}><sphereGeometry args={[0.12]} /><meshPhysicalMaterial color='#ffffff' roughness={0.2} metalness={0.1} clearcoat={1} clearcoatRoughness={0.05} reflectivity={1} /></mesh>
                </group>
                <group ref={rightArmRef} position={[0.45, -0.2, 0]}>
                    <mesh position={[0, -0.2, 0]}><capsuleGeometry args={[0.08, 0.4, 4, 16]} /><meshPhysicalMaterial color='#ffffff' roughness={0.2} metalness={0.1} clearcoat={1} clearcoatRoughness={0.05} reflectivity={1} /></mesh>
                    <mesh position={[0, -0.45, 0]}><sphereGeometry args={[0.12]} /><meshPhysicalMaterial color='#ffffff' roughness={0.2} metalness={0.1} clearcoat={1} clearcoatRoughness={0.05} reflectivity={1} /></mesh>
                </group>
            </group>
        </Float>
    );
}

// Data Particles - Digital Flow Effect
function DataParticles({ count = 150, color1 = '#00ffff', color2 = '#ff007f' }) {
    const meshRef = useRef<THREE.InstancedMesh>(null);

    // Store initial random values for each particle
    const particles = useRef(new Array(count).fill(0).map(() => ({
        position: new THREE.Vector3(
            (Math.random() - 0.5) * 10, // X: Spread wide
            (Math.random() - 0.5) * 10, // Y: Spread height
            (Math.random() - 0.5) * 5 - 2 // Z: Behind robot mostly
        ),
        rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
        scale: Math.random() * 0.05 + 0.02, // Small cubes
        speed: Math.random() * 0.5 + 0.2, // Upward speed
        rotSpeed: Math.random() * 0.02 + 0.01,
        color: Math.random() > 0.5 ? color1 : color2
    })));

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        particles.current.forEach((particle, i) => {
            // Move up
            particle.position.y += particle.speed * delta;

            // Reset if too high
            if (particle.position.y > 5) {
                particle.position.y = -5;
                particle.position.x = (Math.random() - 0.5) * 10;
            }

            // Rotate
            particle.rotation.x += particle.rotSpeed;
            particle.rotation.y += particle.rotSpeed;

            // Update dummy object
            dummy.position.copy(particle.position);
            dummy.rotation.copy(particle.rotation);
            dummy.scale.setScalar(particle.scale);
            dummy.updateMatrix();

            // Apply to instance
            meshRef.current!.setMatrixAt(i, dummy.matrix);

            // Apply color
            color.set(particle.color);
            meshRef.current!.setColorAt(i, color);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial toneMapped={false} transparent opacity={0.6} />
        </instancedMesh>
    );
}

export default function ThreeRobot() {
    const isMobile = useIsMobile();
    const [ready, setReady] = useState(false);

    return (
        <div className="three-wrapper">
            {/* Loading Overlay */}
            <div className={`loader ${ready ? 'hidden' : ''}`}>
                <div className="spinner"></div>
                <p>Loading Robot...</p>
            </div>

            <div className={`canvas-container ${ready ? 'visible' : ''}`}>
                <Canvas camera={{ position: [0, 0, 5], fov: isMobile ? 50 : 45 }} gl={{ antialias: true, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5, alpha: true }}>
                    <CameraController isMobile={isMobile} />

                    {/* Signal when scene is ready */}
                    <Startup onReady={() => setReady(true)} />

                    {/* Lighting - Clean Studio Lighting for White Ceramic */}
                    <ambientLight intensity={0.4} />
                    <pointLight position={[10, 10, 10]} intensity={1.0} color="#ffffff" />
                    <spotLight position={[-5, 5, 5]} angle={0.5} penumbra={1} intensity={1.5} color="#ff007f" /> {/* Pink Rim Light */}
                    <spotLight position={[5, -5, 5]} angle={0.5} penumbra={1} intensity={1.5} color="#00ffff" /> {/* Cyan Rim Light */}
                    <pointLight position={[0, 2, 3]} intensity={0.8} color="#ffffff" /> {/* Front Fill */}

                    <WhiteCuteRobot scale={isMobile ? 1.15 : 1.6} />

                    {/* Digital Data Flow Background */}
                    <DataParticles count={isMobile ? 60 : 150} />

                    {/* Particles - Subtle Pink/White */}
                    <Sparkles count={isMobile ? 50 : 100} scale={10} size={2} speed={0.2} opacity={0.5} color="#ff007f" />
                    <Stars radius={100} depth={50} count={isMobile ? 1000 : 5000} factor={4} saturation={0} fade speed={1} />

                    <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} color="#000000" />
                    <Environment preset="city" blur={0} background={false} />
                </Canvas>
            </div>

            <style jsx>{`
                .three-wrapper {
                    width: 100%;
                    height: 100%;
                    min-height: 400px;
                    background: transparent;
                    position: relative;
                }
                .canvas-container {
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    transition: opacity 1s ease-in-out;
                }
                .canvas-container.visible {
                    opacity: 1;
                }
                .loader {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                    z-index: 10;
                    transition: opacity 0.5s ease-out;
                    pointer-events: none;
                }
                .loader.hidden {
                    opacity: 0;
                }
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top-color: #ff007f;
                    animation: spin 1s ease-in-out infinite;
                    margin-bottom: 1rem;
                }
                p {
                    color: #ff007f;
                    font-size: 0.9rem;
                    font-weight: 500;
                    letter-spacing: 0.05em;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

// Helper to signal when everything is loaded
function Startup({ onReady }: { onReady: () => void }) {
    useEffect(() => {
        // Small delay to ensure layout is stable
        const timer = setTimeout(() => {
            onReady();
        }, 100);
        return () => clearTimeout(timer);
    }, [onReady]);
    return null;
}
