import React from "react";
import ContactList from "../modules/chat/Sidebar";
import ChatWindow from "../modules/chat/ChatPanel";
import GroupDetails from "../modules/chat/InfoPanel";

const ChatPage = () => (
  <div className="h-[80vh]  flex bg-white border">
    {/* Sidebar */}
    <aside className="w-64 hidden lg:block bg-gray-900 text-white flex-shrink-0">
      <ContactList />
    </aside>

    {/* Chat Panel */}
    <main className="flex flex-col flex-grow border-r border-gray-200">
      <ChatWindow />
    </main>

    {/* Info Panel */}
    <aside className="w-80 bg-gray-50 p-4 hidden lg:block">
      <GroupDetails />
    </aside>
  </div>
);

export default ChatPage;
