import "~/styles/globals.css";
import { TRPCReactProvider } from "~/trpc/react";
import RouteLoader from "./components/shared/RouteLoader";
import Navbar from "./components/shared/Navbar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html>
      <body>
        <RouteLoader>
          <Navbar />
          <TRPCReactProvider>
            {children}
          </TRPCReactProvider>
        </RouteLoader>
      </body>
    </html>
  );
}
