import { useEffect, useRef } from "react";

interface FloatingLeafProps {
  src: string;
}

const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

const FloatingLeaf = ({ src }: FloatingLeafProps) => {
  const leafRef = useRef<HTMLImageElement>(null);
  const animationFrame = useRef<number>();

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  useEffect(() => {
    const leaf = leafRef.current;
    if (!leaf) return;

    // مركز مبدئي
    let baseX = getRandom(0, screenWidth);
    let baseY = getRandom(0, screenHeight);

    // سرعة الانجراف في الاتجاهات العامة (يسار/يمين، فوق/تحت)
    const driftX = getRandom(-0.2, 0.2);
    const driftY = getRandom(-0.2, 0.2);

    const frequencyX = getRandom(0.001, 0.003);
    const frequencyY = getRandom(0.001, 0.003);
    const amplitudeX = getRandom(100, 180);
    const amplitudeY = getRandom(100, 180);

    const baseScale = getRandom(1.3, 1.7);
    const angleSpeed = getRandom(0.2, 0.6);

    let angle = getRandom(0, 360);
    let t = getRandom(0, 1000);
    let tick = 0;

    const minSpeed = 1.5;
    const maxSpeed = 4.5;

    const animate = () => {
      tick += 1;
      const speedFactor =
        minSpeed + ((Math.sin(tick * 0.01) + 1) / 2) * (maxSpeed - minSpeed);

      t += speedFactor;

      // انجراف تدريجي لموقع مركز الورقة
      baseX += driftX;
      baseY += driftY;

      // الحفاظ على الورقة داخل الإطار
      if (baseX < 0) baseX = screenWidth;
      if (baseX > screenWidth) baseX = 0;
      if (baseY < 0) baseY = screenHeight;
      if (baseY > screenHeight) baseY = 0;

      const offsetX = Math.sin(t * frequencyX) * amplitudeX;
      const offsetY = Math.cos(t * frequencyY) * amplitudeY;

      const scaleMod = 1 + Math.sin(t * 0.01) * 0.2;
      angle += angleSpeed;

      if (leaf) {
        const x = baseX + offsetX;
        const y = baseY + offsetY;
        const scale = baseScale * scaleMod;

        leaf.style.transform = `translate(${x}px, ${y}px) scale(${scale}) rotate(${angle}deg)`;
        leaf.style.opacity = "1";
      }

      animationFrame.current = requestAnimationFrame(animate);
    };

    animationFrame.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  return (
    <img
      ref={leafRef}
      src={src}
      className="absolute w-24 h-24 object-contain pointer-events-none"
      style={{ opacity: 0, willChange: "transform, opacity" }}
    />
  );
};

export default FloatingLeaf;
