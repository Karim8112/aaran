export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uRadius;
  uniform float uSpeed;
  uniform float uImageAspect;
  uniform float uTurbulenceIntensity;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

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
    float canvasAspect = uResolution.x / uResolution.y;
    vec2 textureUv = vUv;
    
    if (canvasAspect > uImageAspect) {
      float scale = uImageAspect / canvasAspect;
      textureUv.y = (vUv.y - 0.5) * scale + 0.5;
    } else {
      float scale = canvasAspect / uImageAspect;
      textureUv.x = (vUv.x - 0.5) * scale + 0.5;
    }

    vec2 aspectCorrectedUv = vUv;
    vec2 aspectCorrectedMouse = uMouse;
    aspectCorrectedUv.x *= canvasAspect;
    aspectCorrectedMouse.x *= canvasAspect;

    vec2 noiseUv = aspectCorrectedUv * 4.0 + vec2(0.0, uTime * uSpeed);
    float turbulence = fbm(noiseUv) * uTurbulenceIntensity;

    float dist = distance(aspectCorrectedUv, aspectCorrectedMouse) - turbulence;

    float mask = smoothstep(uRadius, uRadius - 0.08, dist);

    vec4 texColor = texture2D(uTexture, textureUv);

    float grayValue = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    vec3 trippyInverted = vec3(1.0 - grayValue);

    vec3 finalColor = mix(texColor.rgb, trippyInverted, mask);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
