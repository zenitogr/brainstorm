import { Provider } from './types';

interface ProviderSelectorProps {
  providers: Provider[];
  selectedProvider: string;
  selectedModel: string;
  onProviderChange: (provider: string) => void;
  onModelChange: (model: string) => void;
}

export function ProviderSelector({
  providers,
  selectedProvider,
  selectedModel,
  onProviderChange,
  onModelChange
}: ProviderSelectorProps) {
  return (
    <div className="flex gap-4 items-center">
      <select 
        value={selectedProvider}
        onChange={(e) => onProviderChange(e.target.value)}
        className="p-2 rounded border"
      >
        {providers.map(provider => (
          <option key={provider.id} value={provider.id}>
            {provider.name}
          </option>
        ))}
      </select>
      <select
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
        className="p-2 rounded border"
      >
        {providers.find(p => p.id === selectedProvider)?.models.map(model => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>
    </div>
  );
}