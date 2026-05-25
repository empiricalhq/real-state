export const QuickStart = () => {
  return (
    <div className="scroll-m-28 pb-10 md:scroll-m-[180px]" id="start">
      <h3 className="mt-8 text-2xl font-semibold text-black dark:text-white">Quick Start</h3>
      <div className="mt-6 rounded-md border border-black/10 p-6 dark:border-white/20">
        <h6 className="text-lg font-medium dark:text-white">1. Requirements</h6>
        <p className="text-midnight_text dark:text-opacity-50 text-base font-medium dark:text-white">
          Before proceeding, you need to have the latest stable{" "}
          <a href="https://nodejs.org/" className="text-primary">
            node.js
          </a>{" "}
        </p>
        <h6 className="text-dark mt-4 mb-2 text-base font-medium dark:text-white">
          Recommended environment:
        </h6>
        <ul className="list-disc ps-6">
          <li>node js 20+</li>
          <li>npm js 10+</li>
        </ul>
      </div>
      <div className="mt-6 rounded-md border border-black/10 p-6 dark:border-white/20">
        <h6 className="text-lg font-medium dark:text-white">2. Install</h6>
        <p className="text-midnight_text dark:text-opacity-50 text-base font-medium dark:text-white">
          Open package folder and install its dependencies. We recommanded yarn or npm.{" "}
        </p>
        <h6 className="text-dark mt-4 mb-2 text-base font-medium dark:text-white">
          1) Install with npm:
        </h6>
        <div className="rounded-md bg-black px-3 py-4">
          <p className="text-sm text-gray-400">
            <span className="text-yellow-500">cd</span> project-folder
          </p>
          <p className="mt-2 text-sm text-gray-400">npm install</p>
        </div>
        <h6 className="text-dark mt-4 mb-2 text-base font-medium dark:text-white">
          1) Install with yarn:
        </h6>
        <div className="rounded-md bg-black px-3 py-4">
          <p className="text-sm text-gray-400">
            <span className="text-yellow-500">cd</span> project-folder
          </p>
          <p className="mt-2 text-sm text-gray-400">yarn install</p>
        </div>
      </div>
      <div className="mt-6 rounded-md border border-black/10 p-6 dark:border-white/20">
        <h6 className="text-lg font-medium dark:text-white">3. Start</h6>
        <p className="text-midnight_text dark:text-opacity-50 mb-4 text-base font-medium dark:text-white">
          Once npm install is done now you an run the app.
        </p>

        <div className="rounded-md bg-black px-3 py-4">
          <p className="text-sm text-gray-400">npm run dev or yarn run dev</p>
        </div>
        <p className="text-midnight_text dark:text-opacity-50 my-4 text-base font-medium dark:text-white">
          This command will start a local webserver{" "}
          <span className="dark:text-white">http://localhost:3000:</span>
        </p>
        <div className="rounded-md bg-black px-3 py-4">
          <p className="text-sm text-gray-400">{"> homely-nextjs@1.0.0 dev"}</p>
          <p className="mt-1 text-sm text-gray-400">{"> next dev"}</p>
          <p className="mt-6 text-sm text-gray-400">{"-Next.js 15.2.2"}</p>
          <p className="mt-1 text-sm text-gray-400">{"-Local: http://localhost:3000"}</p>
        </div>
      </div>
      <div className="mt-6 rounded-md border border-black/10 p-6 dark:border-white/20">
        <h6 className="text-lg font-medium dark:text-white">4. Build / Deployment</h6>
        <p className="text-midnight_text dark:text-opacity-50 mb-4 text-base font-medium dark:text-white">
          After adding url run below command for build a app.
        </p>

        <div className="rounded-md bg-black px-3 py-4">
          <p className="text-sm text-gray-400">npm run build or yarn build</p>
        </div>
        <p className="text-midnight_text dark:text-opacity-50 mt-6 text-base font-medium dark:text-white">
          Finally, Your webiste is ready to be deployed.🥳
        </p>
      </div>
    </div>
  );
};
