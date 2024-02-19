declare module "*.glsl" {
  const content: string;
  export default content;
}

declare namespace JSX {
  interface IntrinsicElements {
    customShaderMaterial: ReactThreeFiber.Object3DNode<
      THREE.ShaderMaterial,
      typeof THREE.ShaderMaterial
    > & {
      // Define any props your customShaderMaterial accepts
      uniforms: { [uniform: string]: { value: any } };
    };
  }
}
