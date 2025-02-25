export default function AvatarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ padding: "20px", textAlign: "center", minHeight: "100vh" }}>
      {children}
    </div>
  );
}
