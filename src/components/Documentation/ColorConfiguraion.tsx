export const ColorConfiguration = () => {
  return (
    <>
      <h3 className="mt-8 text-xl font-semibold text-black dark:text-white">Colors</h3>
      <div className="mt-4 rounded-md border border-black/10 p-6 dark:border-white/20">
        <p className="text-midnight_text dark:text-opacity-50 text-base font-medium dark:text-white">
          <span className="text-lg font-semibold dark:text-white">1. Override Colors</span> <br />
          For any change in colors : \src\app\globals.css
        </p>
        <div className="mt-8 rounded-md bg-black px-5 py-4">
          <p className="flex flex-col gap-2 text-sm text-gray-400">
            <span>--color-primary: #07be8a;</span>
            <span>--color-skyblue: #79adff;</span>
            <span>--color-lightskyblue: #9cc2dd;</span>
            <span>--color-dark: #172023;</span>
          </p>
        </div>
      </div>
      <div className="mt-4 rounded-md border border-black/10 p-6 dark:border-white/20">
        <p className="text-midnight_text dark:text-opacity-50 text-base font-medium dark:text-white">
          <span className="text-lg font-semibold dark:text-white">2. Override Theme Colors</span>{" "}
          <br />
          For change , go to : \src\app\globals.css
        </p>
        <div className="mt-8 rounded-md bg-black px-5 py-4">
          <p className="flex flex-col gap-2 text-sm text-gray-400">
            <span>--color-primary: #07be8a;</span>
          </p>
        </div>
      </div>
    </>
  );
};
