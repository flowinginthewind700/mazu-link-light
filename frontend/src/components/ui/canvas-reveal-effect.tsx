"use client";

import { cn } from "@/components/lib/utils";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";

interface CanvasRevealEffectProps {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
}

export const CanvasRevealEffect: React.FC<CanvasRevealEffectProps> = ({
  animationSpeed = 0.4,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
}) => {
  const [fallbackToMotion, setFallbackToMotion] = useState(false);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setFallbackToMotion(true);
    }
  }, []);

  if (fallbackToMotion) {
    return (
      <MotionDotMatrix
        colors={colors}
        dotSize={dotSize ?? 3}
        opacities={opacities}
        containerClassName={containerClassName}
        showGradient={showGradient}
      />
    );
  }

  return (
    <div className={cn("h-full relative bg-white dark:bg-neutral-900 w-full", containerClassName)}>
      <div className="h-full w-full">
        <DotMatrix
          colors={colors}
          dotSize={dotSize ?? 3}
          opacities={opacities}
          shader={`
            float animation_speed_factor = ${animationSpeed.toFixed(1)};
            float intro_offset = distance(u_resolution / 2.0 / u_total_size, st2) * 0.01 + (random(st2) * 0.15);
            opacity *= step(intro_offset, u_time * animation_speed_factor);
            opacity *= clamp((1.0 - step(intro_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
          `}
          center={["x", "y"]}
        />
      </div>
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-[84%] dark:from-gray-900 dark:to-[84%]" />
      )}
    </div>
  );
};

interface DotMatrixProps {
  colors: number[][];
  opacities: number[];
  totalSize?: number;
  dotSize: number;
  shader: string;
  center: string[];
}

const DotMatrix: React.FC<DotMatrixProps> = ({
  colors,
  opacities,
  totalSize = 4,
  dotSize,
  shader,
  center,
}) => {
  const uniforms = useMemo(() => {
    let colorsArray = Array(6).fill(colors[0]);
    if (colors.length === 2) {
      colorsArray = [...Array(3).fill(colors[0]), ...Array(3).fill(colors[1])];
    } else if (colors.length === 3) {
      colorsArray = [...Array(2).fill(colors[0]), ...Array(2).fill(colors[1]), ...Array(2).fill(colors[2])];
    }

    return {
      u_colors: {
        value: colorsArray.map((color) => color.map((c) => c / 255)),
        type: "uniform3fv",
      },
      u_opacities: { value: opacities, type: "uniform1fv" },
      u_total_size: { value: totalSize, type: "uniform1f" },
      u_dot_size: { value: dotSize, type: "uniform1f" },
    };
  }, [colors, opacities, totalSize, dotSize]);

  return (
    <Shader
      source={`
        precision mediump float;
        in vec2 fragCoord;

        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        out vec4 fragColor;
        
        float PHI = 1.61803398874989484820459;
        
        float random(vec2 xy) {
            return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
        }
        
        void main() {
            vec2 st = fragCoord.xy;
            ${center.includes("x") ? "st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));" : ""}
            ${center.includes("y") ? "st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));" : ""}
            
            float opacity = step(0.0, st.x) * step(0.0, st.y);

            vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

            float frequency = 5.0;
            float show_offset = random(st2);
            float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency) + 1.0);
            opacity *= u_opacities[int(rand * 10.0)];
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

            vec3 color = u_colors[int(show_offset * 6.0)];

            ${shader}

            fragColor = vec4(color, opacity);
            fragColor.rgb *= fragColor.a;
        }
      `}
      uniforms={uniforms}
      maxFps={60}
    />
  );
};

interface ShaderMaterialProps {
  source: string;
  uniforms: Record<string, any>;
  maxFps?: number;
}

const ShaderMaterial: React.FC<ShaderMaterialProps> = ({
  source,
  uniforms,
  maxFps = 60,
}) => {
  const { size } = useThree();
  const ref = useRef<THREE.Mesh>(null);
  let lastFrameTime = 0;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const timestamp = clock.getElapsedTime();
    if (timestamp - lastFrameTime < 1 / maxFps) {
      return;
    }
    lastFrameTime = timestamp;

    const material = ref.current.material as THREE.ShaderMaterial;
    material.uniforms.u_time.value = timestamp;
  });

  const getUniforms = () => {
    const preparedUniforms: Record<string, any> = {};

    for (const uniformName in uniforms) {
      const uniform = uniforms[uniformName];

      switch (uniform.type) {
        case "uniform1f":
          preparedUniforms[uniformName] = { value: uniform.value };
          break;
        case "uniform3f":
          preparedUniforms[uniformName] = { value: new THREE.Vector3().fromArray(uniform.value) };
          break;
        case "uniform1fv":
          preparedUniforms[uniformName] = { value: uniform.value };
          break;
        case "uniform3fv":
          preparedUniforms[uniformName] = { value: uniform.value.map((v: number[]) => new THREE.Vector3().fromArray(v)) };
          break;
        case "uniform2f":
          preparedUniforms[uniformName] = { value: new THREE.Vector2().fromArray(uniform.value) };
          break;
        default:
          console.error(`Invalid uniform type for '${uniformName}'.`);
      }
    }

    preparedUniforms["u_time"] = { value: 0 };
    preparedUniforms["u_resolution"] = { value: new THREE.Vector2(size.width, size.height) };
    return preparedUniforms;
  };

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 fragCoord;
        void main() {
          fragCoord = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: source,
      uniforms: getUniforms(),
      transparent: true,
    });
  }, [size.width, size.height, source]);

  return (
    <mesh ref={ref}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

interface ShaderProps {
  source: string;
  uniforms: Record<string, any>;
  maxFps?: number;
}

const Shader: React.FC<ShaderProps> = ({ source, uniforms, maxFps = 60 }) => {
  return (
    <Canvas className="absolute inset-0 h-full w-full">
      <ShaderMaterial source={source} uniforms={uniforms} maxFps={maxFps} />
    </Canvas>
  );
};

interface MotionDotMatrixProps {
  colors: number[][];
  dotSize: number;
  opacities: number[];
  containerClassName?: string;
  showGradient?: boolean;
}

const MotionDotMatrix: React.FC<MotionDotMatrixProps> = ({
  colors,
  dotSize,
  opacities,
  containerClassName,
  showGradient
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const dots = useMemo(() => {
    const dotsArray = [];
    const totalSize = 20;
    const numDotsX = Math.ceil(dimensions.width / totalSize);
    const numDotsY = Math.ceil(dimensions.height / totalSize);

    for (let y = 0; y < numDotsY; y++) {
      for (let x = 0; x < numDotsX; x++) {
        dotsArray.push({
          x: x * totalSize,
          y: y * totalSize,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: opacities[Math.floor(Math.random() * opacities.length)]
        });
      }
    }

    return dotsArray;
  }, [dimensions, colors, opacities]);

  return (
    <div className={cn("h-full relative bg-white dark:bg-neutral-900 w-full", containerClassName)}>
      {dots.map((dot, index) => (
        <motion.div
          key={index}
          style={{
            position: 'absolute',
            left: dot.x,
            top: dot.y,
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            backgroundColor: `rgb(${dot.color[0]}, ${dot.color[1]}, ${dot.color[2]})`,
            opacity: dot.opacity
          }}
          animate={{
            opacity: [dot.opacity, dot.opacity * 0.5, dot.opacity],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
      ))}
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-[84%] dark:from-gray-900 dark:to-[84%]" />
      )}
    </div>
  );
};

export default CanvasRevealEffect;
