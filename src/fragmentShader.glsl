uniform float time; // Time uniform for animation
varying vec3 vNormal; // Interpolated normal for lighting calculations
uniform float resolution; // Uniform for the resolution of the canvas

void main() {
  vec2 st = gl_FragCoord.xy / resolution * 10.0;

  gl_FragColor = vec4(vec3(sin(time * 2.0), st.y, 0.8), 1.0);
}