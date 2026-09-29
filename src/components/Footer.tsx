import Link from "next/link";

const footerLinks = [
  { name: "Home", href: "/" },
  { name: "Datasets", href: "/datasets" },
  { name: "Visualization", href: "/visualization" },
  { name: "Outreach", href: "/outreach" },
  { name: "Education", href: "/education" },
  { name: "Careers", href: "/careers" },
  { name: "Collaboration", href: "/collaboration" },
  { name: "News", href: "/news" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
                PS
              </div>

              <div>
                <div className="text-lg font-bold tracking-wide text-white">
                  POLAR SCIENCE
                </div>

                <div className="text-xs text-slate-400">
                  India&apos;s Polar Research Portal
                </div>
              </div>

            </Link>

            <p className="mt-6 max-w-xl leading-7 text-slate-400">
              Integrated Polar Science Outreach, Knowledge Repository and
              Media Dissemination Portal connecting scientific research,
              datasets, education, outreach, and collaboration.
            </p>

            <p className="mt-5 text-sm text-slate-500">
              Ministry of Earth Sciences
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold text-white">
              Explore
            </h3>

            <div className="mt-5 flex flex-col gap-3">
              {footerLinks.slice(0, 4).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm transition hover:text-sky-400"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-white">
              Resources
            </h3>

            <div className="mt-5 flex flex-col gap-3">
              {footerLinks.slice(4).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm transition hover:text-sky-400"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col gap-4 border-t border-slate-800 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © {new Date().getFullYear()} Polar Science Portal.
            All rights reserved.
          </p>

          <p>
            Built for polar science, research and outreach.
          </p>

        </div>
      </div>
    </footer>
  );
}