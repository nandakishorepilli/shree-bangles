/** A single, restrained decorative motif used to separate homepage sections. */
export function MandalaDivider() {
  return (
    <div className="my-14 flex items-center justify-center gap-4 text-gold-500" aria-hidden="true">
      <span className="h-px w-20 bg-gradient-to-r from-transparent to-gold-400" />
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="4" stroke="currentColor" strokeWidth="1.2" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line
            key={deg}
            x1="14"
            y1="14"
            x2={14 + 12 * Math.cos((deg * Math.PI) / 180)}
            y2={14 + 12 * Math.sin((deg * Math.PI) / 180)}
            stroke="currentColor"
            strokeWidth="0.8"
            opacity="0.6"
          />
        ))}
      </svg>
      <span className="h-px w-20 bg-gradient-to-l from-transparent to-gold-400" />
    </div>
  );
}
