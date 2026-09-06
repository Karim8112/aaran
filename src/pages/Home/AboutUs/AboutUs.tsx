import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// قائمة بيانات الصور لخدمة شريط الصور الدوار (الماركي)
const MARQUEE_IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
];

export default function AboutUs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);

  // مراجع لتخزين الكلمات والفقرات المقسمة برمجياً
  const paragraph1Ref = useRef<HTMLParagraphElement>(null);
  const paragraph2Ref = useRef<HTMLParagraphElement>(null);
  const paragraph3Ref = useRef<HTMLParagraphElement>(null);

  const wordBlocksRef = useRef<HTMLElement[][]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. تهيئة محرك التمرير الناعم
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let targetVelocity = 0;
    lenis.on("scroll", (e) => {
      targetVelocity = Math.abs(e.velocity) * 0.15;
      ScrollTrigger.update();
    });

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);

    // 2. محرك الماركي الذكي القابل لتسريع الدوران
    let marqueePos = 0;
    let smoothVelocity = 0;

    const marqueeTicker = () => {
      if (!trackRef.current) return;
      smoothVelocity += (targetVelocity - smoothVelocity) * 0.05;
      const baseSpeed = 1.5;
      const currentSpeed = baseSpeed + smoothVelocity * 10;

      marqueePos -= currentSpeed;
      const halfWidth = trackRef.current.scrollWidth / 2;
      if (marqueePos <= -halfWidth) {
        marqueePos = 0;
      }
      gsap.set(trackRef.current, { x: marqueePos });
      targetVelocity *= 0.95;
    };

    gsap.ticker.add(marqueeTicker);

    // 3. تقسيم الكلمات يدوياً (ماتش ميكر) بديل SplitText
    const splitParagraph = (pEl: HTMLParagraphElement | null) => {
      if (!pEl) return [];
      const text = pEl.textContent?.trim() || "";
      const words = text.split(" ");
      pEl.innerHTML = "";

      return words.map((word) => {
        const mask = document.createElement("span");
        mask.style.display = "inline-block";
        mask.style.overflow = "hidden";
        mask.style.verticalAlign = "bottom";
        mask.style.paddingBottom = "0.05em";

        const inner = document.createElement("span");
        inner.style.display = "inline-block";
        inner.style.willChange = "transform";
        inner.textContent = word + "\u00A0"; // الحفاظ على المسافة الفارغة

        mask.appendChild(inner);
        pEl.appendChild(mask);
        return inner;
      });
    };

    const block1 = splitParagraph(paragraph1Ref.current);
    const block2 = splitParagraph(paragraph2Ref.current);
    const block3 = splitParagraph(paragraph3Ref.current);

    wordBlocksRef.current = [block1, block2, block3];

    // إخفاء الأسطر اللاحقة بشكل افتراضي
    gsap.set(block2, { yPercent: 105 });
    gsap.set(block3, { yPercent: 105 });

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

    // 4. ربط التمرير بـ GSAP Context لضمان تجميع الذاكرة النظيفة
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;

          // تحديث المقياس البصري للشريط العلوي
          if (progressFillRef.current) {
            gsap.set(progressFillRef.current, { scaleX: progress });
          }

          const b1 = wordBlocksRef.current[0];
          const b2 = wordBlocksRef.current[1];
          const b3 = wordBlocksRef.current[2];

          if (progress <= 0.5) {
            const p1 = progress / 0.5;
            animateBlock(b1, b2, p1);
            gsap.set(b3, { yPercent: 105 });
          } else {
            const p2 = (progress - 0.5) / 0.5;
            gsap.set(b1, { yPercent: -105 });
            animateBlock(b2, b3, p2);
          }
        },
      });
    }, containerRef);

    // تنظيف المؤقتات والـ Listeners ومحركات التمرير عند إلغاء التحميل
    return () => {
      lenis.destroy();
      gsap.ticker.remove(raf);
      gsap.ticker.remove(marqueeTicker);
      ctx.revert();
    };
  }, []);

  return (
    <>
      {/* مؤشر التقدم العلوي */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-white/10 z-50">
        <div
          ref={progressFillRef}
          className="w-full h-full bg-[#d1b797] origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      <div
        ref={containerRef}
        className="w-full h-[600vh] relative bg-[#0b0b0b]"
      >
        {/* شاشة العرض الأساسية المثبتة في الفيو بورت */}
        <section className="fixed top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-center items-center">
          {/* حاوية النصوص المتراكبة فوق بعضها */}
          <div className="relative w-[85%] max-w-[1200px] h-[40vh] flex justify-center items-center">
            <div className="absolute w-full text-center">
              <p
                ref={paragraph1Ref}
                className="text-white text-3xl md:text-5xl font-medium leading-relaxed tracking-tight"
              >
                We design spaces that breathe, move, and tell your unique
                architectural story.
              </p>
            </div>

            <div className="absolute w-full text-center">
              <p
                ref={paragraph2Ref}
                className="text-white text-3xl md:text-5xl font-medium leading-relaxed tracking-tight"
              >
                Every blueprint is a commitment to engineering precision and
                sustainable innovation.
              </p>
            </div>

            <div className="absolute w-full text-center">
              <p
                ref={paragraph3Ref}
                className="text-white text-3xl md:text-5xl font-medium leading-relaxed tracking-tight"
              >
                From conception to final brick, we craft luxury contracting
                solutions for tomorrow.
              </p>
            </div>
          </div>

          {/* شريط الصور الدوار تفاعلي السرعة */}
          <div className="absolute bottom-[8vh] left-0 w-full overflow-hidden whitespace-nowrap">
            <div
              ref={trackRef}
              className="inline-flex gap-[2vw] will-change-transform"
            >
              {/* المجموعة الأولى من الصور */}
              {MARQUEE_IMAGES.map((src, i) => (
                <div
                  key={`orig-${i}`}
                  className="w-[180px] h-[120px] rounded-xl overflow-hidden shrink-0"
                >
                  <img
                    src={src}
                    className="w-full h-full object-cover"
                    alt={`Marquee ${i}`}
                  />
                </div>
              ))}

              {/* المجموعة المكررة للتمرير المتصل اللانهائي */}
              {MARQUEE_IMAGES.map((src, i) => (
                <div
                  key={`clone-${i}`}
                  className="w-[180px] h-[120px] rounded-xl overflow-hidden shrink-0"
                >
                  <img
                    src={src}
                    className="w-full h-full object-cover"
                    alt={`Marquee-Clone ${i}`}
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
