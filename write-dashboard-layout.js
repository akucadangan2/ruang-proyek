const fs = require("fs");
const path = require("path");

const filePath = path.join(
  __dirname,
  "src/app/(dashboard)/layout.tsx"
);

const content = `import Link from "next/link";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/products", label: "Produk" },
  { href: "/orders", label: "Order" },
  { href: "/team", label: "Team" },
  { href: "/settings/tracking", label: "Tracking" },
  { href: "/settings/follow-up-otomatis", label: "Follow Up Otomatis" },
  { href: "/settings/follow-up-manual", label: "Follow Up Manual" },
  { href: "/settings/notifications", label: "Notifikasi" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r bg-gray-50 p-4 space-y-1">
        <p className="font-bold text-lg mb-4 px-2">Ruang Kerja</p>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-2 py-2 rounded-lg text-sm hover:bg-gray-200"
          >
            {item.label}
          </Link>
        ))}
      </aside>
      <main className="flex-1 bg-white">{children}</main>
    </div>
  );
}
`;

fs.writeFileSync(filePath, content, "utf8");
console.log("Ditulis:", filePath);