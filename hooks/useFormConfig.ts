/** @format */

import { useState, useEffect, useCallback } from 'react';
import { FormConfig } from '@/types/FormTypes';

interface UseFormConfigResult {
  config: FormConfig | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useFormConfig = (configPath?: string): UseFormConfigResult => {
  const [config, setConfig] = useState<FormConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the provided config path or default to completeFormConfig.json
      const configUrl = configPath || '/data/completeFormConfig.json';

      const response = await fetch(configUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch config: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setConfig(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load configuration'
      );
    } finally {
      setLoading(false);
    }
  }, [configPath]);

  const refetch = useCallback(() => {
    loadConfig();
  }, [loadConfig]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return { config, loading, error, refetch };
};
