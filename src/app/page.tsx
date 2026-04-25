'use client';

import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import ChatContainer from '@/components/chat/ChatContainer';

export default function Home() {
  return (
    <div className="flex h-screen w-full bg-bg-primary text-text-primary overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <ChatContainer />
      </main>
    </div>
  );
}
