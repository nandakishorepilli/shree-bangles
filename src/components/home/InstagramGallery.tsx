export function InstagramGallery({ posts }: { posts: string[] }) {
  return (
    <section>
      <div className="mb-8 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-gold-600">Follow Along</p>
        <h2 className="font-display text-3xl text-blush-900">Instagram</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {posts.map((postUrl, index) => (
          <a
            key={postUrl}
            href={postUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open Shree Bangles Instagram post ${index + 1}`}
            className="group relative aspect-square overflow-hidden rounded-lg border border-gold-300/70 bg-gradient-to-br from-blush-100 via-cream-100 to-gold-300 p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
          >
            <span className="absolute inset-3 rounded-full border border-gold-400/50 transition-transform duration-500 group-hover:scale-110" />
            <span className="relative flex h-full flex-col items-center justify-center rounded-full bg-cream-50/75 px-2 text-center text-blush-900 backdrop-blur-sm">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="mb-2 h-7 w-7 text-blush-700 sm:h-8 sm:w-8" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
              </svg>
              <span className="font-display text-lg leading-none sm:text-xl">Post {index + 1}</span>
              <span className="mt-1 text-[10px] uppercase tracking-[0.14em] text-gold-600 sm:text-xs">View on Instagram</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
