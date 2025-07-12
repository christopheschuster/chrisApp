import { useState, useRef, useEffect } from 'react';

export function useLoadingTime() {
  const start = useRef(Date.now());
  const [loadingTime, setLoadingTime] = useState<number | undefined>();

  useEffect(() => {
    return () => {
      setLoadingTime((Date.now() - start.current) / 1000);
    };
  }, []);

  return { loadingTime };
}
