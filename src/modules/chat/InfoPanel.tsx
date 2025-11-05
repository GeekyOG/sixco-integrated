import React from "react";

const GroupDetails = () => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold">Group Info</h3>
    <div>
      <div className="font-medium text-gray-700">Group Name:</div>
      <div className="text-gray-900">Design Team</div>
    </div>
    <div>
      <div className="font-medium text-gray-700">Project:</div>
      <div className="text-gray-900">New Website Redesign</div>
    </div>
    <div>
      <div className="font-medium text-gray-700">Members:</div>
      <div className="text-gray-900">Alicia, Ernest, Dana</div>
    </div>
    <div>
      <div className="font-medium text-gray-700">Status:</div>
      <div className="text-gray-900">In Progress</div>
    </div>
  </div>
);

export default GroupDetails;
