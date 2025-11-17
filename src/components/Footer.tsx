import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full mt-8">
      <div className="w-full">
        <div className="w-full bg-white/50 dark:bg-gray-900/50 items-center justify-center gap-4 backdrop-blur-sm shadow-sm px-6 py-4 grid grid-cols-2 max-sm:grid-cols-1 max-md:grid-cols-1">
          <div className="text-sm text-gray-700 dark:text-gray-300 pl-20 max-sm:pl-0 max-sm:text-center max-md:pl-0 max-md:text-center">
            <span className="font-semibold">Copyright@2025</span>
            <span> • made by </span>
            <Link
              href="https://github.com/Phiraphat29"
              className="underline hover:text-blue-700 transition-colors duration-300 max-sm:block"
              aria-label="Author one"
              target="_blank"
            >
              Phiraphat Loratsachan
            </Link>
            <span className="max-sm:block"> &amp; </span>
            <Link
              href="https://github.com/6652410026ThayakornKoomphai"
              className="underline hover:text-blue-700 transition-colors duration-300"
              aria-label="Author two"
              target="_blank"
            >
              Thayakorn Koomphai
            </Link>
          </div>
          <div className="flex gap-2 text-sm text-gray-700 dark:text-gray-300 justify-end flex-wrap pr-20 max-sm:pr-0 max-sm:justify-center max-md:justify-center max-md:pr-5">
            <span>Powered by</span>
            <Link
              href="https://nextjs.org/"
              className="font-medium hover:text-blue-700 transition-colors duration-300"
              target="_blank"
            >
              Next.js
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href="https://supabase.com/"
              className="font-medium hover:text-blue-700 transition-colors duration-300"
              target="_blank"
            >
              Supabase
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href="https://vercel.com/"
              className="font-medium hover:text-blue-700 transition-colors duration-300"
              target="_blank"
            >
              Vercel
            </Link>
            <Link
              href="https://github.com/Phiraphat29/drinking-tracker"
              aria-label="Project GitHub repository"
              className="ms-1 text-gray-800 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-700 transition-colors duration-300 max-sm:block"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-github text-lg" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
