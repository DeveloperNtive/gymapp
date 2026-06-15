import MuiProvider from "@/providers/AppProvider";

type AuthLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <MuiProvider>{children}</MuiProvider>;
}
