import React, { useEffect, useState } from "react";
import { useLazyGetAllUsersQuery } from "../../api/authApi";
import { useLazyGetAllClientsQuery } from "../../api/clientApi";
import { Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "../../utils/cn";

const ContactList = () => {
  const [getStaffs, { data: staffData, isFetching: staffLoading }] =
    useLazyGetAllUsersQuery();

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getStaffs({
      limit: 100,
      firstName: searchTerm,
    });
  }, [searchTerm]);

  const [getAllClients, { data: clientsData, isFetching }] =
    useLazyGetAllClientsQuery();

  useEffect(() => {
    getAllClients({
      limit: 100,
      firstName: searchTerm,
    });
  }, [searchTerm]);

  const navigate = useNavigate();

  const handleClick = (id: string, name: string) => {
    navigate(`/dashboard/chat?recipientId=${id}&name=${name}`);
  };
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const recipientId = params.get("recipientId");
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Chats</h2>
      <div className="flex items-center border max-w-[300px] w-[100%] px-6 py-1 rounded-md">
        <Search size={16} className="text-neutral-300" />
        <input
          onChange={(e) => setSearchTerm(e.target.value)}
          className=" py-[2px] text-[0.865rem] bg-transparent"
          placeholder="Search by ..."
        />
      </div>
      <ul className="space-y-2 mt-4">
        {staffData?.users?.map(
          (
            item: { firstName: string; lastName: string; id: string },
            i: number
          ) => (
            <li
              onClick={() =>
                handleClick(item.id, `${item.firstName} ${item.lastName}`)
              }
              key={i}
              className={cn(
                "rounded cursor-pointer p-2 ",
                recipientId == item.id && "bg-blue-600"
              )}
            >
              {item.firstName} {item.lastName}
            </li>
          )
        )}
        {clientsData?.clients?.map(
          (
            item: { firstName: string; lastName: string; id: string },
            i: number
          ) => (
            <li
              onClick={() =>
                handleClick(item.id, `${item.firstName} ${item.lastName}`)
              }
              key={i}
              className={cn(
                "rounded cursor-pointer",
                recipientId == item.id && "bg-blue-600"
              )}
            >
              {item.firstName} {item.lastName}
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default ContactList;
