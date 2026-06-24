"use client";

import Link from "next/link";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { FcflixAppIcon } from "@/components/fcflix/FcflixAppIcon";
import { APP_ENTRIES } from "@/lib/apps";

export function AppLauncher() {
  return (
    <div className="flex h-dvh flex-col bg-white dark:bg-gray-950">
      <main className="mx-auto flex h-full w-full max-w-lg flex-col px-6 py-10 sm:py-14">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-900 text-3xl shadow-md dark:bg-gray-100 dark:text-gray-900 sm:h-20 sm:w-20 sm:text-4xl">
            ⚽
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
            Football Lab
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-base">
            サッカー系アプリをまとめて使えます
          </p>
        </div>

        <section className="mt-10" aria-label="アプリ一覧">
          <h2 className="mb-4 text-sm font-bold text-gray-700 dark:text-gray-300 sm:text-base">
            アプリ
          </h2>
          <ul className="grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4">
            {APP_ENTRIES.map((app) => (
              <li key={app.id}>
                <Link
                  href={app.href}
                  className="group flex flex-col items-center gap-2 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
                >
                  <span
                    className={`flex aspect-square w-full max-w-[5.5rem] items-center justify-center rounded-[1.35rem] text-4xl text-white transition-transform group-hover:scale-[1.03] group-active:scale-95 sm:max-w-[6rem] sm:text-5xl ${app.iconBgClass} ${
                      app.id === "fcflix"
                        ? "border border-red-500/25 shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_0_18px_rgba(229,9,20,0.22)] ring-1 ring-inset ring-white/10"
                        : "shadow-md"
                    }`}
                  >
                    {app.id === "fcflix" ? <FcflixAppIcon /> : app.icon}
                  </span>
                  <span className="w-full text-center text-xs font-semibold leading-tight text-gray-800 dark:text-gray-200 sm:text-sm">
                    {app.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-auto shrink-0 rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 dark:border-gray-700 dark:bg-gray-900">
          <h2 className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-300">
            設定
          </h2>
          <DarkModeToggle />
        </section>
      </main>
    </div>
  );
}
