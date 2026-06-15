import HeaderComponent from "@/components/atoms/header/header";
import TabClientWrapper from "@/components/organisms/tabs/TabClientWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div>
        <HeaderComponent />
      </div>
      <main className="flex-1 overflow-y-auto pt-16 pb-20">
        {children}
      </main>
      <footer className="fixed bottom-0 left-0 right-0">
        <TabClientWrapper />
      </footer>
    </>
  );
}
