import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// 10 صور معمارية فاخرة ومثالية لتصميم الموقع البصري
const MARQUEE_IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1448630091924-883f6f93824a?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1504297366397-d3c95a71c2d6?auto=format&fit=crop&w=400&q=80",
];

const PARAGRAPHS = [
  "We design spaces that breathe, move, and tell your unique architectural story.",
  "Every blueprint is a commitment to engineering precision and sustainable innovation.",
  "From conception to final brick, we craft luxury contracting solutions for tomorrow.",
];

export default function ScrollWordTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const marqueeWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. مراقب سرعة التمرير (Scroll Velocity Tracker) لتفادي أي تعارض مع Lenis العالمي
    let lastScrollY = window.scrollY;
    let targetVelocity = 0;

    const trackScrollVelocity = () => {
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollY);
      targetVelocity = delta * 0.08;
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", trackScrollVelocity);

    // 2. حركة دوران الشريط اللانهائية فائقة النعومة والهدوء
    let marqueePos = 0;
    let smoothVelocity = 0;

    const marqueeTicker = () => {
      if (!trackRef.current) return;
      smoothVelocity += (targetVelocity - smoothVelocity) * 0.04;
      const baseSpeed = 0.8; // سرعة هادئة وسلسة للغاية
      const currentSpeed = baseSpeed + smoothVelocity * 2.0;

      marqueePos -= currentSpeed;
      const halfWidth = trackRef.current.scrollWidth / 2;
      if (marqueePos <= -halfWidth) {
        marqueePos = 0;
      }
      gsap.set(trackRef.current, { x: marqueePos });
      targetVelocity *= 0.93;
    };
    gsap.ticker.add(marqueeTicker);

    // 3. إعداد الحركات وسياق GSAP الآمن (GSAP Context)
    const ctx = gsap.context((self) => {
      // اختيار العناصر بشكل آمن داخل حاوية المكون الحالية فقط
      const b1 = self.selector?.(".block-0") as HTMLElement[];
      const b2 = self.selector?.(".block-1") as HTMLElement[];
      const b3 = self.selector?.(".block-2") as HTMLElement[];
      const paras = self.selector?.(".para-container") as HTMLElement[];

      if (!b1 || !b2 || !b3 || !paras) return;

      // إعداد افتراضي مخفي للكلمات والفقرات اللاحقة لمنع تضارب الظهور
      gsap.set(b2, { yPercent: 105 });
      gsap.set(b3, { yPercent: 105 });
      gsap.set(paras[1], { opacity: 0, visibility: "hidden" });
      gsap.set(paras[2], { opacity: 0, visibility: "hidden" });

      const OVERLAP_COUNT = 3.5;

      const getWordProgress = (
        phaseProgress: number,
        wordIndex: number,
        totalWords: number,
      ) => {
        const totalLength = 1 + OVERLAP_COUNT / totalWords;
        const scale = 1 / totalLength;

        const startTime = (wordIndex / totalWords) * scale;
        const endTime = startTime + (OVERLAP_COUNT / totalWords) * scale;
        const duration = endTime - startTime;

        if (phaseProgress < startTime) return 0;
        if (phaseProgress > endTime) return 1;
        return (phaseProgress - startTime) / duration;
      };

      const animateBlock = (
        outgoing: HTMLElement[],
        incoming: HTMLElement[],
        progress: number,
      ) => {
        outgoing.forEach((word, idx) => {
          const prog = getWordProgress(progress, idx, outgoing.length);
          gsap.set(word, { yPercent: -prog * 105 });
        });

        incoming.forEach((word, idx) => {
          const prog = getWordProgress(progress, idx, incoming.length);
          gsap.set(word, { yPercent: (1 - prog) * 105 });
        });
      };

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;

          // أ) مزامنة شريط التقدم الذهبي العلوي
          if (progressFillRef.current) {
            gsap.set(progressFillRef.current, { scaleX: progress });
          }

          // ب) تلاشي شريط الصور اللانهائي بنعومة تامة عند الاقتراب من نهاية القسم
          if (marqueeWrapperRef.current) {
            if (progress >= 0.85) {
              const fadeProgress = (progress - 0.85) / 0.15;
              gsap.set(marqueeWrapperRef.current, {
                opacity: 1 - fadeProgress,
              });
            } else {
              gsap.set(marqueeWrapperRef.current, { opacity: 1 });
            }
          }

          // ج) إدارة تلاشي الفقرات والظهور لمنع أي تداخل بصري
          if (progress <= 0.5) {
            const p1 = progress / 0.5;
            animateBlock(b1, b2, p1);
            gsap.set(b3, { yPercent: 105 });

            // تبديل الشفافية والظهور لحاوية النصوص
            gsap.set(paras[0], {
              opacity: 1 - p1,
              visibility: p1 >= 0.98 ? "hidden" : "visible",
            });
            gsap.set(paras[1], { opacity: p1, visibility: "visible" });
            gsap.set(paras[2], { opacity: 0, visibility: "hidden" });
          } else {
            const p2 = (progress - 0.5) / 0.5;
            gsap.set(b1, { yPercent: -105 });
            animateBlock(b2, b3, p2);

            gsap.set(paras[0], { opacity: 0, visibility: "hidden" });
            gsap.set(paras[1], {
              opacity: 1 - p2,
              visibility: p2 >= 0.98 ? "hidden" : "visible",
            });
            gsap.set(paras[2], { opacity: p2, visibility: "visible" });
          }
        },
      });
    }, containerRef);

    return () => {
      window.removeEventListener("scroll", trackScrollVelocity);
      gsap.ticker.remove(marqueeTicker);
      ctx.revert();
    };
  }, []);

  // دالة حقن النصوص المقسمة مع تفعيل قناع القص الفردي (Overflow Hidden)
  const renderSplitParagraph = (text: string, blockIndex: number) => {
    return text.split(" ").map((word, wordIndex) => (
      <span
        key={wordIndex}
        className="inline-flex overflow-hidden h-[1.25em] align-bottom pb-[0.05em]"
      >
        <span
          className={`inline-block will-change-transform block-${blockIndex}`}
        >
          {word}&nbsp;
        </span>
      </span>
    ));
  };

  return (
    <>
      {/* شريط مؤشر التمرير العلوي الفاخر */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-white/10 z-50">
        <div
          ref={progressFillRef}
          className="w-full h-full bg-[#d1b797] origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      <div
        ref={containerRef}
        className="w-full h-[250vh] relative bg-[#0b0b0b]"
      >
        <section className="fixed top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-center items-center">
          {/* الطبقة المركزية الحامية للنصوص */}
          <div className="relative w-[85%] max-w-[1200px] h-[40vh] flex justify-center items-center">
            <div className="absolute w-full text-center para-container">
              <p className="text-white text-3xl md:text-5xl font-medium leading-relaxed tracking-tight">
                {renderSplitParagraph(PARAGRAPHS[0], 0)}
              </p>
            </div>

            <div className="absolute w-full text-center para-container">
              <p className="text-white text-3xl md:text-5xl font-medium leading-relaxed tracking-tight">
                {renderSplitParagraph(PARAGRAPHS[1], 1)}
              </p>
            </div>

            <div className="absolute w-full text-center para-container">
              <p className="text-white text-3xl md:text-5xl font-medium leading-relaxed tracking-tight">
                {renderSplitParagraph(PARAGRAPHS[2], 2)}
              </p>
            </div>
          </div>

          {/* شريط عرض الصور اللانهائي والديناميكي */}
          <div
            ref={marqueeWrapperRef}
            className="absolute bottom-[8vh] left-0 w-full overflow-hidden whitespace-nowrap will-change-transform"
          >
            <div
              ref={trackRef}
              className="inline-flex gap-[2vw] will-change-transform"
            >
              {/* التكرار الأول لـ 10 صور */}
              {MARQUEE_IMAGES.map((src, i) => (
                <div
                  key={`orig-${i}`}
                  className="w-[180px] h-[120px] rounded-xl overflow-hidden shrink-0"
                >
                  <img
                    src={src}
                    className="w-full h-full object-cover"
                    alt={`Architectural Preview ${i}`}
                  />
                </div>
              ))}

              {/* التكرار الثاني المتطابق لتأمين الدوران اللانهائي النظيف */}
              {MARQUEE_IMAGES.map((src, i) => (
                <div
                  key={`clone-${i}`}
                  className="w-[180px] h-[120px] rounded-xl overflow-hidden shrink-0"
                >
                  <img
                    src={src}
                    className="w-full h-full object-cover"
                    alt={`Architectural Preview Clone ${i}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
