'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useFetch(url: string, params={}) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
