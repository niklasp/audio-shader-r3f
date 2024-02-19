uniform float time; // Time uniform for animation
varying vec3 vNormal; // Interpolated normal for lighting calculations
uniform float resolution; // Uniform for the resolution of the canvas
// uniform sampler2D audioData; // Uniform for the audio data texture
uniform float test;

void main() {
  vec2 st = gl_FragCoord.xy / resolution * 10.0;

  gl_FragColor = vec4(vec3(0.1, test / 255.0, 0.8), 1.0);
  // vec2 uv = gl_FragCoord.xy / resolution;
  // float fft = texture2D(audioData, vec2(uv.x * 0.25, 0)).r;
  // gl_FragColor = vec4(uv * pow(fft, 5.0), 0, 1);
}