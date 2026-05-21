const whiteKeys = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"];

export function HeroMusicScene() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(251,248,239,0.98),rgba(219,233,247,0.88)_52%,rgba(243,234,216,0.92))]" />
      <div className="absolute left-1/2 top-10 h-[25rem] w-[68rem] -translate-x-1/2 rotate-[-6deg] opacity-55">
        {[0, 1, 2, 3, 4].map((line) => (
          <span
            key={line}
            className="absolute left-0 h-px w-full bg-blue-deep/25"
            style={{ top: `${line * 44}px` }}
          />
        ))}
        {[
          { x: 150, y: 134, label: "Do" },
          { x: 270, y: 112, label: "Re" },
          { x: 390, y: 90, label: "Mi" },
          { x: 510, y: 68, label: "Fa" },
          { x: 630, y: 46, label: "Sol" },
        ].map((note) => (
          <span
            key={note.label}
            className="absolute flex h-12 w-16 items-center justify-center rounded-[50%] border border-blue-deep/15 bg-white/80 text-sm font-bold text-blue-deep shadow-soft"
            style={{ left: note.x, top: note.y }}
          >
            {note.label}
          </span>
        ))}
      </div>
      <div className="absolute bottom-0 left-1/2 flex h-40 w-[min(56rem,100vw)] -translate-x-1/2 items-end justify-center px-5 opacity-95">
        <div className="relative flex h-32 w-full max-w-4xl overflow-hidden rounded-t-lg border border-blue-deep/15 bg-blue-deep/10 shadow-soft">
          {whiteKeys.map((key) => (
            <div
              key={key}
              className="relative flex flex-1 items-end justify-center border-r border-blue-deep/15 bg-white pb-4 text-xs font-semibold text-blue-deep last:border-r-0"
            >
              {key}
            </div>
          ))}
          {[12.2, 26.5, 55, 69.2, 83.5].map((left) => (
            <span
              key={left}
              className="absolute top-0 h-20 w-[7.5%] rounded-b-md bg-ink shadow-lg"
              style={{ left: `${left}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
