import { useState } from "react";

type ShareButtonProps = {
  title: string;
  url?: string;
  subject?: "post" | "stream";
};

export default function ShareButton({
  title,
  url,
  subject = "stream",
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Could not copy link:", error);
    }
  };

  const shareFacebook = () => {
    const facebookUrl =
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`;

    window.open(facebookUrl, "_blank", "noopener,noreferrer");
  };

  const shareInstagram = async () => {
    await copyLink();
    window.open("https://www.instagram.com/", "_blank");
  };

  const shareMore = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `${subject === "post" ? "Read" : "Watch"} ${title} on My High School Sports Family`,
          url: shareUrl,
        });
      } catch (error) {
        console.log("Share cancelled:", error);
      }
    } else {
      await copyLink();
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
      >
        ↗ Share
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border bg-white p-3 text-black shadow-xl">
          <p className="mb-3 text-sm font-bold">
            Share this {subject}
          </p>

          <button
            type="button"
            onClick={shareFacebook}
            className="block w-full rounded-lg px-3 py-2 text-left hover:bg-gray-100"
          >
            Facebook
          </button>

          <button
            type="button"
            onClick={shareInstagram}
            className="block w-full rounded-lg px-3 py-2 text-left hover:bg-gray-100"
          >
            Instagram
          </button>

          <button
            type="button"
            onClick={copyLink}
            className="block w-full rounded-lg px-3 py-2 text-left hover:bg-gray-100"
          >
            {copied ? "✓ Link copied" : "🔗 Copy link"}
          </button>

          <button
            type="button"
            onClick={shareMore}
            className="block w-full rounded-lg px-3 py-2 text-left hover:bg-gray-100"
          >
            ↗ More sharing options
          </button>
        </div>
      )}
    </div>
  );
}