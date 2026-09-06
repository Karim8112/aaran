import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useVelocity,
  useSpring,
  useAnimationFrame,
  useMotionValue,
} from "framer-motion";
import type { MotionValue } from "framer-motion";

// مصفوفة من 10 صور معمارية فاخرة وفائقة الجودة لتزيين شريط الماركي اللانهائي
const MARQUEE_IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80",
];

const PARAGRAPHS = [
  "Led by Eng. Basel Al-Zahir, Aaran Contracting & Trading combines 20+ years of civil and MEP expertise with specialized heritage restoration. Blending traditional craftsmanship with modern technology, the firm revitalizes iconic landmarks, most notably the Citadel of Aleppo.",
  "A trusted partner for UN agencies, Aaran executes complex international projects in sensitive environments under strict HSE protocols. The firm maintains transparency and efficiency while humanizing urban spaces—from schools to citadels—for future generations.",
  "Guided by ISO 603, Aaran prioritizes workforce safety over productivity. Preventing injuries and accidents remains a fundamental responsibility. Continuous risk-avoidance training ensures an uncompromising safety culture for all personnel.",
];

// مكون فرعي لعزل تحريك كل كلمة على حدة برياضيات Framer Motion
interface WordProps {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}

const Word: React.FC<WordProps> = ({ word, progress, range }) => {
  const y = useTransform(progress, range, [12, 0]);
  const opacity = useTransform(progress, [range[0], range[1], 1], [0, 1, 1]);
  return (
    <span className="inline-block overflow-hidden mr-[0.24em] py-[0.08em]">
      <motion.span
        style={{ y, opacity }}
        className="inline-block will-change-transform"
      >
        {word}
      </motion.span>
    </span>
  );
};

// مكون تحريك الفقرة بشكل متوازن ومتدرج
interface ParagraphProps {
  text: string;
  progress: MotionValue<number>;
  range: [number, number];
  activeOpacity: MotionValue<number>;
  index: string;
  title: string;
}

const AnimatedParagraph: React.FC<ParagraphProps> = ({
  text,
  progress,
  range,
  activeOpacity,
  index,
  title,
}) => {
  const words = text.split(" ");
  const [start, end] = range;
  const totalWords = words.length;

  return (
    <motion.div
      style={{ opacity: activeOpacity }}
      className="flex flex-col gap-5 text-left select-none will-change-transform"
    >
      {/* الترويسة العلوية الفاخرة لكل عمود */}
      <div className="flex items-center gap-4 border-b border-white pb-3! ">
        <span className="font-mono text-[18px] text-[#d1b797] tracking-widest">
          {index}
        </span>
        <span className="font-sans font-semibold text-[16px] uppercase tracking-[0.25em] text-white/9003">
          {title}
        </span>
      </div>

      {/* نص الفقرة المصغر والأنيق */}
      <p className="text-white text-[15px] sm:text-[16px] md:text-[18px] lg:text-[19px] font-light leading-relaxed tracking-wide">
        {words.map((word, idx) => {
          // حساب زمني متناسق وموزع لكل كلمة داخل مجال تمرير الفقرة الخاصة بها
          const wordStart = start + (idx / totalWords) * (end - start) * 0.75;
          const wordEnd = wordStart + (end - start) * 0.22;
          return (
            <>
              <Word
                key={idx}
                word={word}
                progress={progress}
                range={[wordStart, Math.min(wordEnd, end)]}
              />{" "}
            </>
          );
        })}
      </p>
    </motion.div>
  );
};

export default function AboutUs() {
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. التقاط نسبة تقدم التمرير للقسم بالكامل (تم تمديد مسافة التمرير لـ 350vh لزيادة وقت القراءة)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 2. التحكم بشفافية شريط الصور اللانهائي (يختفي بسلاسة في آخر 15% من التمرير)
  const marqueeOpacity = useTransform(
    scrollYProgress,
    [0, 0.82, 0.95, 1],
    [1, 1, 1, 1],
  );

  // 3. التحكم بشفافية الأعمدة الثلاثة بشكل متتابع لخلق تركيز بصري (Editorial Focus Effect)
  // العمود الأول: يكون ساطعاً بالكامل في البداية، ثم يخفت تدريجياً لـ 35% عندما ينتقل التمرير للعمود الثاني
  const opacityColumn1 = useTransform(
    scrollYProgress,
    [0, 0.3, 0.38, 1],
    [1, 1, 0.1, 0.1],
  );

  // العمود الثاني: يكون خافتاً جداً في البداية، يسطع بالكامل بين 38% و 68%، ثم يخفت لـ 35% لصالح العمود الأخير
  const opacityColumn2 = useTransform(
    scrollYProgress,
    [0, 0.3, 0.38, 0.68, 0.75, 1],
    [0.15, 0.15, 1, 1, 0.1, 0.1],
  );

  // العمود الثالث: يكون خافتاً جداً في البداية، ويبدأ في السطوع الكامل من بعد 75% من مساحة التمرير
  const opacityColumn3 = useTransform(
    scrollYProgress,
    [0, 0.68, 0.75, 1],
    [0.15, 0.15, 1, 1],
  );

  // 4. محرك دوران وحركة شريط الصور التفاعلي المتأثر بسرعة التمرير
  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 300,
  });
  const velocityFactor = useTransform(smoothVelocity, [-1, 1], [-8, 8], {
    clamp: false,
  });

  const baseX = useMotionValue(-900);

  useAnimationFrame(() => {
    // سرعة دوران أساسية هادئة وسلسة للغاية
    let moveBy = -0.45 + velocityFactor.get();

    // وضع حدود أمان لسرعة الدوران لعدم تشتيت انتباه الزائر
    if (moveBy < -3.5) moveBy = -3.5;
    if (moveBy > 1.5) moveBy = 3.5;

    baseX.set(baseX.get() + moveBy);
  });

  // وظيفة تكرار حركة الشريط بسلاسة لا متناهية
  const wrapX = useTransform(baseX, (v) => {
    const limit = -1800; // مسافة التكرار المناسبة لحجم الصور
    return `${v % limit}px`;
  });

  return (
    <div ref={containerRef} className="w-full h-[600vh] relative bg-[#121212]">
      {/* حاوية الـ Sticky التي تضمن تثبيت الشاشة أثناء إتمام الحركة بالكامل */}
      <div className="sticky top-0 left-0 w-full h-screen flex flex-col justify-center items-center overflow-hidden">
        {/* شبكة توزيع الأعمدة الثلاثية المتباعدة أفقياً (Left, Middle, Right) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 lg:gap-20 w-[90%] max-w-[1350px] px-6 md:px-10 items-start -translate-y-[8vh]">
          {/* العمود الأول (أقصى اليسار) */}
          <AnimatedParagraph
            index="01"
            title="About AARAN"
            text={PARAGRAPHS[0]}
            progress={scrollYProgress}
            range={[0.05, 0.3]} // يكتمل تحريك كلماته في أول 30% من التمرير
            activeOpacity={opacityColumn1}
          />

          {/* العمود الثاني (في المنتصف تماماً) */}
          <AnimatedParagraph
            index="02"
            title="Global Vision"
            text={PARAGRAPHS[1]}
            progress={scrollYProgress}
            range={[0.38, 0.68]} // يكتمل تحريك كلماته بين 38% و 68% (مساحة كافية ومريحة جداً للقراءة!)
            activeOpacity={opacityColumn2}
          />

          {/* العمود الثالث (أقصى اليمين) */}
          <AnimatedParagraph
            index="03"
            title="Our Culture"
            text={PARAGRAPHS[2]}
            progress={scrollYProgress}
            range={[0.75, 0.95]} // يكتمل تحريك كلماته في آخر التمرير
            activeOpacity={opacityColumn3}
          />
        </div>

        {/* شريط الصور اللانهائي التفاعلي المدمج في الأسفل مع تلاشي خروجه بسلاسة */}
        <motion.div
          style={{ opacity: marqueeOpacity }}
          className="absolute bottom-[6vh] left-0 w-full overflow-hidden whitespace-nowrap pointer-events-none will-change-transform"
        >
          <motion.div
            style={{ x: wrapX }}
            className="inline-flex gap-[2vw] will-change-transform"
          >
            {/* الدورة الأولى للـ 10 صور */}
            {MARQUEE_IMAGES.map((src, i) => (
              <div
                key={`orig-${i}`}
                className="w-[170px] h-[110px] rounded-lg overflow-hidden shrink-0 border border-white/5 bg-neutral-900"
              >
                <img src={src} className="w-full h-full " alt={`Slider ${i}`} />
              </div>
            ))}

            {/* الدورة الثانية المكررة للضمان السلس وعدم حدوث قطع بصري */}
            {MARQUEE_IMAGES.map((src, i) => (
              <div
                key={`clone-${i}`}
                className="w-[170px] h-[110px] rounded-lg overflow-hidden shrink-0 border border-white/5 bg-neutral-900"
              >
                <img
                  src={src}
                  className="w-full h-full "
                  alt={`Slider-Clone ${i}`}
                />
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
