import { PultProvider } from "@/lib/pult-store";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <PultProvider>
      <div className="flex min-h-screen bg-[#f4f2ee] text-stone-900">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
        </main>
      </div>
    </PultProvider>
  );
}
