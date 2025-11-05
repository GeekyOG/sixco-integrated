import React, { useState } from "react";

const messages = [
  {
    id: 1,
    sender: "Alicia Phillips",
    content: "Hey team, here are the new design files.",
    files: ["newdesign.jpg", "preview2.jpg"],
    time: "10:45 AM",
  },
  {
    id: 2,
    sender: "Ernest Lawson",
    content: "Looks great! Let’s move forward.",
    time: "10:47 AM",
  },
  {
    id: 3,
    sender: "You",
    content: "Awesome! I'll start integrating them now.",
    time: "10:48 AM",
  },
  {
    id: 1,
    sender: "Alicia Phillips",
    content: "Hey team, here are the new design files.",
    files: ["newdesign.jpg", "preview2.jpg"],
    time: "10:45 AM",
  },
  {
    id: 2,
    sender: "Ernest Lawson",
    content: "Looks great! Let’s move forward.",
    time: "10:47 AM",
  },
  {
    id: 3,
    sender: "You",
    content: "Awesome! I'll start integrating them now.",
    time: "10:48 AM",
  },
];

const ChatWindow = () => {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      // Add logic to send message
      console.log("Sending:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold">Design Team</h2>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => {
          const isUser = msg.sender === "You";
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-4 ${
                isUser ? "justify-end" : ""
              }`}
            >
              {!isUser && (
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  {msg.sender.charAt(0)}
                </div>
              )}
              <div
                className={`max-w-md p-4 rounded-lg ${
                  isUser ? "bg-blue-100 text-right" : "bg-gray-100 text-left"
                }`}
              >
                <div className="text-sm text-gray-600 font-medium mb-1">
                  {msg.sender} • {msg.time}
                </div>
                <div className="text-gray-800">{msg.content}</div>
                {msg.files && (
                  <div className="mt-2 space-y-1">
                    {msg.files.map((file) => (
                      <a
                        key={file}
                        href="#"
                        className="text-blue-600 underline block"
                      >
                        {file}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Field */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          {/* Text Input */}
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          {/* File Upload */}
          <label className="cursor-pointer bg-gray-100 px-3 py-2 rounded-lg border hover:bg-gray-200">
            <input
              type="file"
              className="hidden"
              onChange={(e: any) => {
                const file = e?.target?.files[0];
                if (file) {
                  console.log("Uploading:", file.name);
                  // Add your upload logic here
                }
              }}
            />
            📎
          </label>

          {/* Send Button */}
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
