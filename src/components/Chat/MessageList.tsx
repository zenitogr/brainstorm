import { Message } from './types';
import { forwardRef } from 'react';

interface MessageListProps {
  messages: Message[];
}

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages }, ref) => {
    return (
      <div className="flex flex-col gap-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded ${
              message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'
            }`}
          >
            <p>{message.content}</p>
            {message.attachments?.map((attachment, i) => (
              <div key={i} className="mt-2">
                {/* Render attachments based on type */}
                {attachment.type === 'image' && (
                  <img src={attachment.data} alt="Attachment" />
                )}
              </div>
            ))}
          </div>
        ))}
        <div ref={ref} />
      </div>
    );
  }
);

MessageList.displayName = 'MessageList';