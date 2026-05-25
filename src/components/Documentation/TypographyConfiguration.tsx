export const TypographyConfiguration = () => {
  return (
    <>
      <h3 className="mt-8 text-xl font-semibold text-black dark:text-white">Typography</h3>
      <div className="mt-4 rounded-md border border-black/10 p-6 dark:border-white/20">
        <p className="text-midnight_text dark:text-opacity-50 text-base font-medium dark:text-white">
          1. Change Font family over here :{" "}
          <span className="text-base font-semibold">src/app/layout.tsx</span>{" "}
        </p>
        <div className="mt-8 rounded-md bg-black px-3 py-4">
          <p className="mb-3 flex flex-col gap-2 text-sm text-gray-400">
            {`import { Bricolage_Grotesque } from 'next/font/google'`}
          </p>
          <p className="flex flex-col gap-2 text-sm text-gray-400">
            {`const font = Bricolage_Grotesque({ subsets: ["latin"] });`}
          </p>
        </div>
      </div>
    </>
  );
};
