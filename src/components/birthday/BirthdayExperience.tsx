import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Camera, Heart, Mail, Music2, Sparkles, Volume2, VolumeX, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import characterUnlit from "@/assets/birthday-friend-cake-unlit.png";
import { Button } from "@/components/ui/button";
import { birthdayContent } from "./birthday-data";

type Letter = (typeof birthdayContent.letters)[number];
type Memory = (typeof birthdayContent.memories)[number];

const particles = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  left: `${(index * 41 + 7) % 100}%`,
  top: `${(index * 29 + 11) % 94}%`,
  delay: (index % 7) * 0.35,
  symbol: index % 4 === 0 ? "♡" : index % 3 === 0 ? "✦" : "·",
}));

function playChime(type: "blow" | "open" | "final") {
  if (typeof window === "undefined") return;
  const AudioContextClass = window.AudioContext ??
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const notes = type === "blow" ? [523, 659, 784] : type === "final" ? [392, 523, 659, 784] : [659, 784];
  notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + index * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + index * 0.08 + 0.55);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(context.currentTime + index * 0.08);
    oscillator.stop(context.currentTime + index * 0.08 + 0.6);
  });
}

export function BirthdayExperience() {
  const [candlesOut, setCandlesOut] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [activeLetter, setActiveLetter] = useState<Letter | null>(null);
  const [activeMemory, setActiveMemory] = useState<Memory | null>(null);
  const [finalOpen, setFinalOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const storyRef = useRef<HTMLElement>(null);

  const celebrate = useCallback(() => {
    if (candlesOut) return;
    setCandlesOut(true);
    setCelebrating(true);
    if (soundOn) playChime("blow");
    window.setTimeout(() => setCelebrating(false), 2200);
    window.setTimeout(() => storyRef.current?.scrollIntoView({ behavior: "smooth" }), 1800);
  }, [candlesOut, soundOn]);

  return (
    <main className="overflow-hidden bg-background text-foreground">
      <AmbientParticles />
      <MusicToggle soundOn={soundOn} onToggle={() => setSoundOn((value) => !value)} />
      <BirthdayIntro candlesOut={candlesOut} onCelebrate={celebrate} />
      <ConfettiEffect active={celebrating} />

      <section ref={storyRef} className="story-surface relative px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="A tiny collection, just for you"
            title="Okay... now your real surprise begins 💌"
            subtitle="A few little things I wanted you to have."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {birthdayContent.letters.map((letter, index) => (
              <LetterCard key={letter.title} letter={letter} index={index} onOpen={() => {
                setActiveLetter(letter);
                if (soundOn) playChime("open");
              }} />
            ))}
          </div>
        </div>
      </section>

      <MemoryGallery onSelect={setActiveMemory} />
      <FinalLetter onOpen={() => {
        setFinalOpen(true);
        if (soundOn) playChime("final");
      }} />

      <LetterModal letter={activeLetter} onClose={() => setActiveLetter(null)} />
      <PhotoModal memory={activeMemory} onClose={() => setActiveMemory(null)} />
      <FinalLetterModal open={finalOpen} onClose={() => setFinalOpen(false)} />
    </main>
  );
}

export function BirthdayIntro({ candlesOut, onCelebrate }: { candlesOut: boolean; onCelebrate: () => void }) {
  const reduceMotion = useReducedMotion();
  const [listening, setListening] = useState(false);
  const listen = async () => {
    if (!navigator.mediaDevices?.getUserMedia) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setListening(true);
      const context = new AudioContext();
      const analyser = context.createAnalyser();
      const source = context.createMediaStreamSource(stream);
      const values = new Uint8Array(analyser.frequencyBinCount);
      source.connect(analyser);
      const started = Date.now();
      const check = () => {
        analyser.getByteFrequencyData(values);
        const average = values.reduce((sum, value) => sum + value, 0) / values.length;
        if (average > 42) {
          stream.getTracks().forEach((track) => track.stop());
          void context.close();
          setListening(false);
          onCelebrate();
        } else if (Date.now() - started < 8000) requestAnimationFrame(check);
        else {
          stream.getTracks().forEach((track) => track.stop());
          void context.close();
          setListening(false);
        }
      };
      check();
    } catch {
      setListening(false);
    }
  };

  return (
    <section className="intro-scene relative flex min-h-[100svh] items-center px-5 py-12 sm:px-8">
      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="order-2 text-center lg:order-1 lg:text-left">
          <span className="eyebrow">A little birthday magic</span>
          <h1 className="mt-4 font-display text-5xl leading-[1.03] sm:mt-5 sm:text-6xl lg:text-7xl">
            Happy Birthday,<br /><span className="text-primary">{birthdayContent.friendName}</span> 🎂
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground sm:mt-6 sm:text-lg lg:mx-0">Someone made a little surprise for you...</p>
          <p className="mt-5 font-hand text-2xl text-accent-foreground sm:mt-8">Make a wish and blow the candles ✨</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3 sm:mt-7 lg:justify-start">
            <Button size="lg" onClick={onCelebrate} disabled={candlesOut} className="h-12 rounded-full px-6 shadow-celebration">
              <Sparkles /> {candlesOut ? "Wish made!" : "Blow the candles"}
            </Button>
            {!candlesOut && (
              <Button size="lg" variant="outline" onClick={listen} className="h-12 rounded-full px-6 backdrop-blur-sm">
                <Volume2 /> {listening ? "Listening... blow now!" : "Use microphone"}
              </Button>
            )}
          </div>
        </motion.div>

        <motion.button
          type="button"
          onClick={onCelebrate}
          aria-label="Blow out the birthday candles"
          animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 4.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="character-button order-1 relative mx-auto block w-full max-w-[290px] cursor-pointer sm:max-w-[420px] lg:order-2 lg:max-w-[540px]"
        >
          <img src={characterUnlit} width={1024} height={1024} alt="A cheerful friend holding a birthday cake" className="w-full drop-shadow-character" />
          <AnimatePresence>
            {!candlesOut && <CandleFlames />}
          </AnimatePresence>
        </motion.button>
      </div>
      <div className="scroll-cue" aria-hidden="true"><span /></div>
    </section>
  );
}

function CandleFlames() {
  const positions = [44.8, 50.5, 55.7, 61.2, 67.1];
  return <>{positions.map((left, index) => (
    <motion.span key={left} exit={{ scale: 0, opacity: 0, y: -15 }} className="candle-flame" style={{ left: `${left}%`, top: `${21.3 + Math.abs(2 - index) * 0.25}%` }} />
  ))}</>;
}

export function LetterCard({ letter, index, onOpen }: { letter: Letter; index: number; onOpen: () => void }) {
  return (
    <motion.button type="button" onClick={onOpen} whileHover={{ y: -8, rotate: index === 1 ? 0 : index === 0 ? -1 : 1 }} whileTap={{ scale: 0.98 }} className="letter-envelope group text-left">
      <div className="envelope-flap" />
      <div className="relative z-10 flex min-h-60 flex-col justify-end p-7">
        <span className="mb-auto text-3xl">{letter.icon}</span>
        <span className="font-display text-2xl">{letter.title}</span>
        <span className="mt-2 text-sm text-muted-foreground">A note waiting for you</span>
      </div>
    </motion.button>
  );
}

export function LetterModal({ letter, onClose }: { letter: Letter | null; onClose: () => void }) {
  return (
    <ModalFrame open={Boolean(letter)} onClose={onClose} label="Close letter">
      {letter && <motion.article initial={{ rotateX: -12, y: 30, opacity: 0 }} animate={{ rotateX: 0, y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} className="paper-letter">
        <Mail className="mx-auto text-primary" />
        <p className="mt-7 font-hand text-3xl leading-relaxed text-foreground">{letter.body}</p>
        <div className="mt-10 text-center text-xl text-primary">♡</div>
      </motion.article>}
    </ModalFrame>
  );
}

export function MemoryGallery({ onSelect }: { onSelect: (memory: Memory) => void }) {
  return (
    <section className="memory-surface px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Keep these close" title="Three little memories 📸" subtitle="Because some moments deserve their own little place." />
        <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-6">
          {birthdayContent.memories.map((memory, index) => (
            <motion.button key={memory.label} type="button" onClick={() => onSelect(memory)} whileHover={{ y: -10, rotate: 0 }} whileTap={{ scale: 0.98 }} className={`polaroid polaroid-${index + 1}`}>
              <div className="photo-placeholder"><Camera /><span>{memory.label}</span><small>Replace image in birthday-data</small></div>
              <p className="font-hand text-2xl">{memory.caption}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PhotoModal({ memory, onClose }: { memory: Memory | null; onClose: () => void }) {
  return (
    <ModalFrame open={Boolean(memory)} onClose={onClose} label="Close memory">
      {memory && <motion.article layoutId={memory.label} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="memory-modal">
        <div className="photo-placeholder aspect-[4/3]"><Camera /><span>{memory.label}</span></div>
        <h3 className="mt-6 font-hand text-3xl">{memory.caption}</h3>
        <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{memory.message}</p>
      </motion.article>}
    </ModalFrame>
  );
}

export function FinalLetter({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="final-surface relative flex min-h-[78svh] items-center px-5 py-24 sm:px-8">
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <span className="font-hand text-2xl text-primary">One last thing...</span>
        <h2 className="mt-4 font-display text-5xl sm:text-6xl">And finally...</h2>
        <p className="mx-auto mt-5 max-w-lg text-muted-foreground">The kind of words that deserve to be kept, not hurried.</p>
        <motion.div className="mt-12" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={onOpen} size="lg" className="h-16 rounded-full px-9 text-base shadow-celebration"><Heart /> One Final Letter 💌</Button>
        </motion.div>
      </div>
    </section>
  );
}

function FinalLetterModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <ModalFrame open={open} onClose={onClose} label="Close final letter" cinematic>
      <motion.article initial={{ scale: 0.72, y: 50, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} transition={{ type: "spring", damping: 22 }} className="paper-letter final-letter">
        <div className="text-center text-2xl">✦</div>
        <h2 className="mt-5 text-center font-display text-4xl">To {birthdayContent.friendName} ❤️</h2>
        <p className="mt-8 font-hand text-2xl leading-relaxed sm:text-3xl">{birthdayContent.finalLetter}</p>
        <p className="mt-10 text-center font-display text-2xl">Happy Birthday once again! 🎂✨</p>
        <p className="mt-5 text-right font-hand text-2xl">— {birthdayContent.yourName}</p>
      </motion.article>
    </ModalFrame>
  );
}

function ModalFrame({ open, onClose, label, cinematic = false, children }: { open: boolean; onClose: () => void; label: string; cinematic?: boolean; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", close);
    };
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && <motion.div role="dialog" aria-modal="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`modal-backdrop ${cinematic ? "cinematic" : ""}`} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
        {cinematic && <AmbientParticles />}
        <Button variant="secondary" size="icon" onClick={onClose} aria-label={label} className="modal-close rounded-full"><X /></Button>
        <div className="relative z-10 w-full">{children}</div>
      </motion.div>}
    </AnimatePresence>
  );
}

export function MusicToggle({ soundOn, onToggle }: { soundOn: boolean; onToggle: () => void }) {
  return <Button variant="secondary" size="icon" onClick={onToggle} aria-label={soundOn ? "Mute sounds" : "Enable sounds"} title={soundOn ? "Mute sounds" : "Enable sounds"} className="fixed bottom-5 right-5 z-40 rounded-full shadow-soft backdrop-blur-md">{soundOn ? <Music2 /> : <VolumeX />}</Button>;
}

export function ConfettiEffect({ active }: { active: boolean }) {
  return <AnimatePresence>{active && <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">{Array.from({ length: 55 }, (_, index) => <motion.i key={index} className={`confetti confetti-${index % 5}`} initial={{ x: "50vw", y: "46vh", scale: 0, rotate: 0 }} animate={{ x: `${(index * 73) % 110 - 5}vw`, y: `${(index * 47) % 120 - 10}vh`, scale: [0, 1, 0.8], rotate: index * 57 }} transition={{ duration: 1.6 + (index % 5) * 0.12, ease: "easeOut" }} />)}</div>}</AnimatePresence>;
}

function AmbientParticles() {
  return <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">{particles.map((particle) => <motion.span key={particle.id} className="ambient-particle" style={{ left: particle.left, top: particle.top }} animate={{ y: [0, -12, 0], opacity: [0.25, 0.65, 0.25] }} transition={{ duration: 4 + particle.id % 3, repeat: Number.POSITIVE_INFINITY, delay: particle.delay }}>{particle.symbol}</motion.span>)}</div>;
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return <div className="mx-auto max-w-3xl text-center"><span className="eyebrow">{eyebrow}</span><h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">{title}</h2><p className="mt-4 text-lg text-muted-foreground">{subtitle}</p></div>;
}