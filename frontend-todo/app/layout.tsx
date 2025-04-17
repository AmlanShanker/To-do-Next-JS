import "./globals.css";

export const metadata = {
  title: "To-Do App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black min-h-screen">{children}</body>
    </html>
  );
}
