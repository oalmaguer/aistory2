import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-black text-white p-4">
      <div className=" flex ml-2 items-center">
        <div className="w-full flex gap-6 justify-between">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <Link href="/saved" className="hover:text-gray-300 transition-colors">
            Saved stories
          </Link>
          <Link href="/login" className="hover:text-gray-300 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}
