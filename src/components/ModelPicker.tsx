'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ProviderName } from '@/lib/gateway/manager';

interface Props {
  selectedModel: string;
  activeProvider: ProviderName;
  onModelChange: (model: string) => void;
  onProviderChange: (provider: ProviderName) => void;
  disabled?: boolean;
}

const PROVIDERS: { value: ProviderName; label: string }[] = [
  { value: 'openrouter', label: 'OpenRouter' },
  { value: 'ollama', label: 'Ollama (local)' },
  { value: 'lmstudio', label: 'LM Studio (local)' },
];

export default function ModelPicker({
  selectedModel,
  activeProvider,
  onModelChange,
  onProviderChange,
  disabled,
}: Props) {
  const [models, setModels] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);

  const fetchModels = useCallback(async () => {
    setLoadingModels(true);
    setModelError(null);
    try {
      const res = await fetch('/api/models');
      const data = await res.json() as { models?: string[]; error?: string };
      if (data.error) {
        setModelError(data.error);
        setModels([]);
      } else {
        setModels(data.models ?? []);
        // Select first model if current selection not in list
        if (data.models && data.models.length > 0 && !data.models.includes(selectedModel)) {
          onModelChange(data.models[0]);
        }
      }
    } catch {
      setModelError('Failed to load models');
    } finally {
      setLoadingModels(false);
    }
  }, [selectedModel, onModelChange]);

  // Fetch models on mount and when provider changes
  useEffect(() => {
    fetchModels();
  }, [activeProvider, fetchModels]);

  const handleProviderChange = async (provider: ProviderName) => {
    // Switch provider server-side first, then fetch new models
    try {
      await fetch('/api/provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });
      onProviderChange(provider);
    } catch { /* ignore, will show stale models */ }
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      {/* Provider selector */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500 dark:text-gray-400 w-14 flex-shrink-0">Provider</label>
        <select
          value={activeProvider}
          onChange={(e) => handleProviderChange(e.target.value as ProviderName)}
          disabled={disabled}
          className="flex-1 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {PROVIDERS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      {/* Model selector */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500 dark:text-gray-400 w-14 flex-shrink-0">Model</label>
        {loadingModels ? (
          <span className="text-sm text-gray-400 italic">Loading models...</span>
        ) : modelError ? (
          <span className="text-sm text-red-500 truncate" title={modelError}>
            {modelError.length > 40 ? modelError.slice(0, 37) + '...' : modelError}
          </span>
        ) : models.length === 0 ? (
          <span className="text-sm text-gray-400 italic">No models available</span>
        ) : (
          <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            disabled={disabled}
            className="flex-1 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 truncate"
          >
            {models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
