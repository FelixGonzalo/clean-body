import { Avatar } from "@/components/Avatar";
import { clerkClient} from "@clerk/nextjs/server";
import { Metadata } from "next";
import { ContainerData } from "../ContainerData";

type Props = {params: Promise<{ userId: string }>}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const { userId } = await params
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);

  return {
    title: `${user.fullName || "Dev"} | Clean Body`,
    description: 'Eres tu principal framework, mantenlo actualizado',
  }
}

export default async function Dev({params}: Props) {
  const { userId } = await params;
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);

  return (
    <main className="p-4 max-w-100 mx-auto mb-20">
      <Avatar user={{
        fullName: user.fullName || "",
        imageUrl: user.imageUrl,
      }} />
      <ContainerData userId={userId} />
    </main>
  );
}
