/**
 * Cosmic WebGL shaders — ported from musicflow.
 * Pure GLSL; no framework coupling. Consumed by src/lib/hero-canvas.
 */

export const cosmicVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const cosmicFragmentShader = `
  precision mediump float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uSpeed;
  uniform float uMorphSpeed;
  uniform float uTwist;
  uniform float uComplexity;
  uniform float uBrightness;
  uniform float uAudioBass;
  uniform float uAudioLevel;
  uniform float uMode;
  uniform float uPerfMode;
  uniform float uScanlineIntensity;

  varying vec2 vUv;

  mat2 rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
  }

  float sdOctahedron(vec3 p, float s) {
    p = abs(p);
    return (p.x + p.y + p.z - s) * 0.57735027;
  }

  float map(vec3 p) {
    float time = uTime * uSpeed * 0.4;

    p.yz *= rot((uMouse.y - 0.5) * 0.8);
    p.xz *= rot((uMouse.x - 0.5) * 0.8 + time * 0.2);

    float audioPulse = 1.0 + uAudioBass * 0.6;
    float twistAmount = uTwist * (1.0 + uAudioLevel * 0.5);
    p.xy *= rot(p.z * twistAmount * 0.5 + time * 0.2);

    vec3 p1 = p;
    p1.xy *= rot(time * 0.5);
    p1.yz *= rot(time * 0.3);
    float d1 = sdOctahedron(p1, 1.2 * audioPulse);

    vec3 p2 = p;
    p2.xz *= rot(-time * 0.7);
    float ring1 = length(vec2(length(p2.xy) - 1.8 * audioPulse, p2.z)) - 0.06;
    float ring2 = length(vec2(length(p2.yz) - 2.2, p2.x)) - 0.04;

    return min(d1, min(ring1, ring2));
  }

  void main() {
    vec2 st = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);

    float lineMod2 = mod(floor(gl_FragCoord.y), 2.0);

    bool isSkippedScanline = false;
    if (uPerfMode > 0.5 && lineMod2 >= 1.0) {
      isSkippedScanline = true;
    }

    if (isSkippedScanline) {
      vec3 bgGlow = mix(uColor1 * 0.2, vec3(0.01, 0.005, 0.03), length(st) * 0.8);
      float barOverlay = 1.0 - uScanlineIntensity * 0.6;
      gl_FragColor = vec4(bgGlow * barOverlay * uBrightness, 1.0);
      return;
    }

    vec3 ro = vec3(0.0, 0.0, -3.8);
    vec3 rd = normalize(vec3(st, 1.2));

    float t = 0.0;
    float glow = 0.0;
    vec3 col = vec3(0.0);

    for (int i = 0; i < 40; i++) {
      vec3 p = ro + rd * t;
      float d = map(p);

      glow += 0.015 / (0.012 + abs(d) * (22.0 - uAudioBass * 9.0));

      if (d < 0.0025 || t > 8.0) break;
      t += d * 0.65;
    }

    vec3 p = ro + rd * t;
    if (t < 8.0) {
      vec2 e = vec2(0.005, 0.0);
      vec3 n = normalize(vec3(
        map(p + e.xyy) - map(p - e.xyy),
        map(p + e.yxy) - map(p - e.yxy),
        map(p + e.yyx) - map(p - e.yyx)
      ));

      vec3 lightDir = normalize(vec3(0.5, 0.8, -1.0));
      float diff = max(dot(n, lightDir), 0.15);
      float fresnel = pow(1.0 - max(dot(-rd, n), 0.0), 3.0);

      col = mix(uColor1, uColor2, diff);
      col += uColor3 * fresnel * 1.6;
    }

    vec3 glowCol = mix(uColor2, uColor3, sin(uTime * 0.5 + t) * 0.5 + 0.5);
    col += glowCol * glow * 0.45 * (1.0 + uAudioLevel * 0.8);

    vec3 bgCol = mix(uColor1 * 0.25, vec3(0.01, 0.005, 0.03), length(st) * 0.8);
    col = mix(bgCol, col, smoothstep(8.0, 2.0, t) * 0.9 + 0.1);

    float scanlineBar = sin(gl_FragCoord.y * 3.14159) * 0.5 + 0.5;
    col *= mix(1.0, 0.6 + 0.4 * scanlineBar, uScanlineIntensity);

    vec2 uvNorm = gl_FragCoord.xy / uResolution.xy;
    float vignette = uvNorm.x * uvNorm.y * (1.0 - uvNorm.x) * (1.0 - uvNorm.y);
    col *= clamp(pow(16.0 * vignette, 0.3), 0.0, 1.0);

    col *= uBrightness;

    gl_FragColor = vec4(col, 1.0);
  }
`;
