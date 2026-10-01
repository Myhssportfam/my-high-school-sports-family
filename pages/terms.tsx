export default function TermsPage() {
  return (
    <main className="site-shell py-12 md:py-20">
      <article className="mx-auto max-w-3xl space-y-8 leading-7 text-slate-700 dark:text-slate-300">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-red-500">
            Company
          </p>
          <h1 className="mt-3 text-4xl font-black text-slate-950 dark:text-white">
            Terms of Use
          </h1>
          <p className="mt-3">Effective September 28, 2026</p>
        </div>

        <section>
          <h2 className="text-2xl font-bold">Using the service</h2>
          <p className="mt-2">
            My High School Sports Family is a place to share sports stories,
            connect with communities, and participate in features such as
            profiles, posts, live events, and the Family Arena. You must be
            at least 13 to create an account. If you are under 18, use the
            service with permission from a parent or guardian.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">Your account</h2>
          <p className="mt-2">
            Provide accurate information, protect your sign-in credentials,
            and take responsibility for activity on your account. Do not
            impersonate another athlete, coach, school, or organization.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">Your content</h2>
          <p className="mt-2">
            You keep ownership of content you create. By posting it, you
            give My High School Sports Family permission to host, display,
            and share it as needed to operate the features you use. Only
            upload content you have the right to share. Do not post another
            person’s private information without permission.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">Community rules</h2>
          <p className="mt-2">
            Do not harass, threaten, exploit, or bully others; post unlawful
            or sexually explicit content; misuse another person’s identity;
            interfere with the site; or use Arena features to cheat or
            manipulate competitions. We may remove content or restrict
            accounts that violate these rules.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">Recruiting and external services</h2>
          <p className="mt-2">
            A profile or recruiting feature does not guarantee an offer,
            scholarship, or opportunity. Twitch, YouTube, Kick, game
            publishers, and other linked services have their own terms.
            Follow their rules when using them.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">Changes and contact</h2>
          <p className="mt-2">
            We may change the service or these terms. We will update the
            effective date when the terms change. For questions or to report
            a problem, email YOUR_CONTACT_EMAIL.
          </p>
        </section>
      </article>
    </main>
  );
}