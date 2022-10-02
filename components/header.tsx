import Link from "next/link";

export default function Header() {
  return (
    <div className="navbar bg-base-300 shadow-2xl z-50 relative">
      <Link href="/" passHref={true}>
        <p className="btn btn-ghost normal-case text-3xl text-white">FADED</p>
      </Link>
    </div>
  );
}
