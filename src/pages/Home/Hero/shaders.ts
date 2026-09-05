export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  precision highp float;

  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uRadius;
  uniform float uSpeed;
  uniform float uImageAspect;
  uniform float uTurbulenceIntensity;

  varying vec2 vUv;

  // Simple pseudo-random hash generator for 2D noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  // 2D Value Noise function
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // Fractal Brownian Motion (FBM) - layered noise for the organic, jagged look
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p = rot * p * 2.0 + shift;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    // Adjust texture coordinates based on aspect ratios to prevent image stretching
    float canvasAspect = uResolution.x / uResolution.y;
    vec2 textureUv = vUv;
    
    if (canvasAspect > uImageAspect) {
      float scale = uImageAspect / canvasAspect;
      textureUv.y = (vUv.y - 0.5) * scale + 0.5;
    } else {
      float scale = canvasAspect / uImageAspect;
      textureUv.x = (vUv.x - 0.5) * scale + 0.5;
    }

    // Apply aspect ratio correction to calculate an absolute circle mask on the screen
    vec2 aspectCorrectedUv = vUv;
    vec2 aspectCorrectedMouse = uMouse;
    aspectCorrectedUv.x *= canvasAspect;
    aspectCorrectedMouse.x *= canvasAspect;

    // Create moving turbulence over time
    vec2 noiseUv = aspectCorrectedUv * 4.0 + vec2(0.0, uTime * uSpeed);
    float turbulence = fbm(noiseUv) * uTurbulenceIntensity;

    // Distort the circular mask boundary with the turbulence noise
    float dist = distance(aspectCorrectedUv, aspectCorrectedMouse) - turbulence;

    // Smoothstep mask boundary: 1.0 inside the lens, fading to 0.0 outside
    float mask = smoothstep(uRadius, uRadius - 0.08, dist);

    // Fetch texture color
    vec4 texColor = texture2D(uTexture, textureUv);

    // Calculate psychedelic look: inverted grayscale
    float grayValue = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    vec3 brandColor = vec3(209.0 / 255.0, 183.0 / 255.0, 151.0 / 255.0);
    vec3 customColor = vec3(1.0 - grayValue) * brandColor;
    vec3 trippyInverted = vec3(1.0 - grayValue);

    // Blend the original color with the trippy inverted color using our turbulent mask
    vec3 finalColor = mix(texColor.rgb, customColor, mask);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
