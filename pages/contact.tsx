export default function Page() {
  return (
    <div className="site-shell section-space">
      <div className="section-kicker">My High School Sports Family</div>
      <h1 className="mt-3 text-4xl font-black">Contact Us</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
        Have a question, need help with your account, or want to discuss a
        partnership? Email the My High School Sports Family team.
      </p>
      <div className="mt-8 max-w-2xl">
        <h2 className="text-xl font-bold">Email</h2>
        <a
          href="mailto:Sportsfamily@myhssportsfamily.com"
          className="mt-3 inline-block max-w-full break-all text-lg font-semibold text-blue-700 underline underline-offset-4 hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 dark:text-blue-300 dark:hover:text-blue-200"
        >
          Sportsfamily@myhssportsfamily.com
        </a>
      </div>
    </div>
  )
}
