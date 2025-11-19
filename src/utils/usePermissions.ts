import { useEffect, useState } from "react";
import { UserData, hasPermission } from "../utils/permissionUtils";

export const usePermissions = (resource: string) => {
  const [permissions, setPermissions] = useState({
    canCreate: false,
    canRead: false,
    canUpdate: false,
    canDelete: false,
  });

  useEffect(() => {
    setPermissions({
      canCreate: hasPermission(`${resource}:create`),
      canRead: hasPermission(`${resource}:read`),
      canUpdate: hasPermission(`${resource}:update`),
      canDelete: hasPermission(`${resource}:delete`),
    });
  }, [resource]);

  return permissions;
};

export default usePermissions;
