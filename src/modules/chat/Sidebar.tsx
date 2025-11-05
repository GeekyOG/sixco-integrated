import React from "react";

const ContactList = () => (
  <div className="p-4">
    <h2 className="text-xl font-semibold mb-4">Chats</h2>
    <ul className="space-y-2">
      <li className="bg-gray-800 p-2 rounded cursor-pointer">Design Team</li>
      <li className="p-2 rounded hover:bg-gray-700 cursor-pointer">
        Marketing
      </li>
      <li className="p-2 rounded hover:bg-gray-700 cursor-pointer">
        Development
      </li>
    </ul>
  </div>
);

export default ContactList;
