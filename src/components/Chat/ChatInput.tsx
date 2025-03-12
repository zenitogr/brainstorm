import { useRef } from 'react';

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onFileSelect: (file: File) => void;
}

export function ChatInput({
  input,
  onInputChange,
  onSubmit,
  isLoading,
  onFileSelect
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        className="flex-1 p-2 rounded border"
        placeholder="Type your message..."
        disabled={isLoading}
      />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
        }}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="p-2 rounded bg-gray-200"
        disabled={isLoading}
      >
        Attach
      </button>
      <button
        onClick={onSubmit}
        className="p-2 rounded bg-blue-500 text-white"
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}