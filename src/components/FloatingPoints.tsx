import React, { useRef, useMemo, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useAppColors } from '@/hooks/useAppColors'; // Keep import for type inference if needed, but won't be called here
import * as THREE from 'three'; // Import THREE for Vector3
import { QueryClientProvider } from '@tanstack/react-query'; // Keep import for type inference if needed, but won't be called here
import { queryClient } from '@/App'; // Keep import for type inference if needed, but won't be called here

interface FloatingPointsProps {
  primaryColorHex: string;
}

// FloatingPoints component handles the 3D logic
const FloatingPoints: React.FC<FloatingPointsProps> = ({ primaryColorHex }) => {
  const ref = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });
  
  const count = 10000; // Number of points

  // Generate random initial positions for points
  const [positions, initialPositions] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const initial = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20; // -10 to 10
      const y = (Math.random() - 0.5) * 20; // -10 to 10
      const z = (Math.random() - 0.5) * 20; // -10 to 10
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      initial[i * 3] = x;
      initial[i * 3 + 1] = y;
      initial[i * 3 + 2] = z;
    }
    return [positions, initial];
  }, [count]);

  // Handle mouse movement to update mouse position in 3D space
  const handleMouseMove = useCallback((event: MouseEvent) => {
    mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Animation loop
  useFrame(({ clock }) => {
    if (ref.current && ref.current.geometry.attributes.position) {
      const tempPositions = ref.current.geometry.attributes.position.array as Float32Array;
      const time = clock.getElapsedTime();

      const mouseVector = new THREE.Vector3(mouse.current.x * 10, mouse.current.y * 10, 0); // Scale mouse influence

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const ix = initialPositions[i3];
        const iy = initialPositions[i3 + 1];
        const iz = initialPositions[i3 + 2];

        // Apply subtle sinusoidal movement
        tempPositions[i3] = ix + Math.sin(time * 0.1 + ix) * 0.1;
        tempPositions[i3 + 1] = iy + Math.cos(time * 0.1 + iy) * 0.1;
        tempPositions[i3 + 2] = iz + Math.sin(time * 0.1 + iz) * 0.1;

        // Mouse interaction: push points away from mouse
        const pointVector = new THREE.Vector3(tempPositions[i3], tempPositions[i3 + 1], tempPositions[i3 + 2]);
        const distance = pointVector.distanceTo(mouseVector);
        const repulsionRadius = 2; // Radius of mouse influence
        const repulsionStrength = 0.05; // How strongly points are pushed

        if (distance < repulsionRadius) {
          const repulsionForce = (repulsionRadius - distance) / repulsionRadius * repulsionStrength;
          const direction = pointVector.clone().sub(mouseVector).normalize();
          tempPositions[i3] += direction.x * repulsionForce;
          tempPositions[i3 + 1] += direction.y * repulsionForce;
          tempPositions[i3 + 2] += direction.z * repulsionForce;
        }

        // Slowly return to initial position
        tempPositions[i3] += (ix - tempPositions[i3]) * 0.01;
        tempPositions[i3 + 1] += (iy - tempPositions[i3 + 1]) * 0.01;
        tempPositions[i3 + 2] += (iz - tempPositions[i3 + 2]) * 0.01;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointMaterial
        transparent
        color={primaryColorHex}
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
};

// Wrapper component for the 3D canvas
const FloatingPointsBackground = () => {
  const { appColors } = useAppColors(); // Call useAppColors here
  const primaryColorHex = appColors?.primary_color_hex || '#FF7F00'; // Default to corporate orange

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      {/* Background color is handled by the parent div's CSS */}
      {/* QueryClientProvider is no longer needed here as useAppColors is called above */}
      <FloatingPoints primaryColorHex={primaryColorHex} />
    </Canvas>
  );
};

export default FloatingPointsBackground;