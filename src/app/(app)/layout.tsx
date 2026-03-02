import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { Providers } from "@/components/providers/Providers";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <AppShell>{children}</AppShell>
    </Providers>
  );
}
