'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useFetch<T>(url: string, params={}) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, [url]);

  return { data, isLoading, error };
}
