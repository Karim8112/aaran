import { useEffect, useRef } from "react";
import Basel from "../../../assets/Basel.png";
// Premium high-quality architectural/design images for the sticky preview

export default function StickyImageScroll() {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Setting up an Intersection Observer to detect which text block is active
    // and swap the sticky image smoothly based on the scroll position
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px", // Trigger when text is in the middle of the screen
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = entry.target.getAttribute("data-index");
          if (index !== null) {
            console.log(`Section ${index} is active`);
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className=" w-full min-h-[130vh]  text-white selection:bg-[#d1b797] selection:text-black py-[20vh]! px-[10vw]!">
      {/* Main Sticky Section Container */}
      <main className="w-full max-w-7xl mx-auto px-6 md:px-12 py-20">
        {/* flex row and flex col when mobile  */}
        <div className="flex flex-col-reverse md:flex-row gap-12 md:gap-20 items-stretch justify-between relative">
          {/* Left SIDE: Scrolling Text Column (Occupies 7 columns on desktop) */}
          <div className="w-full md:w-[55%] flex flex-col gap-32 md:gap-48 py-10">
            <div
              ref={(el) => {
                sectionRefs.current[0] = el;
              }}
              data-index={0}
              className="flex flex-col justify-center min-h-[20vh] transition-opacity duration-500 ease-in-out"
            ></div>{" "}
            <div
              ref={(el) => {
                sectionRefs.current[0] = el;
              }}
              data-index={0}
              className="flex flex-col justify-center min-h-[40vh] transition-opacity duration-500 ease-in-out"
            >
              rr
            </div>{" "}
            <div
              ref={(el) => {
                sectionRefs.current[0] = el;
              }}
              data-index={0}
              className="flex flex-col justify-center min-h-[40vh] transition-opacity duration-500 ease-in-out"
            >
              rr
            </div>
          </div>

          {/* Right SIDE: Sticky Image Column (Occupies 5 columns on desktop) */}

          <img
            src={Basel}
            className={`rounded-sm w-[25%]! h-[50vh] md:h-[65vh] md:sticky md:top-[17.5vh] absolute inset-0 object-cover transition-all duration-700 ease-in-out `}
          />
        </div>
      </main>
    </div>
  );
}
