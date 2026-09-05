import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
} from "react";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shaders";

interface InversionLensProps {
  source: string;
  className?: string;
  maskRadius?: number; // Configurable circle size (prop added in previous turn)
}

interface InversionLensUniforms {
  uTexture: { value: THREE.Texture };
  uMouse: { value: THREE.Vector2 };
  uTime: { value: number };
  uResolution: { value: THREE.Vector2 };
  uRadius: { value: number };
  uSpeed: { value: number };
  uImageAspect: { value: number };
  uTurbulenceIntensity: { value: number };
}

const InversionLens = forwardRef<HTMLDivElement, InversionLensProps>(
  ({ source, className = "", maskRadius = 0.09 }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
    const uniformsRef = useRef<InversionLensUniforms | null>(null);
    const isSetupCompleteRef = useRef(false);

    // 1. Loading and Delay States
    const [shouldInit, setShouldInit] = useState(false);
    const [isCanvasReady, setIsCanvasReady] = useState(false);

    // Sync forwarded ref with our local containerRef
    useEffect(() => {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(containerRef.current);
      } else {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current =
          containerRef.current;
      }
    }, [ref]);

    const config = useMemo(
      () => ({
        maskRadius: maskRadius,
        maskSpeed: 0.8,
        lerpFactor: 0.08,
        radiusLerpSpeed: 0.06,
        turbulenceIntensity: 0.12,
      }),
      [maskRadius],
    );

    const targetMouse = useRef({ x: 0.5, y: 0.5 });
    const lerpedMouse = useRef({ x: 0.5, y: 0.5 });
    const targetRadius = useRef(0.0);
    const lerpedRadius = useRef(0.0);
    const isInView = useRef(true);
    const isMouseInsideContainer = useRef(false);
    const lastMouseX = useRef(0);
    const lastMouseY = useRef(0);
    const animationFrameId = useRef(0);

    // Setup 1-second delay after initial mount
    useEffect(() => {
      const timer = setTimeout(() => {
        setShouldInit(true);
      }, 1000); // 👈 Delays WebGL work by 1 second (adjust if needed)

      return () => clearTimeout(timer);
    }, []);

    const setupScene = useCallback(
      (texture: THREE.Texture) => {
        if (!containerRef.current) return;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        const image = texture.image as
          | { width: number; height: number }
          | undefined;
        const aspect = image ? image.width / image.height : 1;

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        cameraRef.current = camera;

        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;

        const uniforms = {
          uTexture: { value: texture },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uTime: { value: 0.0 },
          uResolution: { value: new THREE.Vector2(width, height) },
          uRadius: { value: 0.0 },
          uSpeed: { value: config.maskSpeed },
          uImageAspect: { value: aspect },
          uTurbulenceIntensity: { value: config.turbulenceIntensity },
        };
        uniformsRef.current = uniforms;

        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms,
          depthWrite: false,
          depthTest: false,
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height);
        rendererRef.current = renderer;

        // Prevent React 18 strict double canvas issues by removing any existing WebGL nodes
        containerRef.current
          .querySelectorAll("canvas")
          .forEach((canvas) => canvas.remove());
        containerRef.current.appendChild(renderer.domElement);

        // Force Canvas styles
        renderer.domElement.style.position = "absolute";
        renderer.domElement.style.top = "0";
        renderer.domElement.style.left = "0";
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.domElement.style.zIndex = "1";

        const handleResize = () => {
          if (
            !containerRef.current ||
            !rendererRef.current ||
            !uniformsRef.current
          )
            return;
          const w = containerRef.current.clientWidth;
          const h = containerRef.current.clientHeight;

          rendererRef.current.setSize(w, h);
          uniformsRef.current.uResolution.value.set(w, h);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      },
      [config.maskSpeed, config.turbulenceIntensity],
    );

    const setupEventListeners = useCallback(() => {
      const container = containerRef.current;
      if (!container) return;

      const updateCursorState = (clientX: number, clientY: number) => {
        lastMouseX.current = clientX;
        lastMouseY.current = clientY;

        const rect = container.getBoundingClientRect();
        const xInContainer = clientX - rect.left;
        const yInContainer = clientY - rect.top;

        const isInside =
          xInContainer >= 0 &&
          xInContainer <= rect.width &&
          yInContainer >= 0 &&
          yInContainer <= rect.height;

        isMouseInsideContainer.current = isInside;

        if (isInside) {
          targetMouse.current.x = xInContainer / rect.width;
          targetMouse.current.y = 1.0 - yInContainer / rect.height;
          targetRadius.current = config.maskRadius;
        } else {
          targetRadius.current = 0.0;
        }
      };

      const handleMouseMove = (e: MouseEvent) => {
        updateCursorState(e.clientX, e.clientY);
      };

      const handleScroll = () => {
        updateCursorState(lastMouseX.current, lastMouseY.current);
      };

      document.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("scroll", handleScroll);

      const observer = new IntersectionObserver(
        ([entry]) => {
          isInView.current = entry.isIntersecting;
          if (!entry.isIntersecting) {
            targetRadius.current = 0.0;
          }
        },
        { threshold: 0.1 },
      );

      observer.observe(container);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("scroll", handleScroll);
        observer.disconnect();
      };
    }, [config.maskRadius]);

    const animate = useCallback(
      (timestamp: number) => {
        animationFrameId.current = requestAnimationFrame(animate);

        if (
          !isInView.current ||
          !rendererRef.current ||
          !sceneRef.current ||
          !cameraRef.current ||
          !uniformsRef.current
        ) {
          return;
        }

        const uniforms = uniformsRef.current;

        lerpedMouse.current.x +=
          (targetMouse.current.x - lerpedMouse.current.x) * config.lerpFactor;
        lerpedMouse.current.y +=
          (targetMouse.current.y - lerpedMouse.current.y) * config.lerpFactor;
        uniforms.uMouse.value.set(lerpedMouse.current.x, lerpedMouse.current.y);

        lerpedRadius.current +=
          (targetRadius.current - lerpedRadius.current) *
          config.radiusLerpSpeed;
        uniforms.uRadius.value = lerpedRadius.current;

        uniforms.uTime.value = timestamp * 0.001;

        rendererRef.current.render(sceneRef.current, cameraRef.current);
      },
      [config.lerpFactor, config.radiusLerpSpeed],
    );

    useEffect(() => {
      if (
        !shouldInit ||
        isSetupCompleteRef.current ||
        !containerRef.current ||
        !source
      )
        return;

      const container = containerRef.current;

      const textureLoader = new THREE.TextureLoader();
      let resizeCleanup: (() => void) | undefined;
      let eventCleanup: (() => void) | undefined;

      textureLoader.load(source, (loadedTexture) => {
        resizeCleanup = setupScene(loadedTexture);
        eventCleanup = setupEventListeners();
        animationFrameId.current = requestAnimationFrame(animate);
        isSetupCompleteRef.current = true;

        // 2. WebGL is compiled and painted. Safely trigger the smooth crossfade!
        setIsCanvasReady(true);
      });

      return () => {
        cancelAnimationFrame(animationFrameId.current);
        if (resizeCleanup) resizeCleanup();
        if (eventCleanup) eventCleanup();

        if (rendererRef.current) {
          const domElement = rendererRef.current.domElement;
          if (domElement && container.contains(domElement)) {
            container.removeChild(domElement);
          }
          rendererRef.current.dispose();
        }
        isSetupCompleteRef.current = false;
        setIsCanvasReady(false);
      };
    }, [shouldInit, source, animate, setupEventListeners, setupScene]);

    return (
      <div
        ref={containerRef}
        className={`inversion-lens-container ${className}`}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          cursor: "none",
        }}
      >
        {/* Inline CSS fallback safety layer */}
        <style>{`
          .inversion-lens-container canvas {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
             cursor: "none",
          }
        `}</style>

        {/* 3. Static High-Performance Placeholder Layer */}
        <img
          src={source}
          alt="Spotlight Image Placeholder"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 2, // Sits above canvas initially
            transition: "opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
            opacity: isCanvasReady ? 0 : 1, // Smoothly fades out when canvas is compiled
            pointerEvents: "none",
          }}
        />
      </div>
    );
  },
);

InversionLens.displayName = "InversionLens";
export default InversionLens;
