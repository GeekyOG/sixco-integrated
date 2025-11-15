import React, { useEffect, useRef, useState } from "react";
import {
  useAddChatMutation,
  useLazyGetAllChatQuery,
} from "../../api/directChat";
import { useLocation, useParams } from "react-router-dom";
import { timeAgo } from "../../utils/export";
import { Trash, X } from "lucide-react";
import Spinner from "../../ui/Spinner";

const ChatWindow = () => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const recipientId = params.get("recipientId");

  const recipientName = params.get("name");

  const [getAllChat, { data, isLoading }] = useLazyGetAllChatQuery();
  const userDataRaw = localStorage.getItem("userData");
  const userData = userDataRaw ? JSON.parse(userDataRaw) : null;

  const [selectedFiles, setSelectedFiles] = useState<File | null>();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);
  const [newMessage, setNewMessage] = useState("");
  useEffect(() => {
    // only run if recipientId exists
    if (!recipientId) return;

    // call immediately once
    getAllChat({
      user1: recipientId,
      user2: userData.id,
    });

    // then set interval
    const interval = setInterval(() => {
      getAllChat({
        user1: recipientId,
        user2: userData.id,
      });
    }, 10000); // 10 seconds

    // cleanup on unmount or when recipientId changes
    return () => clearInterval(interval);
  }, [recipientId, userData.id]);

  const handleSend = () => {
    if (selectedFiles) {
      const formData = new FormData();

      formData.append("files", selectedFiles);
      formData.append("receiverId", recipientId as string);
      formData.append("content", newMessage);

      addChat(formData)
        .unwrap()
        .then(() => {
          // Refresh chat after sending
          getAllChat({
            user1: recipientId,
            user2: userData.id,
          });
        });
      // Add logic to send message
      console.log("Sending:", newMessage);
      setNewMessage("");
      return;
    }
    if (newMessage.trim()) {
      addChat({
        receiverId: recipientId,
        content: newMessage,
      })
        .unwrap()
        .then(() => {
          // Refresh chat after sending
          getAllChat({
            user1: recipientId,
            user2: userData.id,
          });
        })
        .then(() => {
          // Add logic to send message
          console.log("Sending:", newMessage);
          setNewMessage("");
        });
    }
  };

  const [addChat, {}] = useAddChatMutation();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold">{recipientName ?? "--"}</h2>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        ) : (
          data?.map((msg: any) => {
            const isUser = msg.sender.id === userData.id;
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
                    {msg.sender.firstName} {msg.sender.lastName} •{" "}
                    {timeAgo(msg.createdAt)}
                  </div>
                  <div className="text-gray-800">{msg.content}</div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Field */}

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-end justify-between space-x-2">
          {/* Text Input */}
          {selectedFiles ? (
            <div className="p-4  border-gray-200 relative">
              {selectedFiles ? (
                selectedFiles.type.startsWith("image/") ? (
                  <div className="relative inline-block">
                    <img
                      src={URL.createObjectURL(selectedFiles)}
                      alt="Selected preview"
                      className="max-w-xs rounded border max-h-[200px]"
                    />
                    {/* Cancel icon */}
                    <button
                      onClick={() => setSelectedFiles(null)}
                      className="absolute top-0 right-0 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                    >
                      <Trash className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-gray-600">
                      Selected file: {selectedFiles.name}
                    </p>
                    <Trash
                      onClick={() => setSelectedFiles(null)}
                      className="h-5 w-5 text-red-500 cursor-pointer"
                    />
                  </div>
                )
              ) : (
                <p className="text-sm text-gray-400">No file selected</p>
              )}
            </div>
          ) : (
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
          )}

          <div className="flex gap-4">
            {/* File Upload */}
            <label className="cursor-pointer bg-gray-100 px-3 py-2 rounded-lg border hover:bg-gray-200">
              <input
                type="file"
                className="hidden"
                onChange={(e: any) => {
                  const file = e?.target?.files[0];
                  if (file) {
                    setSelectedFiles(file);
                    console.log("Uploading:", file.name);
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
    </div>
  );
};

export default ChatWindow;
