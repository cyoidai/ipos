'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useFetch<T>(url: string, params?: Record<string, any>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const params_str = params ? JSON.stringify(params) : undefined;

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    axios.get(url, {
      params
    }).then((res) => {
      setData(res.data);
      setIsLoading(false);
    }).catch((error) => {
      setIsLoading(false);
      setError('error');
    });
  }, [url, params_str]);

  return { data, isLoading, error };
}
