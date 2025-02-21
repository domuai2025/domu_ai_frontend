import { useCallback, useMemo, useState } from 'react';
import { useUIStore } from '@/store/ui-store';

export function useOptimizedForm<T extends Record<string, unknown>>(
  initialValues: T,
  onSubmit: (values: T) => Promise<void>
) {
  const [values, setValues] = useState(initialValues);
  const setLoading = useUIStore((state) => state.setLoading);
  const setError = useUIStore((state) => state.setError);

  const handleChange = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('form', true);
    try {
      await onSubmit(values);
      setError('form', null);
    } catch (err) {
      setError('form', err as Error);
    } finally {
      setLoading('form', false);
    }
  }, [values, onSubmit, setLoading, setError]);

  const isDirty = useMemo(() => {
    return Object.keys(initialValues).some(
      (key) => initialValues[key] !== values[key]
    );
  }, [initialValues, values]);

  return {
    values,
    handleChange,
    handleSubmit,
    isDirty,
  };
}