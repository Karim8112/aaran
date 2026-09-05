import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
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

  const [displayChildren, setDisplayChildren] = useState<ReactNode>(children);
  const [pendingChildren, setPendingChildren] = useState<ReactNode | null>(
    null,
  );

  // Track window size in state to trigger re-renders on resize
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  const blocksRef = useRef<(HTMLDivElement | null)[]>([]);
  const isFirstRender = useRef(true);

  const getRowBlocks = (rowNum: number) => {
    const startIndex = rowNum * COLS;
    return blocksRef.current.slice(startIndex, startIndex + COLS);
  };
  // Shutter Close Transition (Animate In)

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Capture updates when router pages switch
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPendingChildren(children);
  }, [children, location.pathname]); // Added location.pathname to ensure it triggers on route change

  // Handle the custom transition cycle
  useEffect(() => {
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
          0, // Using absolute 0 ensures all rows start at the exact same time
        );
      }
    };

    // Shutter Open Transition (Animate Out)
    const animateOut = () => {
      const tl = gsap.timeline();

      for (let r = 0; r < ROWS; r++) {
        const rowBlocks = getRowBlocks(r);
        const isEven = r % 2 === 0;

        tl.to(
          rowBlocks,
          {
            scaleX: 0,
            duration: 0.6,
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

    if (pendingChildren) {
      // Shutter Closing (leaving current route)
      animateIn(() => {
        setDisplayChildren(pendingChildren);
        setPendingChildren(null);
      });
    } else if (!isFirstRender.current) {
      // Shutter Opening (entering new route)
      animateOut();
    }
  }, [pendingChildren]);

  // Helper to query block references per row

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
            // Assign the DOM node to our ref array
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

  return (
    <>
      <div className="transition-grid">{renderBlocks()}</div>
      {displayChildren}
    </>
  );
}
