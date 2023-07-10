import "./index.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="p-4">{children}</body>
    </html>
  );
}
