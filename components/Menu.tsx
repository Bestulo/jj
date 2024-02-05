import Image from "next/image";
import Link from "next/link";
import cn from "classnames";

function MenuLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-slate-400 hover:text-violet-400",
        "transition duration-200 ease-in-out",
        "cursor-pointer",
        "text-xl font-bold"
      )}
    >
      {children}
    </Link>
  );
}

export default function Menu() {
  return (
    <div className="flex flex-col gap-8 bg-slate-900 p-8 h-screen pt-20">
      {/* Logo */}
      <div className="flex gap-4 items-center">
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="w-16 h-16"
        >
          <circle cx="100" cy="100" r="90" fill="#0A1F44" />

          <path
            d="M50,100 q50,-100 100,0 q-50,100 -100,0"
            fill="none"
            stroke="#4CAF50"
            strokeWidth="8"
          />

          <rect x="85" y="70" width="30" height="40" fill="#4CAF50" />
          <rect x="95" y="50" width="10" height="20" fill="#4CAF50" />
          <circle cx="100" cy="80" r="5" fill="#0A1F44" />
        </svg>
        <h1 className="text-4xl font-bold whitespace-nowrap">Secret Ant</h1>
      </div>
      {/* Menu */}
      <div className="flex flex-col gap-4 items-end">
        <MenuLink href="/mainnet">Mainnet</MenuLink>
        <MenuLink href="/testnet">Testnet</MenuLink>
      </div>
    </div>
  );
}
