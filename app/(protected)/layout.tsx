import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SupabaseProvider from "@/lib/supabase-provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Mi retos | Clean Body',
  description: 'Hazle un commit a tu bienestar con nuestros retos diarios',
}

export default async function AppLayout({ children, }: { children: React.ReactNode; }) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <SupabaseProvider>
      {children}
    </SupabaseProvider>
  );
}
