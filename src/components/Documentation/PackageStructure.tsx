import { Icon } from "@iconify/react/dist/iconify.js";

export const PackageStructure = () => {
  const Counts = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
    26, 27, 28, 29, 30,
  ];
  return (
    <div id="structure" className="scroll-m-28 md:scroll-m-32.5">
      <h3 className="mt-8 text-2xl font-semibold text-black dark:text-white">Package Structure</h3>
      <div className="mt-6 rounded-2xl border border-black/10 p-6 pt-3 dark:border-white/20">
        <div className="flex items-center gap-4">
          <h5 className="mt-3 mb-1 text-base font-medium">Homely Tailwind Nextjs Templates</h5>
        </div>
        <ul className="list-unstyled ps-0 md:ps-5">
          <li className="py-2">
            <div className="flex items-center gap-3">
              <p className="text-xl text-black dark:text-white/50">|—</p>
              <span className="text-dark font-medium dark:text-white/50">
                <Icon icon="tabler:folder" className="text-primary me-2 inline-block text-base" />
                packages
              </span>
            </div>
            <ul className="list-unstyled ps-5 md:ps-5">
              <li className="py-0">
                <ul className="ps-md-3 list-unstyled ps-2">
                  <li className="py-2">
                    <ul className="list-unstyled ps-0 md:ps-5">
                      <li className="py-2">
                        <div className="flex items-center gap-3">
                          <p className="text-xl text-black dark:text-white/50">|—</p>
                          <span className="text-dark font-medium dark:text-white/50">
                            <Icon
                              icon="tabler:folder"
                              className="text-primary me-2 inline-block text-base"
                            />
                            markdown
                          </span>
                        </div>
                      </li>
                      <li className="py-2">
                        <div className="flex items-center gap-3">
                          <p className="text-xl text-black dark:text-white/50">|—</p>
                          <span className="text-dark font-medium dark:text-white/50">
                            <Icon
                              icon="tabler:folder"
                              className="text-primary me-2 inline-block text-base"
                            />
                            public
                          </span>
                        </div>
                      </li>
                      <li className="py-2">
                        <div className="flex items-center gap-3">
                          <p className="text-xl text-black dark:text-white/50">|—</p>
                          <span className="text-dark font-medium dark:text-white/50">
                            <Icon
                              icon="tabler:folder"
                              className="text-primary me-2 inline-block text-base"
                            />
                            src
                          </span>
                        </div>
                        <div className="flex">
                          <div className="mt-2 flex flex-col justify-between gap-2">
                            {Counts.slice(0, 19).map((item, index) => {
                              return (
                                <p key={index} className="text-xl text-black dark:text-white/50">
                                  |
                                </p>
                              );
                            })}
                          </div>
                          <ul className="list-unstyled ps-5 md:ps-12">
                            <li className="py-2">
                              <div className="flex items-center gap-3">
                                <p className="text-xl text-black dark:text-white/50">|—</p>
                                <span className="text-dark font-medium dark:text-white/50">
                                  <Icon
                                    icon="tabler:folder"
                                    className="text-primary me-2 inline-block text-base"
                                  />
                                  app
                                </span>
                              </div>
                              <div className="flex">
                                <div className="mt-2 flex flex-col justify-between gap-2">
                                  {Counts.slice(0, 12).map((item, index) => {
                                    return (
                                      <p
                                        key={index}
                                        className="text-xl text-black dark:text-white/50"
                                      >
                                        |
                                      </p>
                                    );
                                  })}
                                </div>
                                <ul className="list-unstyled red ps-5 md:ps-12">
                                  <li className="py-2">
                                    <div className="flex items-center gap-3">
                                      <p className="text-xl text-black dark:text-white/50">|—</p>
                                      <span className="text-dark font-medium dark:text-white/50">
                                        <Icon
                                          icon="tabler:folder"
                                          className="text-primary me-2 inline-block text-base"
                                        />
                                        (site)
                                      </span>{" "}
                                      <span className="fs-9 text-dark ms-4 dark:text-white/50">
                                        (Contains all the pages)
                                      </span>
                                    </div>
                                    <div className="flex">
                                      <div className="mt-2 flex flex-col justify-between gap-2">
                                        {Counts.slice(0, 5).map((item, index) => {
                                          return (
                                            <p
                                              key={index}
                                              className="text-xl text-black dark:text-white/50"
                                            >
                                              |
                                            </p>
                                          );
                                        })}
                                      </div>

                                      <ul className="list-unstyled ps-5 md:ps-12">
                                        <li className="py-2">
                                          <div className="flex items-center gap-3">
                                            <p className="text-xl text-black dark:text-white/50">
                                              |—
                                            </p>
                                            <span className="text-dark font-medium dark:text-white/50">
                                              <Icon
                                                icon="tabler:folder"
                                                className="text-primary me-2 inline-block text-base"
                                              />
                                              blog
                                            </span>
                                          </div>
                                        </li>
                                        <li className="py-2">
                                          <div className="flex items-center gap-3">
                                            <p className="text-xl text-black dark:text-white/50">
                                              |—
                                            </p>
                                            <span className="text-dark font-medium dark:text-white/50">
                                              <Icon
                                                icon="tabler:folder"
                                                className="text-primary me-2 inline-block text-base"
                                              />
                                              cause
                                            </span>
                                          </div>
                                        </li>
                                        <li className="py-2">
                                          <div className="flex items-center gap-3">
                                            <p className="text-xl text-black dark:text-white/50">
                                              |—
                                            </p>
                                            <span className="text-dark font-medium dark:text-white/50">
                                              <Icon
                                                icon="tabler:folder"
                                                className="text-primary me-2 inline-block text-base"
                                              />
                                              contact
                                            </span>
                                          </div>
                                        </li>
                                        <li className="py-2">
                                          <div className="flex items-center gap-3">
                                            <p className="text-xl text-black dark:text-white/50">
                                              |—
                                            </p>
                                            <span className="text-dark font-medium dark:text-white/50">
                                              <Icon
                                                icon="tabler:folder"
                                                className="text-primary me-2 inline-block text-base"
                                              />
                                              documentation
                                            </span>
                                          </div>
                                        </li>
                                        <li className="py-2">
                                          <div className="flex items-center gap-3">
                                            <p className="text-xl text-black dark:text-white/50">
                                              |—
                                            </p>
                                            <span className="text-dark font-medium dark:text-white/50">
                                              <Icon
                                                icon="tabler:folder"
                                                className="text-primary me-2 inline-block text-base"
                                              />
                                              events
                                            </span>
                                          </div>
                                        </li>
                                      </ul>
                                    </div>
                                  </li>
                                  <li className="py-2">
                                    <div className="flex items-center gap-3">
                                      <p className="text-xl text-black dark:text-white/50">|—</p>
                                      <span className="text-dark font-medium dark:text-white/50">
                                        <Icon
                                          icon="tabler:folder"
                                          className="text-primary me-2 inline-block text-base"
                                        />
                                        api
                                      </span>
                                    </div>
                                  </li>
                                  <li className="py-2">
                                    <div className="flex items-center gap-3">
                                      <p className="text-xl text-black dark:text-white/50">|—</p>
                                      <span className="text-dark font-medium dark:text-white/50">
                                        global.css
                                      </span>
                                    </div>
                                  </li>
                                  <li className="py-2">
                                    <div className="flex items-center gap-3">
                                      <p className="text-xl text-black dark:text-white/50">|—</p>
                                      <span className="text-dark font-medium dark:text-white/50">
                                        layout.tsx
                                      </span>
                                    </div>
                                  </li>
                                  <li className="py-2">
                                    <div className="flex items-center gap-3">
                                      <p className="text-xl text-black dark:text-white/50">|—</p>
                                      <span className="text-dark font-medium dark:text-white/50">
                                        not-found.tsx
                                      </span>
                                    </div>
                                  </li>
                                  <li className="py-2">
                                    <div className="flex items-center gap-3">
                                      <p className="text-xl text-black dark:text-white/50">|—</p>
                                      <span className="text-dark font-medium dark:text-white/50">
                                        page.tsx
                                      </span>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </li>
                            <li className="py-2">
                              <div className="flex flex-wrap items-center gap-3">
                                <p className="text-xl text-black dark:text-white/50">|—</p>
                                <span className="text-dark font-medium dark:text-white/50">
                                  <Icon
                                    icon="tabler:folder"
                                    className="text-primary me-2 inline-block text-base"
                                  />
                                  components
                                </span>{" "}
                                <span className="fs-9 text-dark ms-4 dark:text-white/50">
                                  (All the Components of this template.)
                                </span>
                              </div>
                            </li>
                            <li className="py-2">
                              <div className="flex items-center gap-3">
                                <p className="text-xl text-black dark:text-white/50">|—</p>
                                <span className="text-dark font-medium dark:text-white/50">
                                  <Icon
                                    icon="tabler:folder"
                                    className="text-primary me-2 inline-block text-base"
                                  />
                                  styles
                                </span>
                              </div>
                            </li>
                            <li className="py-2">
                              <div className="flex items-center gap-3">
                                <p className="text-xl text-black dark:text-white/50">|—</p>
                                <span className="text-dark font-medium dark:text-white/50">
                                  <Icon
                                    icon="tabler:folder"
                                    className="text-primary me-2 inline-block text-base"
                                  />
                                  types
                                </span>
                              </div>
                            </li>
                            <li className="py-2">
                              <div className="flex items-center gap-3">
                                <p className="text-xl text-black dark:text-white/50">|—</p>
                                <span className="text-dark font-medium dark:text-white/50">
                                  <Icon
                                    icon="tabler:folder"
                                    className="text-primary me-2 inline-block text-base"
                                  />
                                  utils
                                </span>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </li>
                      <li className="py-2">
                        <div className="flex items-center gap-3">
                          <p className="text-xl text-black dark:text-white/50">|—</p>
                          <span className="text-dark font-medium dark:text-white/50">
                            <i className="ti ti-file text-primary me-2 font-bold" />
                            next.config.mjs
                          </span>
                        </div>
                      </li>
                      <li className="py-2">
                        <div className="flex items-center gap-3">
                          <p className="text-xl text-black dark:text-white/50">|—</p>
                          <span className="text-dark font-medium dark:text-white/50">
                            <i className="ti ti-file text-primary me-2 font-bold" />
                            postcss.config.mjs
                          </span>
                        </div>
                      </li>
                      <li className="py-2">
                        <div className="flex items-center gap-3">
                          <p className="text-xl text-black dark:text-white/50">|—</p>
                          <span className="text-dark font-medium dark:text-white/50">
                            <i className="ti ti-file text-primary me-2 font-bold" />
                            package.json
                          </span>
                        </div>
                      </li>
                      <li className="py-2">
                        <div className="flex items-center gap-3">
                          <p className="text-xl text-black dark:text-white/50">|—</p>
                          <span className="text-dark font-medium dark:text-white/50">
                            <i className="ti ti-file text-primary me-2 font-bold" />
                            tailwind.config.ts
                          </span>
                        </div>
                      </li>
                      <li className="py-2">
                        <div className="flex items-center gap-3">
                          <p className="text-xl text-black dark:text-white/50">|—</p>
                          <span className="text-dark font-medium dark:text-white/50">
                            <i className="ti ti-file text-primary me-2 font-bold" />
                            tsconfig.json
                          </span>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};
