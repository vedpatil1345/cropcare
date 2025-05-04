'use client'
import Chat from "@/components/pages/Chat";
import { useUser } from '@clerk/nextjs';
export default function Home() {
  const { user } = useUser();
  return (
    
    <Chat userId={user.emailAddresses[0].emailAddress} />
  );
}
