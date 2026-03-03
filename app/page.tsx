import type { Metadata } from 'next';
import Link from 'next/link';
import AdSlot from './components/AdSlot';
import HeroSection from './components/HeroSection';

export const metadata: Metadata = {
  title: 'FillWords – Free Online Word Puzzle Game',
  description: 'Play FillWords free online! Swipe through a grid of letters to find hidden words. A fun, addictive word puzzle game — no downloads needed.',
  keywords: ['FillWords', 'word puzzle', 'word search game', 'online word game', 'free word game', 'brain games', 'fill words puzzle'],
};

export default function Home() {
  return (
    <>
      {/* ── Hero with embedded game ── */}
      <HeroSection />

      {/* ── Social Proof Strip ── */}
      <section style={{
        padding: '2rem 0',
        borderTop: '1px solid var(--border-light)',
        borderBottom: '1px solid var(--border-light)',
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '3rem',
          flexWrap: 'wrap',
        }}>
          {[
            { value: '500+', label: 'Words to Find' },
            { value: '5', label: 'Word Categories' },
            { value: '0', label: 'Downloads Needed' },
            { value: '100%', label: 'Free Forever' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.03em',
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginTop: '0.2rem',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <AdSlot type="banner" />

      {/* ── What Makes It Different ── */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Not your ordinary word game</h2>
          <p className="section-subtitle">
            FillWords reimagines classic word search with a swipe-to-connect mechanic
            that is easy to learn and endlessly satisfying to master.
          </p>

          <div className="grid-3">
            <article className="card feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
              </div>
              <h3>Swipe to Connect</h3>
              <p>Draw a line through adjacent letters to spell out words. Intuitive touch and mouse controls make it easy from the first swipe.</p>
            </article>

            <article className="card feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4" /><path d="M12 18v4" /><path d="M4.93 4.93l2.83 2.83" /><path d="M16.24 16.24l2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" /><path d="M4.93 19.07l2.83-2.83" /><path d="M16.24 7.76l2.83-2.83" /></svg>
              </div>
              <h3>Smart Word Detection</h3>
              <p>The game instantly recognizes valid words as you trace them. Fill in all the words to clear the grid and advance.</p>
            </article>

            <article className="card feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
              </div>
              <h3>Hint System</h3>
              <p>Stuck on a tricky word? Use hints to reveal the first letter or highlight a word&apos;s path. No penalty for needing a nudge.</p>
            </article>

            <article className="card feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg>
              </div>
              <h3>Track Your Progress</h3>
              <p>See how many words you&apos;ve found and how fast you&apos;re solving. Challenge yourself to beat your personal bests.</p>
            </article>

            <article className="card feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
              </div>
              <h3>Play Anywhere</h3>
              <p>Desktop, tablet, or phone — FillWords adapts to your screen. No installs, just open and play.</p>
            </article>

            <article className="card feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              </div>
              <h3>Totally Free</h3>
              <p>No paywalls, no premium tiers, no ads-to-unlock. Every puzzle, every category — free.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ── Word Categories Showcase ── */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 className="section-title">Five categories to explore</h2>
          <p className="section-subtitle">
            From everyday objects to scientific terms — each category offers
            a unique vocabulary challenge with progressively harder grids.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '1rem',
            maxWidth: '700px',
            margin: '0 auto',
          }}>
            {[
              { name: 'Animals', icon: '🐾' },
              { name: 'Food & Drink', icon: '🍕' },
              { name: 'Science', icon: '🔬' },
              { name: 'Geography', icon: '🌍' },
              { name: 'Daily Mix', icon: '🎲' },
            ].map((cat) => (
              <div key={cat.name} style={{
                textAlign: 'center',
                padding: '1.75rem 0.75rem',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                transition: 'all var(--transition)',
                cursor: 'default',
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'var(--accent-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem',
                  fontSize: '1.3rem',
                }}>
                  {cat.icon}
                </div>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                }}>
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AdSlot type="banner" />

      {/* ── How It Feels ── */}
      <section className="section">
        <div className="container" style={{ maxWidth: '720px' }}>
          <h2 className="section-title">Designed for calm focus</h2>
          <p className="section-subtitle">
            FillWords is as much about the journey as the solution. Every interaction
            is crafted to feel smooth, satisfying, and never frustrating.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.25rem',
          }}>
            {[
              { title: 'Smooth animations', desc: 'Letters highlight and connect with buttery 60fps transitions. No jank, no stutter.' },
              { title: 'Satisfying feedback', desc: 'Correct words light up with visual feedback that makes every discovery feel rewarding.' },
              { title: 'Clean interface', desc: 'No clutter, no distractions. Just you, the grid, and a minimal, focused UI.' },
              { title: 'Brain-friendly pacing', desc: 'Progressive difficulty that challenges without overwhelming. Play at your own pace.' },
            ].map((item) => (
              <div key={item.title} style={{
                padding: '1.75rem',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
              }}>
                <h3 style={{ fontSize: '0.95rem', marginBottom: '0.4rem' }}>{item.title}</h3>
                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  margin: 0,
                }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{
        padding: '5rem 0',
        background: 'var(--bg-secondary)',
        textAlign: 'center',
        borderTop: '1px solid var(--border-light)',
      }}>
        <div className="container">
          <h2 style={{ marginBottom: '0.5rem' }}>Your next word puzzle is waiting</h2>
          <p style={{
            color: 'var(--text-secondary)',
            maxWidth: '400px',
            margin: '0 auto 2rem',
            fontSize: '0.95rem',
            lineHeight: 1.6,
          }}>
            No signup, no download. Scroll up and start finding words right now.
          </p>
          <Link href="/#game" className="btn btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '0.95rem' }}>
            Play FillWords Now
          </Link>
        </div>
      </section>
    </>
  );
}
