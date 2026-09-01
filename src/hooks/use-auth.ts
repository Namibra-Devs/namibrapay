export { useUser, useAuth } from "@usehercules/auth/react";

import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auth logic here
    setLoading(false);
  }, []);

  return { user, loading };
}
