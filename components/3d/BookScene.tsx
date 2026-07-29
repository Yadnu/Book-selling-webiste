'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function BookScene() {
  const bookRef = useRef<THREE.Group>(null!);
  const particlesRef = useRef<THREE.Points>(null!);

  // Generate procedural fog particles
  const particleCount = 150;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 12;
    positions[i + 1] = (Math.random() - 0.5) * 8;
    positions[i + 2] = (Math.random() - 0.5) * 8;
  }

  useFrame((state, delta) => {
    // Gentle rotation of the book mesh
    if (bookRef.current) {
      bookRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.25 + 0.2;
      bookRef.current.rotation.x = Math.cos(state.clock.getElapsedTime() * 0.3) * 0.08;
    }

    // Slow fog particle drift
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} color="#C78D4E" />
      <pointLight position={[-4, 2, -2]} intensity={1.2} color="#1C373E" />

      {/* Floating 3D Book */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <group ref={bookRef} position={[0, 0, 0]}>
          {/* Hardcover Outer Binding */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.4, 3.4, 0.45]} />
            <meshStandardMaterial
              color="#16202C"
              roughness={0.4}
              metalness={0.1}
              bumpScale={0.02}
            />
          </mesh>

          {/* Spine Accent */}
          <mesh position={[-1.21, 0, 0]}>
            <boxGeometry args={[0.04, 3.42, 0.47]} />
            <meshStandardMaterial color="#C78D4E" roughness={0.3} metalness={0.7} />
          </mesh>

          {/* Gilded Page Edges */}
          <mesh position={[0.05, 0, 0]}>
            <boxGeometry args={[2.25, 3.25, 0.38]} />
            <meshStandardMaterial color="#E4B178" roughness={0.5} metalness={0.6} />
          </mesh>

          {/* Debossed Gold Foil Title Text */}
          <Text
            position={[0, 0.6, 0.23]}
            fontSize={0.22}
            color="#C78D4E"
            anchorX="center"
            anchorY="middle"
          >
            THE SALT LIGHT
          </Text>
          <Text
            position={[0, 0.3, 0.23]}
            fontSize={0.22}
            color="#C78D4E"
            anchorX="center"
            anchorY="middle"
          >
            KEEPER
          </Text>

          <Text
            position={[0, -0.6, 0.23]}
            fontSize={0.12}
            color="#98B0B7"
            anchorX="center"
            anchorY="middle"
          >
            ARTHUR MILTON
          </Text>
        </group>
      </Float>

      {/* Atmospheric Fog Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#98B0B7"
          transparent
          opacity={0.4}
          sizeAttenuation
        />
      </points>

      {/* Ground Mirror Reflection */}
      <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={512}
          mirror={0.4}
          mixBlur={0.8}
          mixStrength={1.5}
          roughness={0.6}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0D131A"
          metalness={0.5}
        />
      </mesh>
    </>
  );
}
