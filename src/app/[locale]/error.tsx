"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-20 h-20 rounded-2xl bg-red-100 dark:bg-red-950/40 flex items-center justify-center text-4xl mb-6">
        ⚠️
      </div>
      <h1 className="text-2xl font-bold mb-2">เกิดข้อผิดพลาด / Something went wrong</h1>
      <p className="text-(--muted-foreground) max-w-sm mb-1">
        ขออภัยในความไม่สะดวก กรุณาลองใหม่อีกครั้ง
      </p>
      <p className="text-(--muted-foreground) text-sm max-w-sm mb-6">
        Sorry for the inconvenience. Please try again.
      </p>
      {error.digest && (
        <p className="text-xs text-(--muted-foreground) mb-6 font-mono bg-(--muted) px-3 py-1 rounded">
          Error ID: {error.digest}
        </p>
      )}
      <button
        onClick={reset}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
      >
        ลองอีกครั้ง / Try again
      </button>
    </div>
  );
}
