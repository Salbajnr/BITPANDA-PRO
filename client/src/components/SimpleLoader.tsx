export function SimpleLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          BITPANDA PRO
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Loading your crypto trading platform...
        </p>
      </div>
    </div>
  );
}