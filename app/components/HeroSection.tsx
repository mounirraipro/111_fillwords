'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

/* ── Floating letter config ── */
const LETTERS = [
    { x: '8%', y: '12%', size: 56, rotation: 15, delay: 0, letter: 'W', color: 'rgba(45,212,168,0.12)' },
    { x: '85%', y: '8%', size: 48, rotation: -20, delay: 0.3, letter: 'O', color: 'rgba(45,212,168,0.09)' },
    { x: '92%', y: '55%', size: 62, rotation: 35, delay: 0.6, letter: 'R', color: 'rgba(45,212,168,0.08)' },
    { x: '5%', y: '65%', size: 52, rotation: -10, delay: 0.9, letter: 'D', color: 'rgba(45,212,168,0.10)' },
    { x: '75%', y: '82%', size: 44, rotation: 25, delay: 1.2, letter: 'F', color: 'rgba(45,212,168,0.08)' },
    { x: '20%', y: '80%', size: 40, rotation: -30, delay: 0.5, letter: 'I', color: 'rgba(45,212,168,0.07)' },
    { x: '65%', y: '15%', size: 36, rotation: 45, delay: 0.8, letter: 'L', color: 'rgba(45,212,168,0.08)' },
    { x: '40%', y: '85%', size: 50, rotation: -15, delay: 1.0, letter: 'S', color: 'rgba(45,212,168,0.09)' },
];

/* ── Glowing orb config ── */
const ORBS = [
    { x: '15%', y: '25%', size: 300, color: 'rgba(45,212,168,0.04)' },
    { x: '80%', y: '60%', size: 340, color: 'rgba(45,212,168,0.03)' },
    { x: '50%', y: '10%', size: 220, color: 'rgba(94,231,196,0.04)' },
    { x: '30%', y: '70%', size: 260, color: 'rgba(45,212,168,0.025)' },
];

export default function HeroSection() {
    const heroRef = useRef<HTMLElement>(null);
    const lettersRef = useRef<(HTMLDivElement | null)[]>([]);
    const orbsRef = useRef<(HTMLDivElement | null)[]>([]);
    const badgeRef = useRef<HTMLParagraphElement>(null);
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const gameRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            /* ── Floating letters ── */
            lettersRef.current.forEach((el, i) => {
                if (!el) return;
                const cfg = LETTERS[i];

                gsap.fromTo(
                    el,
                    { opacity: 0, scale: 0, rotation: cfg.rotation - 40 },
                    {
                        opacity: 1,
                        scale: 1,
                        rotation: cfg.rotation,
                        duration: 1.2,
                        delay: 0.3 + cfg.delay * 0.5,
                        ease: 'elastic.out(1,0.5)',
                    }
                );

                gsap.to(el, {
                    y: `+=${15 + Math.random() * 20}`,
                    rotation: `+=${8 + Math.random() * 12}`,
                    duration: 3 + Math.random() * 3,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: cfg.delay,
                });
            });

            /* ── Glowing orbs ── */
            orbsRef.current.forEach((orb, i) => {
                if (!orb) return;
                gsap.fromTo(
                    orb,
                    { opacity: 0, scale: 0.6 },
                    { opacity: 1, scale: 1, duration: 2, delay: 0.5 + i * 0.3, ease: 'power2.out' }
                );
                gsap.to(orb, {
                    scale: 1.15,
                    opacity: 0.7,
                    duration: 4 + Math.random() * 2,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: i * 0.5,
                });
            });

            /* ── Text timeline ── */
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.fromTo(
                badgeRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8 }
            );

            if (headlineRef.current) {
                const text = headlineRef.current.innerText;
                const words = text.split(' ');
                headlineRef.current.innerHTML = words
                    .map((w) => `<span class="hero-word"><span class="hero-word-inner">${w}</span></span>`)
                    .join(' ');

                const wordInners = headlineRef.current.querySelectorAll('.hero-word-inner');
                tl.fromTo(
                    wordInners,
                    { y: '100%', opacity: 0 },
                    { y: '0%', opacity: 1, duration: 0.6, stagger: 0.08 },
                    '-=0.3'
                );
            }

            tl.fromTo(
                subtitleRef.current,
                { opacity: 0, y: 25 },
                { opacity: 1, y: 0, duration: 0.8 },
                '-=0.2'
            );

            tl.fromTo(
                gameRef.current,
                { opacity: 0, y: 30, scale: 0.96 },
                { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.2)' },
                '-=0.3'
            );

            tl.fromTo(
                scrollRef.current,
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.6 },
                '-=0.1'
            );

            gsap.to(scrollRef.current, {
                y: 8,
                duration: 1.2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: 2.5,
            });
        }, heroRef);

        /* ── Mouse parallax (desktop only) ── */
        const handleMouseMove = (e: MouseEvent) => {
            if (window.innerWidth < 768) return;
            const { clientX, clientY } = e;
            const xPercent = (clientX / window.innerWidth - 0.5) * 2;
            const yPercent = (clientY / window.innerHeight - 0.5) * 2;

            lettersRef.current.forEach((el, i) => {
                if (!el) return;
                const depth = 0.5 + (i % 3) * 0.3;
                gsap.to(el, {
                    x: `+=${xPercent * 12 * depth}`,
                    y: `+=${yPercent * 8 * depth}`,
                    duration: 1,
                    ease: 'power2.out',
                    overwrite: 'auto',
                });
            });

            orbsRef.current.forEach((orb, i) => {
                if (!orb) return;
                gsap.to(orb, {
                    x: `+=${xPercent * 6 * (i + 1) * 0.3}`,
                    y: `+=${yPercent * 4 * (i + 1) * 0.3}`,
                    duration: 1.5,
                    ease: 'power2.out',
                    overwrite: 'auto',
                });
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            ctx.revert();
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <section className="hero hero-full hero-with-game" ref={heroRef} id="game">
            {/* ── Background orbs ── */}
            {ORBS.map((orb, i) => (
                <div
                    key={`orb-${i}`}
                    ref={(el) => { orbsRef.current[i] = el; }}
                    className="hero-orb"
                    style={{
                        left: orb.x,
                        top: orb.y,
                        width: orb.size,
                        height: orb.size,
                        background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
                    }}
                />
            ))}

            {/* ── Floating letters ── */}
            {LETTERS.map((letter, i) => (
                <div
                    key={`letter-${i}`}
                    ref={(el) => { lettersRef.current[i] = el; }}
                    className="hero-tile hero-letter"
                    style={{
                        left: letter.x,
                        top: letter.y,
                        width: letter.size,
                        height: letter.size,
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '14px',
                            background: letter.color,
                            border: '1px solid rgba(45,212,168,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 800,
                            fontSize: `${letter.size * 0.5}px`,
                            color: 'rgba(45,212,168,0.3)',
                            userSelect: 'none',
                        }}
                    >
                        {letter.letter}
                    </div>
                </div>
            ))}

            {/* ── Grid pattern overlay ── */}
            <div className="hero-grid-overlay" />

            {/* ── Content ── */}
            <div className="container hero-content">
                <p className="hero-badge" ref={badgeRef}>
                    <span className="hero-badge-dot" />
                    Free to play · No downloads · Instant fun
                </p>

                <h1 ref={headlineRef}>
                    Find hidden words, one swipe at a time
                </h1>

                <p className="hero-subtitle" ref={subtitleRef}>
                    Slide through a grid of letters to discover hidden words. FillWords blends
                    the joy of word search with the strategy of puzzle solving into something addictively fun.
                </p>

                {/* ── Embedded Game ── */}
                <div className="hero-game-wrapper" ref={gameRef}>
                    <iframe
                        src="/game/index.html"
                        title="FillWords Game"
                        className="hero-game-iframe"
                        allow="autoplay"
                        loading="eager"
                    />
                </div>

                <div className="hero-cta" style={{ marginTop: '1.5rem' }}>
                    <Link href="/how-to-play" className="btn btn-secondary btn-hero">
                        How to Play
                    </Link>
                </div>
            </div>
        </section>
    );
}
