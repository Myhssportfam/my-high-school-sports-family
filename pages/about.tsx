export default function AboutPage() {
  return (
    <main className="site-shell py-12 md:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-widest text-red-500">
          About Us
        </p>

        <h1 className="mt-3 text-4xl font-black md:text-5xl">
          Every athlete has a story.
        </h1>

        <div className="mt-8 space-y-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
          <p>
            My High School Sports Family is a community where every athlete
            belongs. We bring athletes, families, coaches, schools, and fans
            together to share highlights, follow sports journeys, and connect
            with their state communities.
          </p>

          <p>
            Our goal is to give athletes a place to celebrate their
            accomplishments, build their sports history, and stay connected
            from their first game through life after graduation.
          </p>

          <p>
            Through profiles, stories, live events, and the Family Arena, we
            want to make sports more connected for everyone. One team, one
            community, one family.
          </p>
        </div>
      </div>
    </main>
  );
}