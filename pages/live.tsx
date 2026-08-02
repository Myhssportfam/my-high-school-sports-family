import Head from 'next/head'
import Link from 'next/link'
import { FormEvent, useMemo, useState } from 'react'

type StreamStatus = 'live' | 'scheduled' | 'replay'

type Stream = {
  id: string
  title: string
  broadcaster: string
  school: string
  sport: string
  matchup: string
  status: StreamStatus
  viewers?: number
  scheduledTime?: string
  duration?: string
  platform: string
}

const startingStreams: Stream[] = [
  {
    id: 'texas-tigers-baseball',
    title: 'Texas Tigers Varsity Baseball',
    broadcaster: 'Jordan Hill',
    school: 'Texas High School',
    sport: 'Baseball',
    matchup: 'Texas Tigers vs. Liberty Eagles',
    status: 'live',
    viewers: 1248,
    platform: 'MHSSF Live',
  },
  {
    id: 'friday-night-football',
    title: 'Friday Night Game of the Week',
    broadcaster: 'MHSSF Sports Network',
    school: 'North Dallas High School',
    sport: 'Football',
    matchup: 'North Dallas vs. Southlake',
    status: 'scheduled',
    scheduledTime: 'Friday at 7:30 PM',
    platform: 'YouTube',
  },
  {
    id: 'girls-basketball',
    title: 'Girls Varsity Basketball',
    broadcaster: 'Central High Athletics',
    school: 'Central High School',
    sport: 'Basketball',
    matchup: 'Central Panthers vs. Westview',
    status: 'scheduled',
    scheduledTime: 'Saturday at 5:00 PM',
    platform: 'Twitch',
  },
  {
    id: 'championship-replay',
    title: '2026 State Championship Replay',
    broadcaster: 'MHSSF Replay Center',
    school: 'State Championship',
    sport: 'Football',
    matchup: 'Texas Championship Final',
    status: 'replay',
    duration: '2:14:38',
    platform: 'MHSSF Replay',
  },
]

function formatViewerCount(viewers = 0) {
  return new Intl.NumberFormat('en-US', {
    notation: viewers >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(viewers)
}

export default function LivePage() {
  const [activeTab, setActiveTab] = useState<
    'all' | 'live' | 'scheduled' | 'replay'
  >('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [streams, setStreams] = useState(startingStreams)
  const [successMessage, setSuccessMessage] = useState('')

  const filteredStreams = useMemo(() => {
    if (activeTab === 'all') {
      return streams
    }

    return streams.filter((stream) => stream.status === activeTab)
  }, [activeTab, streams])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = new FormData(event.currentTarget)
    const title = String(form.get('title') || '').trim()
    const broadcaster = String(form.get('broadcaster') || '').trim()
    const school = String(form.get('school') || '').trim()
    const sport = String(form.get('sport') || '').trim()
    const opponent = String(form.get('opponent') || '').trim()
    const scheduledTime = String(form.get('scheduledTime') || '').trim()
    const platform = String(form.get('platform') || '').trim()

    if (!title || !broadcaster || !school || !sport) {
      return
    }

    const newStream: Stream = {
      id: `stream-${Date.now()}`,
      title,
      broadcaster,
      school,
      sport,
      matchup: opponent ? `${school} vs. ${opponent}` : school,
      status: 'scheduled',
      scheduledTime: scheduledTime || 'Time to be announced',
      platform: platform || 'External stream',
    }

    setStreams((current) => [newStream, ...current])
    setSuccessMessage(
      'Your stream was added to the schedule. Firebase publishing comes next.',
    )
    setIsFormOpen(false)
    event.currentTarget.reset()
  }

  return (
    <>
      <Head>
        <title>Live Sports | My High School Sports Family</title>
        <meta
          name="description"
          content="Watch live high school sports, athlete broadcasts, school streams, scheduled games, and replays."
        />
      </Head>

      <main className="livePage">
        <section className="hero">
          <div className="heroContent">
            <div className="livePill">
              <span className="pulse" />
              MHSSF LIVE
            </div>

            <h1>Every game. Every athlete. One sports family.</h1>

            <p>
              Watch school broadcasts, athlete streams, featured games,
              scheduled matchups, and championship replays.
            </p>

            <div className="heroActions">
              <a href="#featured-stream" className="watchButton">
                ▶ Watch featured stream
              </a>

              <button
                type="button"
                className="addStreamButton"
                onClick={() => {
                  setSuccessMessage('')
                  setIsFormOpen(true)
                }}
              >
                ＋ Add your stream
              </button>
            </div>

            <div className="heroStats">
              <div>
                <strong>24</strong>
                <span>Live now</span>
              </div>

              <div>
                <strong>7.8K</strong>
                <span>Watching</span>
              </div>

              <div>
                <strong>38</strong>
                <span>Games today</span>
              </div>
            </div>
          </div>

          <div className="heroGraphic">
            <div className="broadcastSignal signalOne" />
            <div className="broadcastSignal signalTwo" />

            <div className="phone">
              <div className="phoneScreen">
                <span className="phoneLive">LIVE</span>
                <div className="phonePlay">▶</div>
                <strong>Texas Tigers Baseball</strong>
                <small>1.2K watching</small>
              </div>
            </div>
          </div>
        </section>

        <div className="pageContainer">
          {successMessage && (
            <div className="successMessage">{successMessage}</div>
          )}

          <section className="featuredSection" id="featured-stream">
            <div className="sectionHeading">
              <div>
                <p className="eyebrow">GAME OF THE WEEK</p>
                <h2>Featured live broadcast</h2>
              </div>

              <span className="verified">✓ Verified school broadcast</span>
            </div>

            <div className="featuredGrid">
              <div className="featuredVideo">
                <div className="videoTop">
                  <span className="liveBadge">
                    <span className="smallPulse" />
                    LIVE
                  </span>

                  <span className="viewerBadge">◉ 1.2K watching</span>
                </div>

                <button
                  type="button"
                  className="largePlay"
                  aria-label="Play featured stream"
                >
                  ▶
                </button>

                <div className="scoreboard">
                  <div>
                    <span>LIBERTY</span>
                    <strong>2</strong>
                  </div>

                  <span className="inning">TOP 5TH</span>

                  <div>
                    <strong>4</strong>
                    <span>TEXAS</span>
                  </div>
                </div>
              </div>

              <div className="streamInformation">
                <span className="sportBadge">BASEBALL</span>

                <h2>Texas Tigers vs. Liberty Eagles</h2>

                <p className="streamDescription">
                  Live varsity baseball from Texas High School in Texarkana,
                  Texas.
                </p>

                <div className="broadcaster">
                  <div className="broadcasterAvatar">JH</div>

                  <div>
                    <strong>Jordan Hill</strong>
                    <span>Athlete broadcaster</span>
                  </div>
                </div>

                <div className="streamDetails">
                  <div>
                    <span>School</span>
                    <strong>Texas High School</strong>
                  </div>

                  <div>
                    <span>Location</span>
                    <strong>Texarkana, Texas</strong>
                  </div>

                  <div>
                    <span>Platform</span>
                    <strong>MHSSF Live</strong>
                  </div>
                </div>

                <div className="featuredActions">
                  <button type="button" className="primaryAction">
                    ▶ Watch now
                  </button>

                  <button type="button" className="secondaryAction">
                    ♡ Follow broadcast
                  </button>

                  <button type="button" className="iconAction">
                    ↗
                  </button>
                </div>

                <Link
                  href="/athletes/jordan-hill"
                  className="athleteProfileLink"
                >
                  View athlete profile →
                </Link>
              </div>
            </div>
          </section>

          <section className="streamDirectory">
            <div className="directoryTop">
              <div>
                <p className="eyebrow">STREAM DIRECTORY</p>
                <h2>Live games and upcoming broadcasts</h2>
              </div>

              <button
                type="button"
                className="scheduleButton"
                onClick={() => setIsFormOpen(true)}
              >
                ＋ Schedule a stream
              </button>
            </div>

            <div className="tabs" aria-label="Stream filters">
              {(['all', 'live', 'scheduled', 'replay'] as const).map((tab) => (
                <button
                  type="button"
                  key={tab}
                  className={activeTab === tab ? 'activeTab' : ''}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'all'
                    ? 'All streams'
                    : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="streamGrid">
              {filteredStreams.map((stream, index) => (
                <article className="streamCard" key={stream.id}>
                  <div
                    className={`thumbnail thumbnail${(index % 4) + 1}`}
                  >
                    <div className="thumbnailTop">
                      <span
                        className={
                          stream.status === 'live'
                            ? 'cardLiveBadge'
                            : stream.status === 'scheduled'
                              ? 'scheduledBadge'
                              : 'replayBadge'
                        }
                      >
                        {stream.status === 'live'
                          ? '● LIVE'
                          : stream.status === 'scheduled'
                            ? '◷ SCHEDULED'
                            : '↻ REPLAY'}
                      </span>

                      {stream.viewers !== undefined && (
                        <span className="cardViewers">
                          {formatViewerCount(stream.viewers)} watching
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      className="cardPlay"
                      aria-label={`Watch ${stream.title}`}
                    >
                      ▶
                    </button>

                    {stream.duration && (
                      <span className="duration">{stream.duration}</span>
                    )}
                  </div>

                  <div className="streamCardBody">
                    <div className="sportLine">
                      <span>{stream.sport}</span>
                      <small>{stream.platform}</small>
                    </div>

                    <h3>{stream.title}</h3>
                    <p className="matchup">{stream.matchup}</p>

                    <div className="streamerRow">
                      <div className="miniAvatar">
                        {stream.broadcaster
                          .split(' ')
                          .map((word) => word.charAt(0))
                          .join('')
                          .slice(0, 2)}
                      </div>

                      <div>
                        <strong>{stream.broadcaster}</strong>
                        <span>{stream.school}</span>
                      </div>
                    </div>

                    {stream.scheduledTime && (
                      <div className="scheduledTime">
                        ◷ {stream.scheduledTime}
                      </div>
                    )}

                    <button type="button" className="cardButton">
                      {stream.status === 'live'
                        ? 'Watch live'
                        : stream.status === 'scheduled'
                          ? 'Set reminder'
                          : 'Watch replay'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="creatorSection">
            <div>
              <p className="eyebrow lightEyebrow">STREAM YOUR GAME</p>
              <h2>Broadcast directly from an athlete profile</h2>

              <p>
                Athletes and schools will be able to schedule games, attach
                YouTube or Twitch links, go live, and automatically appear in
                the MHSSF Live directory.
              </p>

              <button
                type="button"
                className="creatorButton"
                onClick={() => setIsFormOpen(true)}
              >
                Add a stream
              </button>
            </div>

            <div className="creatorSteps">
              <div>
                <span>1</span>
                <strong>Create a broadcast</strong>
                <p>Add the title, sport, opponent, date, and stream link.</p>
              </div>

              <div>
                <span>2</span>
                <strong>Connect your profile</strong>
                <p>The broadcast appears on the athlete and school pages.</p>
              </div>

              <div>
                <span>3</span>
                <strong>Reach the family</strong>
                <p>Followers receive the schedule and live notification.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {isFormOpen && (
        <div
          className="modalBackdrop"
          role="presentation"
          onMouseDown={() => setIsFormOpen(false)}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="stream-form-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="modalHeader">
              <div>
                <p className="eyebrow">ATHLETE STREAMING</p>
                <h2 id="stream-form-title">Add a sports stream</h2>
              </div>

              <button
                type="button"
                className="closeButton"
                onClick={() => setIsFormOpen(false)}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>
                Stream title
                <input
                  name="title"
                  placeholder="Texas Tigers varsity baseball"
                  required
                />
              </label>

              <div className="formGrid">
                <label>
                  Athlete or broadcaster
                  <input
                    name="broadcaster"
                    placeholder="Athlete name"
                    required
                  />
                </label>

                <label>
                  School
                  <input
                    name="school"
                    placeholder="Texas High School"
                    required
                  />
                </label>
              </div>

              <div className="formGrid">
                <label>
                  Sport
                  <select name="sport" defaultValue="" required>
                    <option value="" disabled>
                      Select sport
                    </option>
                    <option>Football</option>
                    <option>Basketball</option>
                    <option>Baseball</option>
                    <option>Softball</option>
                    <option>Soccer</option>
                    <option>Volleyball</option>
                    <option>Track and Field</option>
                    <option>Wrestling</option>
                    <option>Other</option>
                  </select>
                </label>

                <label>
                  Opponent
                  <input name="opponent" placeholder="Liberty Eagles" />
                </label>
              </div>

              <div className="formGrid">
                <label>
                  Date and time
                  <input
                    name="scheduledTime"
                    placeholder="Friday at 7:30 PM"
                  />
                </label>

                <label>
                  Streaming platform
                  <select name="platform" defaultValue="YouTube">
                    <option>YouTube</option>
                    <option>Twitch</option>
                    <option>Facebook Live</option>
                    <option>MHSSF Live</option>
                    <option>Other</option>
                  </select>
                </label>
              </div>

              <label>
                Stream URL
                <input
                  name="streamUrl"
                  type="url"
                  placeholder="https://youtube.com/..."
                />
              </label>

              <p className="formNote">
                This design currently adds the stream to the page in your
                browser. We will connect this form to Firebase after the page
                design is approved.
              </p>

              <div className="modalActions">
                <button
                  type="button"
                  className="cancelButton"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="submitButton">
                  Schedule stream
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(body) {
          margin: 0;
          background: #f4f6fa;
          color: #111827;
          font-family:
            Inter, Arial, Helvetica, system-ui, -apple-system, sans-serif;
        }

        :global(a) {
          color: inherit;
          text-decoration: none;
        }

        button,
        input,
        select {
          font: inherit;
        }

        .livePage {
          min-height: 100vh;
        }

        .hero {
          min-height: 510px;
          padding: 72px max(6%, calc((100% - 1180px) / 2));
          overflow: hidden;
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
          align-items: center;
          gap: 50px;
          background:
            radial-gradient(
              circle at 85% 30%,
              rgba(37, 99, 235, 0.45),
              transparent 28%
            ),
            radial-gradient(
              circle at 70% 100%,
              rgba(220, 38, 38, 0.36),
              transparent 32%
            ),
            linear-gradient(120deg, #060b17 0%, #111d38 50%, #450b15 100%);
          color: white;
        }

        .heroContent {
          position: relative;
          z-index: 2;
        }

        .livePill {
          width: fit-content;
          padding: 9px 14px;
          border: 1px solid rgba(255, 255, 255, 0.23);
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 9px;
          background: rgba(255, 255, 255, 0.09);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .pulse,
        .smallPulse {
          display: inline-block;
          border-radius: 50%;
          background: #ef4444;
          box-shadow: 0 0 0 5px rgba(239, 68, 68, 0.18);
        }

        .pulse {
          width: 9px;
          height: 9px;
        }

        .smallPulse {
          width: 7px;
          height: 7px;
        }

        .hero h1 {
          max-width: 750px;
          margin: 24px 0 18px;
          font-size: clamp(42px, 6vw, 72px);
          line-height: 1.02;
          letter-spacing: -0.055em;
        }

        .heroContent > p {
          max-width: 670px;
          margin: 0;
          color: #d4dcec;
          font-size: 18px;
          line-height: 1.7;
        }

        .heroActions {
          margin-top: 30px;
          display: flex;
          gap: 13px;
          flex-wrap: wrap;
        }

        .watchButton,
        .addStreamButton,
        .primaryAction,
        .scheduleButton,
        .creatorButton,
        .submitButton {
          border: 0;
          cursor: pointer;
          font-weight: 850;
        }

        .watchButton,
        .addStreamButton {
          min-height: 50px;
          padding: 0 21px;
          border-radius: 13px;
          display: inline-flex;
          align-items: center;
        }

        .watchButton {
          background: #d73524;
          color: white;
          box-shadow: 0 13px 35px rgba(215, 53, 36, 0.32);
        }

        .addStreamButton {
          border: 1px solid rgba(255, 255, 255, 0.26);
          background: rgba(255, 255, 255, 0.09);
          color: white;
        }

        .heroStats {
          margin-top: 38px;
          display: flex;
          gap: 46px;
          flex-wrap: wrap;
        }

        .heroStats div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .heroStats strong {
          font-size: 27px;
        }

        .heroStats span {
          color: #adb9ce;
          font-size: 12px;
        }

        .heroGraphic {
          min-height: 385px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .phone {
          width: 235px;
          height: 405px;
          padding: 12px;
          position: relative;
          z-index: 3;
          border: 2px solid rgba(255, 255, 255, 0.42);
          border-radius: 35px;
          background: #07101f;
          box-shadow:
            0 40px 90px rgba(0, 0, 0, 0.55),
            0 0 70px rgba(37, 99, 235, 0.18);
          transform: rotate(5deg);
        }

        .phoneScreen {
          height: 100%;
          padding: 19px;
          overflow: hidden;
          border-radius: 25px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          background:
            linear-gradient(rgba(7, 16, 31, 0.1), rgba(7, 16, 31, 0.84)),
            linear-gradient(140deg, #1d4ed8, #111827 52%, #b91c1c);
        }

        .phoneScreen::before {
          content: '';
          width: 85px;
          height: 23px;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 0 0 16px 16px;
          background: #07101f;
        }

        .phoneLive {
          position: absolute;
          top: 35px;
          left: 17px;
          padding: 6px 9px;
          border-radius: 7px;
          background: #dc2626;
          font-size: 10px;
          font-weight: 900;
        }

        .phonePlay {
          width: 58px;
          height: 58px;
          margin: auto;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: rgba(255, 255, 255, 0.93);
          color: #b91c1c;
          font-size: 21px;
        }

        .phoneScreen strong {
          font-size: 15px;
        }

        .phoneScreen small {
          margin-top: 5px;
          color: #cbd5e1;
        }

        .broadcastSignal {
          position: absolute;
          border: 1px solid rgba(96, 165, 250, 0.28);
          border-radius: 50%;
        }

        .signalOne {
          width: 320px;
          height: 320px;
        }

        .signalTwo {
          width: 430px;
          height: 430px;
        }

        .pageContainer {
          width: min(1180px, calc(100% - 30px));
          margin: 0 auto;
          padding: 34px 0 75px;
        }

        .successMessage {
          margin-bottom: 22px;
          padding: 15px 18px;
          border: 1px solid #bbf7d0;
          border-radius: 14px;
          background: #f0fdf4;
          color: #166534;
          font-weight: 750;
        }

        .featuredSection,
        .streamDirectory {
          padding: 30px;
          border: 1px solid #e1e5ec;
          border-radius: 24px;
          background: white;
          box-shadow: 0 12px 36px rgba(17, 24, 39, 0.055);
        }

        .sectionHeading,
        .directoryTop {
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }

        .eyebrow {
          margin: 0 0 7px;
          color: #b91c1c;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.16em;
        }

        .sectionHeading h2,
        .directoryTop h2,
        .creatorSection h2 {
          margin: 0;
          font-size: clamp(25px, 4vw, 36px);
          letter-spacing: -0.035em;
        }

        .verified {
          padding: 8px 12px;
          border-radius: 999px;
          background: #ecfdf3;
          color: #15803d;
          font-size: 11px;
          font-weight: 850;
        }

        .featuredGrid {
          display: grid;
          grid-template-columns: minmax(0, 1.45fr) minmax(300px, 0.75fr);
          gap: 25px;
        }

        .featuredVideo {
          min-height: 445px;
          padding: 20px;
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          display: grid;
          place-items: center;
          background:
            linear-gradient(rgba(4, 10, 24, 0.15), rgba(4, 10, 24, 0.72)),
            radial-gradient(
              circle at 50% 45%,
              rgba(255, 255, 255, 0.12),
              transparent 22%
            ),
            linear-gradient(135deg, #164e63, #172554 48%, #7f1d1d);
        }

        .featuredVideo::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            90deg,
            transparent 0 79px,
            rgba(255, 255, 255, 0.025) 80px
          );
        }

        .videoTop {
          position: absolute;
          z-index: 2;
          top: 17px;
          left: 17px;
          right: 17px;
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }

        .liveBadge,
        .viewerBadge {
          padding: 7px 10px;
          border-radius: 8px;
          color: white;
          font-size: 10px;
          font-weight: 900;
        }

        .liveBadge {
          display: flex;
          align-items: center;
          gap: 7px;
          background: #dc2626;
        }

        .viewerBadge {
          background: rgba(4, 10, 24, 0.74);
        }

        .largePlay {
          width: 76px;
          height: 76px;
          position: relative;
          z-index: 2;
          border: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          color: #b91c1c;
          font-size: 27px;
          cursor: pointer;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }

        .scoreboard {
          min-width: 310px;
          padding: 14px 19px;
          position: absolute;
          z-index: 2;
          left: 50%;
          bottom: 18px;
          transform: translateX(-50%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 13px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
          background: rgba(4, 10, 24, 0.84);
          color: white;
          backdrop-filter: blur(12px);
        }

        .scoreboard div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .scoreboard div:last-child {
          flex-direction: row-reverse;
        }

        .scoreboard span {
          font-size: 10px;
          font-weight: 850;
        }

        .scoreboard strong {
          font-size: 23px;
        }

        .inning {
          padding: 5px 7px;
          border-radius: 6px;
          background: #b91c1c;
        }

        .streamInformation {
          display: flex;
          flex-direction: column;
        }

        .sportBadge {
          width: fit-content;
          padding: 6px 9px;
          border-radius: 7px;
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 10px;
          font-weight: 900;
        }

        .streamInformation h2 {
          margin: 17px 0 10px;
          font-size: 29px;
          line-height: 1.15;
          letter-spacing: -0.035em;
        }

        .streamDescription {
          margin: 0 0 20px;
          color: #64748b;
          line-height: 1.6;
        }

        .broadcaster,
        .streamerRow {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .broadcaster {
          padding: 16px 0;
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
        }

        .broadcasterAvatar,
        .miniAvatar {
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          background: linear-gradient(145deg, #111827, #b91c1c);
          color: white;
          font-weight: 900;
        }

        .broadcasterAvatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
        }

        .broadcaster div:last-child,
        .streamerRow div:last-child {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .broadcaster span,
        .streamerRow span {
          color: #64748b;
          font-size: 11px;
        }

        .streamDetails {
          margin: 15px 0;
        }

        .streamDetails div {
          padding: 9px 0;
          display: flex;
          justify-content: space-between;
          gap: 15px;
        }

        .streamDetails span {
          color: #64748b;
          font-size: 12px;
        }

        .streamDetails strong {
          font-size: 12px;
          text-align: right;
        }

        .featuredActions {
          display: flex;
          gap: 8px;
        }

        .primaryAction,
        .secondaryAction,
        .iconAction {
          min-height: 43px;
          padding: 0 15px;
          border-radius: 11px;
          cursor: pointer;
          font-weight: 800;
        }

        .primaryAction {
          background: #b91c1c;
          color: white;
        }

        .secondaryAction,
        .iconAction {
          border: 1px solid #d1d5db;
          background: white;
          color: #111827;
        }

        .secondaryAction {
          flex: 1;
        }

        .athleteProfileLink {
          margin-top: auto;
          padding-top: 17px;
          color: #b91c1c;
          font-size: 13px;
          font-weight: 850;
        }

        .streamDirectory {
          margin-top: 24px;
        }

        .scheduleButton {
          min-height: 43px;
          padding: 0 17px;
          border-radius: 11px;
          background: #111827;
          color: white;
        }

        .tabs {
          margin-bottom: 23px;
          padding: 5px;
          width: fit-content;
          border-radius: 12px;
          display: flex;
          gap: 4px;
          background: #f1f5f9;
        }

        .tabs button {
          padding: 9px 14px;
          border: 0;
          border-radius: 9px;
          background: transparent;
          color: #64748b;
          cursor: pointer;
          font-size: 12px;
          font-weight: 850;
        }

        .tabs .activeTab {
          background: white;
          color: #111827;
          box-shadow: 0 3px 10px rgba(15, 23, 42, 0.08);
        }

        .streamGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .streamCard {
          overflow: hidden;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          background: white;
          transition:
            transform 180ms ease,
            box-shadow 180ms ease;
        }

        .streamCard:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 35px rgba(15, 23, 42, 0.1);
        }

        .thumbnail {
          min-height: 185px;
          padding: 13px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .thumbnail1 {
          background: linear-gradient(145deg, #164e63, #172554, #7f1d1d);
        }

        .thumbnail2 {
          background: linear-gradient(145deg, #052e16, #1d4ed8);
        }

        .thumbnail3 {
          background: linear-gradient(145deg, #78350f, #991b1b);
        }

        .thumbnail4 {
          background: linear-gradient(145deg, #312e81, #111827);
        }

        .thumbnailTop {
          position: absolute;
          top: 12px;
          left: 12px;
          right: 12px;
          display: flex;
          justify-content: space-between;
          gap: 8px;
        }

        .cardLiveBadge,
        .scheduledBadge,
        .replayBadge,
        .cardViewers {
          padding: 5px 8px;
          border-radius: 6px;
          color: white;
          font-size: 9px;
          font-weight: 900;
        }

        .cardLiveBadge {
          background: #dc2626;
        }

        .scheduledBadge {
          background: #1d4ed8;
        }

        .replayBadge {
          background: #475569;
        }

        .cardViewers {
          background: rgba(15, 23, 42, 0.72);
        }

        .cardPlay {
          width: 51px;
          height: 51px;
          border: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.94);
          color: #b91c1c;
          cursor: pointer;
        }

        .duration {
          padding: 4px 7px;
          position: absolute;
          right: 10px;
          bottom: 10px;
          border-radius: 5px;
          background: rgba(15, 23, 42, 0.8);
          color: white;
          font-size: 9px;
        }

        .streamCardBody {
          padding: 16px;
        }

        .sportLine {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          color: #b91c1c;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .sportLine small {
          color: #64748b;
          text-transform: none;
        }

        .streamCard h3 {
          margin: 12px 0 6px;
          font-size: 17px;
          line-height: 1.25;
        }

        .matchup {
          min-height: 36px;
          margin: 0 0 14px;
          color: #64748b;
          font-size: 12px;
        }

        .miniAvatar {
          width: 39px;
          height: 39px;
          border-radius: 50%;
          font-size: 11px;
        }

        .streamerRow strong {
          font-size: 12px;
        }

        .scheduledTime {
          margin-top: 13px;
          padding: 10px;
          border-radius: 9px;
          background: #f8fafc;
          color: #475569;
          font-size: 11px;
          font-weight: 750;
        }

        .cardButton {
          width: 100%;
          min-height: 40px;
          margin-top: 14px;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          background: white;
          cursor: pointer;
          font-weight: 800;
        }

        .creatorSection {
          margin-top: 24px;
          padding: 40px;
          border-radius: 24px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 45px;
          background:
            radial-gradient(
              circle at 100% 0,
              rgba(37, 99, 235, 0.34),
              transparent 27%
            ),
            linear-gradient(120deg, #08101e, #16213e 56%, #550f1a);
          color: white;
        }

        .lightEyebrow {
          color: #fca5a5;
        }

        .creatorSection > div:first-child > p:not(.eyebrow) {
          max-width: 540px;
          color: #cbd5e1;
          line-height: 1.65;
        }

        .creatorButton {
          min-height: 45px;
          padding: 0 18px;
          border-radius: 11px;
          background: #dc3d27;
          color: white;
        }

        .creatorSteps {
          display: grid;
          gap: 12px;
        }

        .creatorSteps > div {
          padding: 17px;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 15px;
          display: grid;
          grid-template-columns: 38px 1fr;
          gap: 3px 13px;
          background: rgba(255, 255, 255, 0.06);
        }

        .creatorSteps > div > span {
          width: 36px;
          height: 36px;
          grid-row: span 2;
          border-radius: 11px;
          display: grid;
          place-items: center;
          background: rgba(255, 255, 255, 0.11);
          font-weight: 900;
        }

        .creatorSteps p {
          margin: 4px 0 0;
          color: #adb9ce;
          font-size: 12px;
        }

        .modalBackdrop {
          padding: 20px;
          position: fixed;
          z-index: 100;
          inset: 0;
          overflow-y: auto;
          display: grid;
          place-items: center;
          background: rgba(3, 7, 18, 0.72);
          backdrop-filter: blur(7px);
        }

        .modal {
          width: min(680px, 100%);
          padding: 27px;
          border-radius: 22px;
          background: white;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.34);
        }

        .modalHeader {
          margin-bottom: 20px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .modalHeader h2 {
          margin: 0;
        }

        .closeButton {
          width: 37px;
          height: 37px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: white;
          cursor: pointer;
          font-size: 21px;
        }

        form {
          display: grid;
          gap: 16px;
        }

        .formGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        label {
          display: grid;
          gap: 7px;
          color: #334155;
          font-size: 12px;
          font-weight: 800;
        }

        input,
        select {
          width: 100%;
          min-height: 45px;
          padding: 0 13px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          outline: none;
          color: #111827;
          background: white;
        }

        input:focus,
        select:focus {
          border-color: #b91c1c;
          box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.1);
        }

        .formNote {
          margin: 0;
          padding: 12px;
          border-radius: 10px;
          background: #f8fafc;
          color: #64748b;
          font-size: 11px;
          line-height: 1.55;
        }

        .modalActions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .cancelButton,
        .submitButton {
          min-height: 43px;
          padding: 0 17px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 850;
        }

        .cancelButton {
          border: 1px solid #d1d5db;
          background: white;
        }

        .submitButton {
          background: #b91c1c;
          color: white;
        }

        @media (max-width: 950px) {
          .hero {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .heroContent {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .heroGraphic {
            display: none;
          }

          .featuredGrid,
          .creatorSection {
            grid-template-columns: 1fr;
          }

          .streamGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 650px) {
          .hero {
            min-height: 500px;
            padding: 55px 18px;
          }

          .hero h1 {
            font-size: 43px;
          }

          .heroContent > p {
            font-size: 15px;
          }

          .heroActions {
            width: 100%;
          }

          .watchButton,
          .addStreamButton {
            width: 100%;
            justify-content: center;
          }

          .heroStats {
            justify-content: center;
            gap: 24px;
          }

          .pageContainer {
            width: min(100% - 18px, 1180px);
            padding-top: 14px;
          }

          .featuredSection,
          .streamDirectory {
            padding: 18px;
            border-radius: 18px;
          }

          .sectionHeading,
          .directoryTop {
            display: block;
          }

          .verified,
          .scheduleButton {
            margin-top: 15px;
          }

          .featuredVideo {
            min-height: 300px;
          }

          .scoreboard {
            min-width: calc(100% - 28px);
          }

          .featuredActions {
            flex-wrap: wrap;
          }

          .primaryAction,
          .secondaryAction {
            flex: 1 1 45%;
          }

          .tabs {
            width: 100%;
            overflow-x: auto;
          }

          .tabs button {
            flex: 0 0 auto;
          }

          .streamGrid {
            grid-template-columns: 1fr;
          }

          .creatorSection {
            padding: 25px 19px;
            gap: 26px;
          }

          .formGrid {
            grid-template-columns: 1fr;
          }

          .modal {
            padding: 20px;
          }
        }
      `}</style>
    </>
  )
}