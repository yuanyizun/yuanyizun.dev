export function AboutContent() {
  return (
    <div className="flex flex-col gap-16">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <h2 className="font-heading text-section tracking-heading">
          Eleven years in one publishing house.
        </h2>
        <div className="flex max-w-2xl flex-col gap-4 text-base leading-relaxed">
          <p>
            Independently built Laravel CRM, comment-management, and Salesforce
            integration platforms; delivered Node.js services and Python data
            pipelines; and modernised AWS hosting and publishing websites.
          </p>
          <p>
            Experience spans requirements gathering, architecture, frontend and
            backend development, testing, deployment, operational support, and
            handover documentation. Built shared templates and deployment
            workflows for remote developers, with production
            JavaScript/TypeScript experience and React/TypeScript personal
            project experience. Uses Cursor with incremental implementation,
            code review, and testing to support delivery.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-heading text-section tracking-heading">
          Momentum Media
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <article className="flex flex-col gap-3 rounded-xl bg-card p-5">
            <h3 className="font-heading text-2xl tracking-heading">
              Full Stack & Platform Engineering
            </h3>
            <p className="font-mono text-xs text-muted-foreground">
              Sydney · Jan 2022 to Sep 2026
            </p>
            <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed">
              <li>
                Owned full stack delivery and platform work across cloud, data,
                CRM, advertising technology, and Laravel applications in a
                multi-brand digital media environment.
              </li>
              <li>
                Introduced Cloudflare Zero Trust access with company email
                verification in 2022–2023; removed inbound SSH access from the
                bastion server.
              </li>
              <li>
                Built the first site and shared Tailwind CSS template for a
                rollout across approximately 12 Joomla brand sites, reducing
                typical report and special-page development from approximately
                1–2 days to a matter of hours.
              </li>
              <li>
                Modernised approximately 12 Joomla brand sites through staged
                CMS upgrades, and built an Angular/TypeScript ad component for
                investmentcentre.moneymanagement.com.au through the Kevel
                Decision API.
              </li>
              <li>
                Built a Node.js/Express.js proxy serving advertising-provider
                assets to approximately 12 brand websites, resolving browser
                CORS issues.
              </li>
            </ul>
          </article>
          <article className="flex flex-col gap-3 rounded-xl bg-card p-5">
            <h3 className="font-heading text-2xl tracking-heading">
              Full Stack Development
            </h3>
            <p className="font-mono text-xs text-muted-foreground">
              Sydney · Jan 2018 to Dec 2021
            </p>
            <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed">
              <li>
                Took on broader full stack and server-side responsibility as the
                local engineering owner for multiple production brand sites.
              </li>
              <li>
                Replaced direct FTP deployments with GitHub source control,
                pull-request reviews, and staging validation; built CI/CD
                workflows using Jenkins, GitHub webhooks, and GitHub Actions.
              </li>
              <li>
                Collaborated with a cloud consultancy to migrate approximately
                15 brand websites and dozens of event websites from dedicated
                servers to AWS.
              </li>
              <li>
                Documented the deployment workflow and presented it to
                approximately 7–8 developers in the Philippines.
              </li>
            </ul>
          </article>
          <article className="flex flex-col gap-3 rounded-xl bg-card p-5">
            <h3 className="font-heading text-2xl tracking-heading">
              Web Development
            </h3>
            <p className="font-mono text-xs text-muted-foreground">
              Sydney · May 2015 to Dec 2017
            </p>
            <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed">
              <li>
                Built and maintained Joomla-based websites, modules, plugins,
                templates, and frontend features for Australian media brands
                during the company transition from print-focused publishing to
                digital media.
              </li>
              <li>
                Implemented responsive frontend designs using HTML, CSS, Sass,
                BEM, Bootstrap, JavaScript, and jQuery.
              </li>
              <li>
                Supported SEO, performance optimisation, Google Analytics,
                Google Tag Manager, DoubleClick advertising scripts, and
                publishing workflows.
              </li>
            </ul>
          </article>
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h2 className="font-heading text-3xl tracking-heading">
            Earlier experience
          </h2>
          <p>
            Web Developer Intern, Tick Yes · Jul 2014 to Oct 2014 · Joomla,
            responsive design, LESS, HTML, CSS, and frontend implementation from
            wireframes through launch.
          </p>
          <p>
            Web Developer Intern, UFIDA Software · Nov 2012 to Jan 2013 ·
            Internal website development and early exploration of WebSocket-based
            functionality.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="font-heading text-3xl tracking-heading">Education</h2>
          <p>Master of Information Technology · University of Sydney</p>
          <p>Bachelor of Computer Science · University of Wollongong</p>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-heading text-3xl tracking-heading">Skills</h2>
        <div className="grid gap-6 text-sm leading-relaxed sm:grid-cols-2">
          <p>
            <span className="font-medium">Backend and full stack.</span> PHP,
            Laravel, JavaScript, Node.js, Express.js, PM2, TypeScript, Angular
            ad integration, REST APIs, MySQL, SQL, Joomla, WordPress, Drupal,
            Grav.
          </p>
          <p>
            <span className="font-medium">Laravel applications.</span> Blade,
            Tailwind CSS, Alpine.js, Eloquent ORM, database migrations, Redis
            caching, Laravel Horizon, queued jobs, task scheduling, SAML SSO,
            role-based access control, Pest unit testing.
          </p>
          <p>
            <span className="font-medium">Python and data.</span> Python,
            Requests, Beautiful Soup, CSV processing, data validation and
            transformation, Google Cloud BigQuery SDK, resumable data uploads.
          </p>
          <p>
            <span className="font-medium">Cloud and delivery.</span> AWS,
            Lambda, S3, EC2, RDS, EFS, VPC, load balancers, CloudWatch, Linux,
            Apache, Varnish, Cloudflare Zero Trust, cloudflared, BigQuery, GCP,
            Tableau, CI/CD, Docker, Docker Compose.
          </p>
          <p>
            <span className="font-medium">CRM and advertising.</span> Salesforce
            Marketing Cloud, CloudPages, SSJS, AMPscript, Salesforce CRM API
            integration, SOAP APIs, SOQL, OAuth 2.0, JWT, Mautic, Mailchimp,
            Kevel, Google Analytics, Google Tag Manager.
          </p>
          <p>
            <span className="font-medium">Workflow.</span> GitHub, GitHub
            Actions, Jenkins, deployment automation, code review, Playwright,
            manual end-to-end testing, documentation, remote developer support,
            Asana integrations. Cursor for incremental planning, tests, and
            handover notes.
          </p>
          <p className="sm:col-span-2">
            <span className="font-medium">Personal project.</span> Local React
            recipe-management application using TypeScript, Vite, Redux, RTK
            Query, hooks, and Context API, with search, filtering, a weekly meal
            planner, theme switching, and Jest unit tests.
          </p>
        </div>
      </section>
    </div>
  );
}
