import * as THREE from "three";
import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import vertexShader from "./vertexShader.glsl";
import fragmentShader from "./fragmentShader.glsl";

interface SphereProps {
  audioRef: React.RefObject<HTMLAudioElement>;
}

class CustomShaderMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0.0 },
        audioTexture: { value: null },
        test: { value: 0.0 },
        resolution: {
          value: new THREE.Vector2(),
        },
      },
      side: THREE.DoubleSide, // Render both sides of each face
    });
  }
}

extend({ CustomShaderMaterial });

const Sphere: React.FC<SphereProps> = ({ audioRef }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const analyserRef = useRef<AnalyserNode>();
  const dataArrayRef = useRef<Float32Array>();
  const textureRef = useRef<THREE.DataTexture>();

  useEffect(() => {
    if (audioRef.current) {
      const audioContext = new (window.AudioContext ||
        //@ts-ignore
        window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Float32Array(bufferLength);

      const texture = new THREE.DataTexture(
        dataArray,
        bufferLength,
        1,
        THREE.LuminanceFormat,
        THREE.UnsignedByteType
      );
      texture.needsUpdate = true;

      const source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
      textureRef.current = texture; // Make sure you define textureRef with useRef()

      return () => {
        source.disconnect();
        analyser.disconnect();
      };
    }
  }, [audioRef]);

  useFrame((state) => {
    if (
      mesh.current &&
      analyserRef.current &&
      dataArrayRef.current &&
      textureRef.current
    ) {
      analyserRef.current.getFloatFrequencyData(dataArrayRef.current);

      textureRef.current.image.data.set(dataArrayRef.current);
      textureRef.current.needsUpdate = true;

      console.log(
        (mesh.current.material as THREE.ShaderMaterial).uniforms.audioTexture
          .value
      ); // This should log your CustomShaderMaterial

      // console.log(dataArrayRef.current[44]);

      const material = mesh.current.material as CustomShaderMaterial;
      material.uniforms.audioTexture.value = dataArrayRef.current;
      material.uniforms.time.value = state.clock.getElapsedTime();
      material.uniforms.test.value = dataArrayRef.current[0];
      material.uniforms.resolution.value.set(
        window.innerWidth,
        window.innerHeight
      );

      mesh.current.rotation.x = state.clock.getElapsedTime() / 40;
      mesh.current.rotation.y = state.clock.getElapsedTime() / 70;
    }
  });

  return (
    <mesh
      visible
      userData={{ hello: "world" }}
      position={[0, 0, 0]}
      rotation={[Math.PI / 2, 0, 0]}
      ref={mesh}
      // uniforms-resolution-value={[window.innerWidth, window.innerHeight]}
    >
      <sphereGeometry args={[1, 64, 64]} attach="geometry" />
      <customShaderMaterial wireframe={true} />
    </mesh>
  );
};

function App() {
  const audioRef = useRef<HTMLAudioElement>(null);
  return (
    <>
      <Canvas
        shadows
        camera={{ position: [-5, 2, 10], fov: 20 }}
        style={{
          width: "100vw",
          height: "100vh",
          zIndex: -1,
          position: "fixed",
        }}
      >
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#d0d0d0", 5, 10]} />
        <ambientLight intensity={2} />
        <directionalLight position={[10, 10, 0]} intensity={1.5} />
        <directionalLight position={[-10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, 20, 0]} intensity={1.5} />
        <directionalLight position={[0, -10, 0]} intensity={0.25} />
        <directionalLight position={[0, 10, 0]} intensity={1.5} castShadow />
        <Sphere audioRef={audioRef} />
        <OrbitControls />
      </Canvas>
      <audio src="1.mp3" controls ref={audioRef} />
    </>
  );
}

export default App;
