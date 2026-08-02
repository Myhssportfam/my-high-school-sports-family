import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { fetchAthleteById } from '../../../lib/data'

export default function AthleteProfilePage() {
  const router = useRouter()

  const athleteId =
    typeof router.query.athleteId === 'string'
      ? router.query.athleteId
      : null

  const [athlete, setAthlete] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [isFollowing, setIsFollowing] = useState(false)
  const [followers, setFollowers] = useState(248)

     useEffect(() => {
    if (!router.isReady || !athleteId) {
      return
    }

    async function loadAthlete() {
      try {
        setIsLoading(true)
        setLoadError('')

        const result = (await fetchAthleteById(
          athleteId as string
        )) as Record<string, unknown> | null

        if (!result) {
          setAthlete(null)
          setLoadError('Athlete profile not found.')
          return
        }

        setAthlete(result)

        const followersCount = result.followersCount

        if (typeof followersCount === 'number') {
          setFollowers(followersCount)
        }
      } catch (error) {
        console.error('Unable to load athlete:', error)
        setAthlete(null)
        setLoadError('We could not load this athlete profile.')
      } finally {
        setIsLoading(false)
      }
    }

    loadAthlete()
  }, [router.isReady, athleteId])

    async function loadAthlete() {
      try {
        setIsLoading(true)
        setLoadError('')

   const result = (await fetchAthleteById(
  athleteId as string
)) as Record<string, unknown> | null 

        if (!result) {
          setAthlete(null)
          setLoadError('Athlete profile not found.')
          return
        }

        setAthlete(result)

       const followersCount = result.followersCount

if (typeof followersCount === 'number') {
  setFollowers(followersCount)
}
        
      } catch (error) {
        console.error('Unable to load athlete:', error)
        setAthlete(null)
        setLoadError('We could not load this athlete profile.')
      } finally {
        setIsLoading(false)
      }
    }


  

  function handleFollow() {
    setIsFollowing((current) => {
      setFollowers((count) => (current ? count - 1 : count + 1))
      return !current
    })
  }

  if (isLoading) {
    return <main className="page">Loading athlete profile...</main>
  }

  if (loadError || !athlete) {
    return (
      <main className="page">
        <div className="container">
          <section className="card">
            <h2>Athlete profile unavailable</h2>
            <p>{loadError || 'Athlete profile not found.'}</p>
          </section>
        </div>
      </main>
    )
  }
  return (
    <>
      <Head>
        <title>Jordan Hill | My High School Sports Family</title>
      </Head>

      <main className="page">
        

        <div className="container">
          <section className="profile">
            <div className="cover">
              <span>VERIFIED TEXAS ATHLETE</span>
            </div>

            <div className="profileBody">
              <div className="avatar">JH</div>

              <div className="identity">
                <div className="nameRow">
                  <div>
                    <h1>Jordan Hill</h1>
                    <p>@{athleteId}</p>
                  </div>

                  <div className="buttons">
                    <button
                      type="button"
                      className={isFollowing ? 'following' : 'follow'}
                      onClick={handleFollow}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>

                    <button type="button" className="message">
                      Message
                    </button>
                  </div>
                </div>

                <h2>Baseball • Center Field / Outfield</h2>
                <p>Texas High School • Texarkana, Texas • Class of 2027</p>

                <p className="bio">
                  Student-athlete focused on competing, improving, and earning
                  an opportunity to play college baseball.
                </p>

                <div className="counts">
                  <div>
                    <strong>42</strong>
                    <span>Posts</span>
                  </div>

                  <div>
                    <strong>{followers}</strong>
                    <span>Followers</span>
                  </div>

                  <div>
                    <strong>181</strong>
                    <span>Following</span>
                  </div>

                  <div>
                    <strong>12.4K</strong>
                    <span>Views</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="grid">
            <section className="card">
              <p className="label">ATHLETE OVERVIEW</p>
              <h2>Player information</h2>

              <div className="stats">
                <div>
                  <span>Height</span>
                  <strong>6&apos;1&quot;</strong>
                </div>

                <div>
                  <span>Weight</span>
                  <strong>210 lbs</strong>
                </div>

                <div>
                  <span>Position</span>
                  <strong>CF / OF</strong>
                </div>

                <div>
                  <span>Class</span>
                  <strong>2027</strong>
                </div>
              </div>
            </section>

            <section className="card recruiting">
              <p className="label">RECRUITING PROFILE</p>
              <h2>Open to recruiting</h2>

              <p>
                Available to communicate with verified college coaches and
                recruiting programs.
              </p>

              <button type="button" className="contact">
                Contact athlete
              </button>
            </section>

            <section className="card highlights">
              <p className="label">FEATURED MEDIA</p>
              <h2>Highlights</h2>

              <div className="video">
                <button type="button" aria-label="Play highlight">
                  ▶
                </button>
                <strong>2026 Season Highlights</strong>
              </div>
            </section>

            <section className="card">
              <p className="label">ACHIEVEMENTS</p>
              <h2>Honors</h2>

              <ul>
                <li>🏆 All-District Selection</li>
                <li>⭐ Team Captain</li>
                <li>📚 Academic Honor Roll</li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(body) {
          margin: 0;
          background: #f3f5f8;
          color: #111827;
          font-family: Arial, Helvetica, sans-serif;
        }

        :global(a) {
          color: inherit;
          text-decoration: none;
        }

        .page {
          min-height: 100vh;
        }

        .header {
          min-height: 76px;
          padding: 14px 4%;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand span:last-child {
          display: flex;
          flex-direction: column;
        }

        .brand small {
          margin-top: 3px;
          color: #991b1b;
          font-size: 9px;
          letter-spacing: 1px;
        }

        .logo {
          padding: 13px;
          border-radius: 10px;
          background: linear-gradient(135deg, #111827, #b91c1c);
          color: white;
          font-size: 12px;
          font-weight: 900;
        }

        nav {
          display: flex;
          gap: 24px;
          font-size: 14px;
          font-weight: 700;
        }

        .join,
        .follow,
        .contact {
          border: 0;
          border-radius: 999px;
          background: #b91c1c;
          color: white;
          font-weight: 800;
          cursor: pointer;
        }

        .join {
          padding: 12px 18px;
        }

        .container {
          width: min(1150px, calc(100% - 30px));
          margin: 30px auto 70px;
        }

        .profile,
        .card {
          overflow: hidden;
          border: 1px solid #e5e7eb;
          border-radius: 22px;
          background: white;
          box-shadow: 0 12px 32px rgba(17, 24, 39, 0.06);
        }

        .cover {
          min-height: 220px;
          padding: 25px;
          background: linear-gradient(120deg, #111827, #1d4ed8, #b91c1c);
          color: white;
          text-align: right;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .profileBody {
          display: flex;
          gap: 28px;
          padding: 0 34px 32px;
        }

        .avatar {
          width: 150px;
          height: 150px;
          margin-top: -65px;
          flex: 0 0 auto;
          border: 7px solid white;
          border-radius: 50%;
          background: linear-gradient(135deg, #111827, #b91c1c);
          color: white;
          display: grid;
          place-items: center;
          font-size: 42px;
          font-weight: 900;
        }

        .identity {
          flex: 1;
          padding-top: 22px;
        }

        .nameRow {
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }

        h1 {
          margin: 0;
          font-size: 40px;
        }

        h2 {
          margin: 8px 0;
        }

        p {
          color: #6b7280;
        }

        .bio {
          max-width: 700px;
          line-height: 1.6;
        }

        .buttons {
          display: flex;
          gap: 9px;
        }

        .buttons button,
        .contact {
          min-height: 42px;
          padding: 0 19px;
        }

        .message,
        .following {
          border: 1px solid #d1d5db;
          border-radius: 999px;
          background: white;
          font-weight: 800;
          cursor: pointer;
        }

        .following {
          color: #15803d;
        }

        .counts {
          display: flex;
          gap: 30px;
          margin-top: 20px;
          flex-wrap: wrap;
        }

        .counts div {
          display: flex;
          gap: 7px;
        }

        .counts span {
          color: #6b7280;
        }

        .grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 22px;
          margin-top: 22px;
        }

        .card {
          padding: 25px;
        }

        .label {
          margin: 0;
          color: #b91c1c;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-top: 22px;
        }

        .stats div {
          padding: 18px;
          border-radius: 14px;
          background: #f3f4f6;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stats span {
          color: #6b7280;
          font-size: 12px;
        }

        .contact {
          width: 100%;
          margin-top: 15px;
        }

        .video {
          min-height: 260px;
          margin-top: 20px;
          border-radius: 16px;
          background: linear-gradient(135deg, #1d4ed8, #111827, #b91c1c);
          color: white;
          display: grid;
          place-items: center;
        }

        .video button {
          width: 60px;
          height: 60px;
          border: 0;
          border-radius: 50%;
          background: white;
          color: #b91c1c;
          font-size: 22px;
          cursor: pointer;
        }

        ul {
          padding-left: 22px;
          line-height: 2.2;
        }

        @media (max-width: 850px) {
          nav {
            display: none;
          }

          .grid {
            grid-template-columns: 1fr;
          }

          .profileBody {
            display: block;
            padding: 0 20px 25px;
          }

          .avatar {
            width: 110px;
            height: 110px;
            font-size: 30px;
          }

          .nameRow {
            display: block;
          }

          .buttons {
            margin: 16px 0;
          }

          .stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </>
  )
}