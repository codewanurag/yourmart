export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-ink flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="font-serif text-3xl font-bold tracking-widest text-gradient-gold animate-pulse uppercase">
          YourMart
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  )
}
