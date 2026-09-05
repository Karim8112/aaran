import React, { useEffect, useRef, useState, type ReactNode } from "react";
import {
  useLocation,
  Routes,
  type Location as RouterLocation,
} from "react-router-dom";
import gsap from "gsap";

const ROWS = 4;
const COLS = 16;

interface TransitionProviderProps {
  children: ReactNode;
}

export default function TransitionProvider({
  children,
}: TransitionProviderProps) {
  const location = useLocation();

  // 1. Maintain a state for the currently displayed location.
  // This is the core fix to prevent React Router from instantly rendering the new page
  const [displayLocation, setDisplayLocation] = useState(location);

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  const blocksRef = useRef<(HTMLDivElement | null)[]>([]);
  const isFirstRender = useRef(true);
  const isTransitioning = useRef(false);

  const getRowBlocks = (rowNum: number) => {
    const startIndex = rowNum * COLS;
    return blocksRef.current.slice(
      startIndex,
      startIndex + COLS,
    ) as HTMLDivElement[];
  };

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle the custom transition cycle with delay
  useEffect(() => {
    // Skip on initial mount
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Prevent trigger if the path hasn't changed or if already animating
    if (location.pathname === displayLocation.pathname) return;
    if (isTransitioning.current) return;

    isTransitioning.current = true;

    // Shutter Close Transition (Animate In)
    const animateIn = (onComplete: () => void) => {
      const tl = gsap.timeline({ onComplete });
      for (let r = 0; r < ROWS; r++) {
        const rowBlocks = getRowBlocks(r);
        const isEven = r % 2 === 0;

        tl.to(
          rowBlocks,
          {
            scaleX: 1,
            duration: 0.6,
            ease: "power3.inOut",
            stagger: {
              each: 0.025,
              from: isEven ? "start" : "end",
            },
          },
          0, // Absolute 0 syncs all rows to start simultaneously
        );
      }
    };

    // Shutter Open Transition (Animate Out)
    const animateOut = () => {
      const tl = gsap.timeline({
        onComplete: () => {
          isTransitioning.current = false;
        },
      });
      for (let r = 0; r < ROWS; r++) {
        const rowBlocks = getRowBlocks(r);
        const isEven = r % 2 === 0;

        tl.to(
          rowBlocks,
          {
            scaleX: 0,
            duration: 0.3,
            ease: "power3.inOut",
            stagger: {
              each: 0.025,
              from: isEven ? "start" : "end",
            },
          },
          0,
        );
      }
    };

    // Trigger Transition Sequence:
    // 1. Close the shutters (old page remains visible under the closing shutter)
    animateIn(() => {
      // 2. Shutters are fully closed! Let's delay for 1.2 seconds (1200ms) to act as a loader
      setTimeout(() => {
        // 3. Update the display location to render the new page behind the closed shutters
        setDisplayLocation(location);

        // 4. Open the shutters in the next animation frame to reveal the new page smoothly
        requestAnimationFrame(() => {
          animateOut();
        });
      }, 10); // <-- Adjust this delay as needed (e.g., 1000 for 1 sec, 1200 for 1.2 sec)
    });
  }, [location, displayLocation.pathname]);

  // Generate the grid declaratively
  const renderBlocks = () => {
    const blockWidth = windowSize.width / COLS;
    const blockHeight = windowSize.height / ROWS;
    const blocks = [];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const index = r * COLS + c;
        const isEven = r % 2 === 0;

        blocks.push(
          <div
            key={index}
            ref={(el) => {
              blocksRef.current[index] = el;
            }}
            className="transition-block"
            style={{
              position: "absolute",
              width: `${blockWidth + 1}px`, // +1px buffer
              height: `${blockHeight + 1}px`, // +1px buffer
              left: `${c * blockWidth}px`,
              top: `${r * blockHeight}px`,
              transformOrigin: isEven ? "left" : "right",
              transform: "scaleX(0)", // Initial state
            }}
          />,
        );
      }
    }
    return blocks;
  };

  // Clone children and inject the controlled displayLocation prop into any <Routes> component.
  // This is what forces React Router's <Routes> to render the OLD page until displayLocation is updated.
  const clonedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === Routes) {
      return React.cloneElement(
        child as React.ReactElement<{ location: RouterLocation }>,
        {
          location: displayLocation,
        },
      );
    }
    return child;
  });

  return (
    <>
      <div
        className="transition-grid"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 9999,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {renderBlocks()}
      </div>
      {clonedChildren}
    </>
  );
}
