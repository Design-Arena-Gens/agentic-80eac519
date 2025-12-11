import AgeCalculator from "../components/AgeCalculator";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-16 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary-500/20 blur-[140px]" />
        <div className="absolute bottom-10 left-8 h-80 w-80 rounded-full bg-emerald-400/20 blur-[120px]" />
        <div className="absolute right-10 top-20 h-64 w-64 rounded-full bg-sky-400/20 blur-[120px]" />
      </div>
      <AgeCalculator />
    </main>
  );
}
