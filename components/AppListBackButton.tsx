import Link from "next/link";

type AppListBackButtonProps = {
  className?: string;
  variant?: "light" | "dark";
};

export function AppListBackButton({
  className = "",
  variant = "light",
}: AppListBackButtonProps) {
  const variantClass =
    variant === "dark"
      ? "border-white/20 bg-black/50 text-white hover:border-white/30 hover:bg-white/10"
      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800";

  return (
    <Link
      href="/"
      className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors sm:text-sm ${variantClass} ${className}`}
    >
      ← アプリ一覧
    </Link>
  );
}
