'use client';

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  calculateAge,
  type AgeSummary
} from "../lib/calculateAge";

type DateInputState = {
  value: string;
  touched: boolean;
};

const initialBirthState: DateInputState = {
  value: "",
  touched: false
};

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState<DateInputState>(initialBirthState);
  const [referenceDate, setReferenceDate] = useState<DateInputState>({
    value: "",
    touched: false
  });

  const [error, summary] = useMemo(() => {
    if (!birthDate.value) {
      return [undefined, undefined] as const;
    }

    const parsedBirth = parseDateString(birthDate.value);
    const parsedReference = referenceDate.value
      ? parseDateString(referenceDate.value)
      : new Date();

    if (!parsedBirth) {
      return ["Please provide a valid birth date.", undefined] as const;
    }
    if (!parsedReference) {
      return ["Reference date is invalid.", undefined] as const;
    }
    if (parsedBirth > parsedReference) {
      return ["Birth date must be before the comparison date.", undefined] as const;
    }

    try {
      const result = calculateAge(parsedBirth, parsedReference);
      return [undefined, result] as const;
    } catch (err) {
      if (err instanceof Error) {
        return [err.message, undefined] as const;
      }
      return ["Something went wrong. Please try again.", undefined] as const;
    }
  }, [birthDate.value, referenceDate.value]);

  const handleResetReferenceDate = () => {
    setReferenceDate({ value: "", touched: true });
  };

  const handleSetToday = () => {
    const today = new Date();
    const iso = today.toISOString().slice(0, 10);
    setReferenceDate({ value: iso, touched: true });
  };

  const nextBirthdayProgress = useMemo(() => {
    if (!summary || !birthDate.value) {
      return 0;
    }
    const birth = parseDateString(birthDate.value);
    if (!birth) {
      return 0;
    }
    const ref = referenceDate.value ? parseDateString(referenceDate.value) : new Date();
    if (!ref) {
      return 0;
    }
    const currentYearBirthday = new Date(ref.getFullYear(), birth.getMonth(), birth.getDate());
    let lastBirthday = currentYearBirthday;
    let nextBirthday = new Date(currentYearBirthday);

    if (ref >= currentYearBirthday) {
      lastBirthday = currentYearBirthday;
      nextBirthday.setFullYear(ref.getFullYear() + 1);
    } else {
      lastBirthday = new Date(currentYearBirthday);
      lastBirthday.setFullYear(ref.getFullYear() - 1);
      nextBirthday = currentYearBirthday;
    }

    const elapsed = ref.getTime() - lastBirthday.getTime();
    const total = nextBirthday.getTime() - lastBirthday.getTime();
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  }, [summary, birthDate.value, referenceDate.value]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-24 pt-16 md:pt-20">
      <header className="relative flex flex-col gap-4 text-center md:gap-6">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-200/80"
        >
          <span className="h-1 w-1 rounded-full bg-emerald-400" aria-hidden />
          Live Age Intelligence
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-4xl font-bold text-slate-50 md:text-6xl"
        >
          Decode your age with cinematic precision
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mx-auto max-w-3xl text-base text-slate-200/80 md:text-lg"
        >
          Enter two moments in time and unlock a detailed breakdown of your life lived so far—down to the second—with
          smart milestones, celestial signatures, and a projection to your next birthday.
        </motion.p>
      </header>

      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="glass relative overflow-hidden rounded-3xl p-8 shadow-xl"
        >
          <div className="absolute left-1/3 top-1/4 h-40 w-40 -translate-y-1/2 rounded-full bg-primary-500/20 blur-3xl" />
          <form className="relative z-10 grid gap-6 md:grid-cols-2">
            <fieldset className="col-span-full grid gap-4">
              <legend className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-200/70">
                Time Anchors
              </legend>
              <div className="grid gap-2">
                <label htmlFor="birth-date" className="text-sm font-medium text-slate-200">
                  Birth date
                </label>
                <input
                  id="birth-date"
                  name="birth-date"
                  type="date"
                  value={birthDate.value}
                  onChange={(event) =>
                    setBirthDate({ value: event.target.value, touched: true })
                  }
                  className="focus:ring-primary-400/80 focus:border-primary-300/80 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-base text-slate-100 shadow-inner transition"
                  max={referenceDate.value || new Date().toISOString().slice(0, 10)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="reference-date" className="text-sm font-medium text-slate-200">
                  Compare against date
                </label>
                <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                  <input
                    id="reference-date"
                    name="reference-date"
                    type="date"
                    value={referenceDate.value}
                    onChange={(event) =>
                      setReferenceDate({ value: event.target.value, touched: true })
                    }
                    className="focus:ring-primary-400/80 focus:border-primary-300/80 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-base text-slate-100 shadow-inner transition"
                    max={new Date().toISOString().slice(0, 10)}
                    placeholder="Today"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSetToday}
                      className="rounded-lg border border-primary-500/40 bg-primary-500/20 px-3 py-2 text-sm font-semibold text-primary-100 shadow-sm transition hover:bg-primary-500/30"
                    >
                      Set to today
                    </button>
                    <button
                      type="button"
                      onClick={handleResetReferenceDate}
                      className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <span className="text-xs text-slate-300/70">
                  Leave empty to use the current moment.
                </span>
              </div>
            </fieldset>
          </form>
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="relative mt-6 rounded-2xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-sm text-red-100"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {summary && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ delay: 0.1, duration: 0.45 }}
                className="relative mt-8 grid gap-5 text-slate-200 md:grid-cols-3"
              >
                <StatCard
                  title="Experienced Years"
                  primary={`${summary.breakdown.years}`}
                  highlight={`${summary.breakdown.months} months • ${summary.breakdown.days} days`}
                  gradient="from-primary-400/70 via-emerald-400/50 to-sky-500/40"
                />
                <StatCard
                  title="Total Days Alive"
                  primary={summary.breakdown.totalDays.toLocaleString()}
                  highlight={`${summary.breakdown.weeks.toLocaleString()} weeks`}
                  gradient="from-rose-400/70 via-amber-400/40 to-primary-500/40"
                />
                <StatCard
                  title="Total Seconds"
                  primary={summary.breakdown.totalSeconds.toLocaleString()}
                  highlight={`${summary.breakdown.totalMinutes.toLocaleString()} minutes`}
                  gradient="from-sky-400/70 via-purple-400/40 to-primary-500/30"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.55 }}
          className="glass relative flex flex-col overflow-hidden rounded-3xl p-8 shadow-xl"
        >
          <div className="absolute right-0 top-0 h-40 w-40 translate-x-12 -translate-y-12 rounded-full bg-emerald-400/10 blur-3xl" />
          <h2 className="relative z-10 text-sm font-semibold uppercase tracking-[0.32em] text-slate-200/70">
            Celestial Snapshot
          </h2>
          <div className="relative z-10 mt-6 grid gap-4">
            <AnimatePresence mode="wait">
              {summary ? (
                <motion.dl
                  key="celestial"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  className="grid gap-4 text-sm"
                >
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <dt className="text-xs uppercase tracking-[0.28em] text-slate-200/60">
                      Western Sign
                    </dt>
                    <dd className="mt-1 text-xl font-semibold text-slate-50">
                      {summary.zodiacSign}
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <dt className="text-xs uppercase tracking-[0.28em] text-slate-200/60">
                      Lunar Animal
                    </dt>
                    <dd className="mt-1 text-xl font-semibold text-slate-50">
                      {summary.chineseZodiac}
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <dt className="text-xs uppercase tracking-[0.28em] text-slate-200/60">
                      Next Birthday
                    </dt>
                    <dd className="mt-1 flex flex-col text-slate-100">
                      <span className="text-lg font-semibold">
                        {summary.nextBirthday.formatted}
                      </span>
                      <span className="text-xs text-slate-300/80">
                        {summary.nextBirthday.countdownLabel}
                      </span>
                    </dd>
                  </div>
                </motion.dl>
              ) : (
                <motion.p
                  key="placeholder"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-12 text-center text-sm text-slate-200/60"
                >
                  Enter your birth date to see your zodiac identity, lunar animal, and next birthday countdown.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <div className="relative z-10 mt-8">
            <h3 className="text-xs uppercase tracking-[0.32em] text-slate-200/70">
              Birthday Orbit Progress
            </h3>
            <div className="mt-3 h-2 rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${nextBirthdayProgress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-primary-400 via-emerald-400 to-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.6)]"
              />
            </div>
            <p className="mt-2 text-xs text-slate-300/70">
              {summary ? `${nextBirthdayProgress.toFixed(1)}% completed` : "Awaiting a birth date"}
            </p>
          </div>
        </motion.aside>
      </section>

      <AnimatePresence mode="wait">
        {summary && (
          <motion.section
            key="analytics"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="grid gap-8 lg:grid-cols-2"
          >
            <div className="glass relative overflow-hidden rounded-3xl p-8 shadow-xl">
              <div className="absolute left-0 top-0 h-40 w-40 -translate-x-16 -translate-y-12 rounded-full bg-sky-400/10 blur-3xl" />
              <div className="relative z-10">
                <h2 className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-200/70">
                  Lifetime Metrics
                </h2>
                <ul className="mt-6 grid gap-4 text-sm text-slate-100">
                  <li className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                    <span className="text-slate-300/80">Total hours experienced</span>
                    <span className="font-semibold tracking-wide">
                      {summary.breakdown.totalHours.toLocaleString()}
                    </span>
                  </li>
                  <li className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                    <span className="text-slate-300/80">Total minutes elapsed</span>
                    <span className="font-semibold tracking-wide">
                      {summary.breakdown.totalMinutes.toLocaleString()}
                    </span>
                  </li>
                  <li className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                    <span className="text-slate-300/80">Total weeks charted</span>
                    <span className="font-semibold tracking-wide">
                      {summary.breakdown.weeks.toLocaleString()}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="glass relative overflow-hidden rounded-3xl p-8 shadow-xl">
              <div className="absolute right-4 top-6 h-36 w-36 rounded-full bg-rose-400/20 blur-3xl" />
              <div className="relative z-10">
                <h2 className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-200/70">
                  Milestone Radar
                </h2>
                <ul className="mt-6 grid gap-4 text-sm">
                  {summary.milestones.map((milestone) => (
                    <li
                      key={milestone.label}
                      className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 md:flex-row md:items-center"
                    >
                      <div>
                        <p className="text-base font-semibold text-slate-50">
                          {milestone.label}
                        </p>
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-200/60">
                          {milestone.exactDate.toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}
                        </p>
                      </div>
                      <span
                        className={`mt-2 inline-flex items-center justify-center rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.28em] ${
                          milestone.reached
                            ? "bg-emerald-400/20 text-emerald-200"
                            : "bg-primary-400/20 text-primary-100"
                        }`}
                      >
                        {milestone.reached
                          ? "Completed"
                          : `${milestone.daysRemaining.toLocaleString()} days left`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

type StatCardProps = {
  title: string;
  primary: string;
  highlight: string;
  gradient: string;
};

function StatCard({ title, primary, highlight, gradient }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-[1px]">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-60 blur-2xl`} />
      <div className="relative h-full rounded-3xl bg-slate-950/40 px-6 py-7 shadow-inner">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-200/60">
          {title}
        </p>
        <p className="mt-4 text-4xl font-semibold text-slate-50">{primary}</p>
        <p className="mt-2 text-xs text-slate-300/70">{highlight}</p>
      </div>
    </div>
  );
}

function parseDateString(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? undefined : parsed;
}
