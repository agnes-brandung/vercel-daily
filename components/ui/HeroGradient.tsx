export function HeroGradient({ children }: { children: React.ReactNode }) {
  return (
    <div className="hero-gradient">
      <div className="hero-gradient__bg" aria-hidden />
      <div className="hero-gradient__content space-y-6">{children}</div>
    </div>
  )
}