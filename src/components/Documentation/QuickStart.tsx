export const QuickStart = () => {
  return (
    <div className="scroll-m-28 pb-10 md:scroll-m-[180px]" id="start">
      <h3 className="mt-8 text-2xl font-semibold text-black dark:text-white">
        Quick Start
      </h3>
      <div className="mt-6 rounded-md border border-black/10 p-6 dark:border-white/20">
        <h6 className="text-lg font-medium dark:text-white">1. Requirements</h6>
        <p className="text-midnight_text dark:text-opacity-50 text-base font-medium dark:text-white">
          Before proceeding, install{" "}
          <a href="https://mise.jdx.dev" className="text-primary">
            mise
          </a>
          . It installs the Bun and Node.js versions the project pins in{" "}
          <code>mise.toml</code>.
        </p>
      </div>
      <div className="mt-6 rounded-md border border-black/10 p-6 dark:border-white/20">
        <h6 className="text-lg font-medium dark:text-white">2. Install</h6>
        <p className="text-midnight_text dark:text-opacity-50 text-base font-medium dark:text-white">
          Open the project folder, install the tools, then install the locked
          dependencies.
        </p>
        <div className="mt-4 rounded-md bg-black px-3 py-4">
          <p className="text-sm text-gray-400">
            <span className="text-yellow-500">cd</span> project-folder
          </p>
          <p className="mt-2 text-sm text-gray-400">mise install</p>
          <p className="mt-2 text-sm text-gray-400">
            bun install --frozen-lockfile
          </p>
        </div>
      </div>
      <div className="mt-6 rounded-md border border-black/10 p-6 dark:border-white/20">
        <h6 className="text-lg font-medium dark:text-white">3. Start</h6>
        <p className="text-midnight_text dark:text-opacity-50 mb-4 text-base font-medium dark:text-white">
          Once the install is done, run the app.
        </p>

        <div className="rounded-md bg-black px-3 py-4">
          <p className="text-sm text-gray-400">bun run dev</p>
        </div>
        <p className="text-midnight_text dark:text-opacity-50 mt-4 text-base font-medium dark:text-white">
          This command starts a local web server at{" "}
          <span className="dark:text-white">http://localhost:3000</span>.
        </p>
      </div>
      <div className="mt-6 rounded-md border border-black/10 p-6 dark:border-white/20">
        <h6 className="text-lg font-medium dark:text-white">
          4. Build / Deployment
        </h6>
        <p className="text-midnight_text dark:text-opacity-50 mb-4 text-base font-medium dark:text-white">
          After adding the URL, run the command below to build the app.
        </p>

        <div className="rounded-md bg-black px-3 py-4">
          <p className="text-sm text-gray-400">bun run build</p>
        </div>
        <p className="text-midnight_text dark:text-opacity-50 mt-6 text-base font-medium dark:text-white">
          Finally, your website is ready to be deployed.🥳
        </p>
      </div>
    </div>
  );
};
