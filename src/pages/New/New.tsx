import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// تسجيل إضافات GSAP خارج المكون البرمجي لمنع تكرار الإعداد
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const GSAPScrollSequence: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLElement | null)[]>([]);
  const headerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // 1. تهيئة تنعيم التمرير Lenis للـ React
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // 2. إعداد الحركات البرمجية المتداخلة لـ GSAP داخل نطاق آمن لتجنب التكرار الذاتي للذاكرة
    const ctx = gsap.context(() => {
      // أ) تفعيل حركات تعبئة النصوص
      textRefs.current.forEach((el) => {
        if (!el) return;
        const text = el.textContent?.trim() || "";
        el.setAttribute("data-text", text);

        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 50%",
            end: "bottom 50%",
            scrub: true,
            onUpdate: (self) => {
              const clipValue = 100 - self.progress * 100;
              el.style.setProperty("--clip-progress", `${clipValue}%`);
            },
          },
        });
      });

      // ب) حركة تقاطع الأسطر الأفقية للـ Services عند الدخول
      const rows = headerRefs.current.filter(Boolean) as HTMLDivElement[];
      if (rows.length === 3) {
        gsap.set([rows[0], rows[2]], { xPercent: 150 });
        gsap.set(rows[1], { xPercent: -150 });

        ScrollTrigger.create({
          trigger: ".services",
          start: "top bottom",
          end: "top top",
          scrub: true,
          onUpdate: (self) => {
            const rightOffset = (1 - self.progress) * 150;
            const leftOffset = (1 - self.progress) * -150;

            gsap.set(rows[0], { xPercent: rightOffset });
            gsap.set(rows[1], { xPercent: leftOffset });
            gsap.set(rows[2], { xPercent: rightOffset });
          },
        });

        // ج) تثبيت قسم الخدمات بالكامل وتفعيل الانهيار الرأسي والتصغير
        ScrollTrigger.create({
          trigger: ".services",
          start: "top top",
          end: "+=200%",
          pin: true,
          pinSpacing: false,
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;

            if (progress <= 0.5) {
              const subProgress = progress / 0.5;
              const gap = (1 - subProgress) * 120;

              gsap.set(rows[0], { y: gap });
              gsap.set(rows[1], { y: 0 });
              gsap.set(rows[2], { y: -gap });
              gsap.set(rows, { scale: 1 });
            } else {
              const subProgress = (progress - 0.5) / 0.5;

              gsap.set(rows[0], { y: 0 });
              gsap.set(rows[1], { y: 0 });
              gsap.set(rows[2], { y: 0 });

              const isMobile = window.innerWidth < 768;
              const minScale = isMobile ? 0.45 : 0.25;
              const currentScale = 1 - subProgress * (1 - minScale);

              gsap.set(rows, { scale: currentScale });
            }
          },
        });
      }
    }, containerRef); // 👈 ربط النطاق بالحاوية لمنع تفلت العناصر عند التكرار

    // تنظيف جميع الذاكرة والمؤقتات المتبقية لتفادي مشاكل الأداء في الـ SPA
    return () => {
      lenis.destroy();
      gsap.ticker.remove(raf);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-[#0b0b0b] text-white overflow-hidden w-full"
    >
      {/* 1. Hero Section */}

      {/* 2. About Section */}

      {/* 3. Services Section */}
      <section className="services w-full h-screen flex justify-center items-center relative overflow-hidden z-[5]">
        <div className="services-container w-full flex flex-col justify-center items-center gap-[1.5vh] will-change-transform">
          <div
            ref={(el) => {
              if (el) headerRefs.current[0] = el;
            }}
            className="services-header row-top w-full max-w-[1300px] flex justify-center items-center will-change-transform z-[5] text-[#e5e5e5] opacity-90"
          >
            <svg viewBox="0 0 1000 120" className="w-full h-auto max-h-[18vh]">
              <text
                x="50%"
                y="70%"
                text-anchor="middle"
                fill="currentColor"
                className="font-black text-[110px] tracking-tight"
              >
                What We Do
              </text>
            </svg>
          </div>

          <div
            ref={(el) => {
              if (el) headerRefs.current[1] = el;
            }}
            className="services-header row-middle w-full max-w-[1300px] flex justify-center items-center will-change-transform z-[10] text-white"
          >
            <svg viewBox="0 0 1000 120" className="w-full h-auto max-h-[18vh]">
              <text
                x="50%"
                y="70%"
                text-anchor="middle"
                fill="currentColor"
                className="font-black text-[110px] tracking-tight"
              >
                What We Do
              </text>
            </svg>
          </div>

          <div
            ref={(el) => {
              if (el) headerRefs.current[2] = el;
            }}
            className="services-header row-bottom w-full max-w-[1300px] flex justify-center items-center will-change-transform z-[5] text-[#e5e5e5] opacity-90"
          >
            <svg viewBox="0 0 1000 120" className="w-full h-auto max-h-[18vh]">
              <text
                x="50%"
                y="70%"
                text-anchor="middle"
                fill="currentColor"
                className="font-black text-[110px] tracking-tight"
              >
                What We Do
              </text>
            </svg>
          </div>
        </div>
      </section>

      {/* 4. Services Copy Section */}
      <section className="services-copy w-full h-screen flex justify-center items-center px-8 md:px-16 mt-[155vh] relative z-[2]">
        <h2
          ref={(el) => {
            if (el) textRefs.current[1] = el;
          }}
          className="animate-text font-bold text-center relative"
        ></h2>
      </section>

      {/* 5. Outro Section */}
    </div>
  );
};

export default GSAPScrollSequence;
