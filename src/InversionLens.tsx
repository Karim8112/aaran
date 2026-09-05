import React, { useEffect, useRef, forwardRef } from "react";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shaders";

interface InversionLensProps {
  source: string;
  className?: string;
}

const InversionLens = forwardRef<HTMLDivElement, InversionLensProps>(
  ({ source, className = "" }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
    const uniformsRef = useRef<THREE.ShaderMaterial["uniforms"] | null>(null);
    const isSetupCompleteRef = useRef(false);

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

    const config = {
      maskRadius: 0.25, // Size of the hover lens
      maskSpeed: 0.8, // Speed of the organic ripple turbulence
      lerpFactor: 0.08, // Mouse trailing lag (smaller = smoother/slower follow)
      radiusLerpSpeed: 0.06, // Fade-in/out speed when cursor enters/leaves
      turbulenceIntensity: 0.12, // Jaggedness of the lens edge
    };

    const targetMouse = useRef({ x: 0.5, y: 0.5 });
    const lerpedMouse = useRef({ x: 0.5, y: 0.5 });
    const targetRadius = useRef(0.0);
    const lerpedRadius = useRef(0.0);
    const isInView = useRef(true);
    const isMouseInsideContainer = useRef(false);

    const lastMouseX = useRef(0);
    const lastMouseY = useRef(0);
    const animationFrameId = useRef(0);

    const setupScene = (texture: THREE.Texture) => {
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

      containerRef.current.appendChild(renderer.domElement);

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
    };

    const setupEventListeners = () => {
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
    };

    const animate = (timestamp: number) => {
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
        (targetRadius.current - lerpedRadius.current) * config.radiusLerpSpeed;
      uniforms.uRadius.value = lerpedRadius.current;

      uniforms.uTime.value = timestamp * 0.001;

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    useEffect(() => {
      if (isSetupCompleteRef.current || !containerRef.current || !source)
        return;

      const textureLoader = new THREE.TextureLoader();
      let resizeCleanup: (() => void) | undefined;
      let eventCleanup: (() => void) | undefined;

      textureLoader.load(source, (loadedTexture) => {
        resizeCleanup = setupScene(loadedTexture);
        eventCleanup = setupEventListeners();

        animationFrameId.current = requestAnimationFrame(animate);
        isSetupCompleteRef.current = true;
      });

      return () => {
        cancelAnimationFrame(animationFrameId.current);
        if (resizeCleanup) resizeCleanup();
        if (eventCleanup) eventCleanup();

        if (rendererRef.current) {
          const domElement = rendererRef.current.domElement;
          if (
            containerRef.current &&
            domElement &&
            containerRef.current.contains(domElement)
          ) {
            containerRef.current.removeChild(domElement);
          }
          rendererRef.current.dispose();
        }

        isSetupCompleteRef.current = false;
      };
    }, [source]);

    return (
      <div
        ref={containerRef}
        className={`inversion-lens-container ${className}`}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <img
          src={source}
          alt="Shader Source Texture"
          style={{ display: "none" }}
        />
      </div>
    );
  },
);

InversionLens.displayName = "InversionLens";
export default InversionLens;
