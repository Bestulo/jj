import Menu from "./Menu";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-black text-white">
      <Menu />
      <div className="w-full mt-20 ">{children}</div>
    </div>
  );
}
