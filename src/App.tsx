import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type View = 'chat' | 'reflection' | 'patterns'

const starterPrompts = [
  'I feel a little all over the place',
  'Help me make sense of today',
  'I just need a small reset',
]

function App() {
  const [hasEntered, setHasEntered] = useState(false)
  const [view, setView] = useState<View>('chat')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<{ from: 'you' | 'essence'; text: string }[]>([
    { from: 'essence', text: 'Hey, I’m here. What’s been taking up space in your mind today?' },
  ])
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [mood, setMood] = useState('A little tangled')
  const [savedReflection, setSavedReflection] = useState(false)
  const [orbAwake, setOrbAwake] = useState(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isSending])

  function enterApp(nextView: View = 'chat') {
    setView(nextView)
    setHasEntered(true)
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedMessage = message.trim()
    if (!trimmedMessage || isSending) return

    const userMessage = { from: 'you' as const, text: trimmedMessage }
    const history = [...messages, userMessage].slice(-12).map((item) => ({
      role: item.from === 'you' ? 'user' : 'assistant',
      content: item.text,
    }))

    setMessages((current) => [...current, userMessage])
    setMessage('')
    setIsSending(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })
      const result: { reply?: string; error?: string } = await response.json()

      if (!response.ok || !result.reply) {
        throw new Error(result.error ?? 'I couldn’t get a reply just now. Please try again.')
      }

      setMessages((current) => [...current, { from: 'essence', text: result.reply! }])
    } catch (error) {
      const errorText = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      setMessages((current) => [...current, { from: 'essence', text: errorText }])
    } finally {
      setIsSending(false)
    }
  }

  if (!hasEntered) {
    return (
      <main className="landing">
        <header className="landing-nav">
          <a className="wordmark" href="#top" aria-label="ESSENCE home">essence<span>•</span></a>
          <span className="nav-note">A little space to be you</span>
          <button className="text-link" onClick={() => enterApp()}>Enter your space <span aria-hidden="true">↗</span></button>
        </header>

        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> A softer kind of self-understanding</p>
            <h1>ESSENCE</h1>
            <p className="hero-subtitle"><em>The Silent Spiral</em></p>
            <p className="hero-description">A guide to understanding<br />and nurturing the mind.</p>
            <button className="round-cta" onClick={() => enterApp()}>
              Find your way in <span className="cta-arrow" aria-hidden="true">↗</span>
            </button>
          </div>

          <button
            className={`spiral-scene ${orbAwake ? 'is-awake' : ''}`}
            onClick={() => setOrbAwake((awake) => !awake)}
            aria-label="Wake up the moving thought spiral"
            aria-pressed={orbAwake}
          >
            <span className="scene-caption caption-top">your inner world,</span>
            <span className="scene-caption caption-bottom">in its own orbit</span>
            <span className="spiral-ring ring-one" />
            <span className="spiral-ring ring-two" />
            <span className="spiral-ring ring-three" />
            <span className="spiral-core"><span /></span>
            <span className="orbit-dot dot-one" />
            <span className="orbit-dot dot-two" />
            <span className="orbit-dot dot-three" />
            <span className="scene-hint">tap to shift the feeling</span>
          </button>

          <div className="hero-footnote"><span>01 / 03</span><span>Start with a breath</span><span className="footnote-line" /></div>
        </section>

        <section className="landing-invitation">
          <p className="eyebrow">A conversation, at your pace</p>
          <h2>Reach. Talk.<br /><em>And vibe with it.</em></h2>
          <p>Some thoughts get lighter when they have somewhere to land.</p>
          <button className="round-cta cta-soft" onClick={() => enterApp()}>
            Come on in <span className="cta-arrow" aria-hidden="true">↗</span>
          </button>
          <span className="hand-note">no perfect words needed</span>
        </section>

        <footer className="landing-footer"><span>ESSENCE</span><span>Make room for what you feel.</span><span>Take it one moment at a time.</span></footer>
      </main>
    )
  }

  return (
    <div className="app-shell">
      <aside className="app-rail">
        <button className="wordmark rail-mark" onClick={() => setHasEntered(false)} aria-label="Return to ESSENCE home">essence<span>•</span></button>
        <p className="rail-label">YOUR SPACE</p>
        <nav className="side-nav" aria-label="Your space">
          <button className={view === 'chat' ? 'active' : ''} onClick={() => setView('chat')}><span className="nav-mark mark-chat" />Talk it out</button>
          <button className={view === 'reflection' ? 'active' : ''} onClick={() => setView('reflection')}><span className="nav-mark mark-reflect" />Reflection</button>
          <button className={view === 'patterns' ? 'active' : ''} onClick={() => setView('patterns')}><span className="nav-mark mark-pattern" />Your patterns</button>
        </nav>
        <div className="rail-bottom"><span className="tiny-sun">✳</span><span>Go gently.<br />You’re doing fine.</span></div>
      </aside>

      <main className="workspace">
        <header className="workspace-topbar">
          <div className="mobile-brand"><span className="wordmark">essence<span>•</span></span></div>
          <span className="today-stamp">A MOMENT FOR YOU <i /></span>
          <button className="back-to-story" onClick={() => setHasEntered(false)}>The Silent Spiral <span aria-hidden="true">↗</span></button>
        </header>

        {view === 'chat' && (
          <section className="chat-page">
            <div className="page-heading chat-heading">
              <p className="eyebrow"><span className="eyebrow-dot" /> No rush. No right way.</p>
              <h1>Let it <em>out.</em></h1>
              <p className="page-deck">A little space to untangle whatever’s on your mind.</p>
            </div>

            <div className="chat-area" aria-live="polite">
              <div className="conversation-date"><span /> TODAY, JUST NOW <span /></div>
              {messages.map((item, index) => (
                <div className={`message-row ${item.from}`} key={`${item.from}-${index}`}>
                  {item.from === 'essence' && <span className="essence-stamp">e<span>•</span></span>}
                  <p className="message-bubble">{item.text}</p>
                  {item.from === 'you' && <span className="you-stamp">you</span>}
                </div>
              ))}
              {isSending && (
                <div className="message-row essence" role="status">
                  <span className="essence-stamp">e<span>•</span></span>
                  <p className="message-bubble">Thinking…</p>
                </div>
              )}
              <div ref={messagesEndRef} />
              {messages.length === 1 && (
                <div className="starter-prompts">
                  {starterPrompts.map((prompt) => <button key={prompt} onClick={() => setMessage(prompt)}>{prompt}<span aria-hidden="true">↗</span></button>)}
                </div>
              )}
            </div>

            <form className="message-composer" onSubmit={sendMessage}>
              <label className="sr-only" htmlFor="message-input">Write what’s on your mind</label>
              <input id="message-input" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Whatever’s on your mind..." disabled={isSending} />
              <button type="submit" aria-label="Send message" disabled={!message.trim() || isSending}><span aria-hidden="true">{isSending ? '…' : '↗'}</span></button>
            </form>
            <p className="gentle-note">You can start anywhere. This space is here to listen.</p>
          </section>
        )}

        {view === 'reflection' && (
          <section className="editorial-page reflection-page">
            <div className="page-heading">
              <p className="eyebrow"><span className="eyebrow-dot" /> A check-in, not a checklist</p>
              <h1>Meet yourself<br /><em>where you are.</em></h1>
              <p className="page-deck">A few words can make a feeling easier to hold.</p>
            </div>
            <div className="reflection-layout">
              <div className="reflection-main">
                <p className="section-kicker">01 / RIGHT NOW</p>
                <h2>What’s the weather<br />like <em>inside?</em></h2>
                <p className="reflection-prompt">Pick the phrase that feels closest. You can change it whenever you like.</p>
                <div className="mood-options" role="group" aria-label="Choose how you feel">
                  {['A little tangled', 'Quietly okay', 'Bright + buzzy', 'Somewhere in between'].map((option) => (
                    <button key={option} className={mood === option ? 'selected' : ''} onClick={() => { setMood(option); setSavedReflection(false) }} aria-pressed={mood === option}>{option}<span>{mood === option ? '✓' : '+'}</span></button>
                  ))}
                </div>
                <div className="reflection-note"><span className="note-spark">✳</span><p><em>Try this:</em> What might this feeling be asking you for?</p></div>
                <button className="save-reflection" onClick={() => setSavedReflection(true)}>{savedReflection ? 'Saved for this moment ✓' : 'Keep this moment'}<span aria-hidden="true">↗</span></button>
              </div>
              <aside className="reflection-side">
                <span className="side-number">A NOTE TO SELF</span>
                <p>“You don’t have to have it all figured out to begin listening.”</p>
                <span className="side-byline">— from your quieter corner</span>
                <div className="side-doodle"><span /><span /><span /></div>
              </aside>
            </div>
          </section>
        )}

        {view === 'patterns' && (
          <section className="editorial-page patterns-page">
            <div className="page-heading pattern-heading">
              <p className="eyebrow"><span className="eyebrow-dot" /> Notice, don’t judge</p>
              <h1>Little things<br /><em>add up.</em></h1>
              <p className="page-deck">A gentle look at the moods you’ve been making room for.</p>
            </div>
            <div className="pattern-intro"><span className="section-kicker">YOUR LAST FEW CHECK-INS</span><p>No grades here. Just a chance to notice what’s been showing up.</p></div>
            <div className="pattern-story">
              <div className="week-label"><span>THIS WEEK</span><span>01 — 07</span></div>
              <div className="mood-plot" aria-label="Mood check-ins across the week">
                {[
                  { day: 'M', name: 'Monday', tone: 'peach', height: '58%', note: 'a bit much' },
                  { day: 'T', name: 'Tuesday', tone: 'lilac', height: '78%', note: 'finding a rhythm' },
                  { day: 'W', name: 'Wednesday', tone: 'mint', height: '46%', note: 'quiet day' },
                  { day: 'T', name: 'Thursday', tone: 'peach', height: '68%', note: 'a little tangled' },
                  { day: 'F', name: 'Friday', tone: 'yellow', height: '86%', note: 'lighter now' },
                  { day: 'S', name: 'Saturday', tone: 'mint', height: '60%', note: 'slow morning' },
                  { day: 'S', name: 'Sunday', tone: 'lilac', height: '73%', note: 'taking stock' },
                ].map((entry, index) => (
                  <div className="plot-day" key={entry.name}>
                    <div className={`plot-stem ${entry.tone}`} style={{ '--stem-height': entry.height, '--day-index': index } as React.CSSProperties} title={`${entry.name}: ${entry.note}`}><span className="plot-dot" /></div>
                    <span className="plot-day-letter">{entry.day}</span>
                    <span className="plot-day-name">{entry.name}</span>
                  </div>
                ))}
              </div>
              <div className="pattern-takeaway"><span className="takeaway-star">✳</span><p><strong>A small thing worth noticing</strong><br />Your check-ins seem to feel a little lighter after you give them a name.</p><span className="takeaway-script">just a thought</span></div>
            </div>
            <div className="pattern-footer-note"><span>Remember</span><p>A pattern is a place to be curious, not a box to fit into.</p></div>
          </section>
        )}
      </main>

      <nav className="mobile-nav" aria-label="Main navigation">
        <button className={view === 'chat' ? 'active' : ''} onClick={() => setView('chat')} aria-label="Talk it out"><span className="nav-mark mark-chat" /><small>Talk</small></button>
        <button className={view === 'reflection' ? 'active' : ''} onClick={() => setView('reflection')} aria-label="Reflection"><span className="nav-mark mark-reflect" /><small>Reflect</small></button>
        <button className={view === 'patterns' ? 'active' : ''} onClick={() => setView('patterns')} aria-label="Your patterns"><span className="nav-mark mark-pattern" /><small>Patterns</small></button>
      </nav>
    </div>
  )
}

export default App
