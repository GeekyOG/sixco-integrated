import { useAuth } from "../context/AuthContext";

export const usePermission = () => {
  const { userData } = useAuth();
  const permissions = userData?.permissions || [];

  const hasPermission = (perm: string) => permissions.includes(perm);

  return { hasPermission };
};
