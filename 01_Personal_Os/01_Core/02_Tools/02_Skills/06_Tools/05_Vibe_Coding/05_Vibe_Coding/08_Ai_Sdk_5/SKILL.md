---
name: ai-sdk-5
description: >
  Vercel AI SDK 5 patterns.
  Trigger: When building AI chat features - breaking changes from v4.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
sota_upgraded: true
---

## Breaking Changes from AI SDK 4

```typescript
// ❌ AI SDK 4 (OLD)
import { useChat } from "ai";
const { messages, handleSubmit, input, handleInputChange } = useChat({
  api: "/api/chat",
});

// ✅ AI SDK 5 (NEW)
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({ api: "/api/chat" }),
});
```

## Client Setup

```typescript
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";

export function Chat() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, isLoading, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div>
      <div>
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>

      {error && <div>Error: {error.message}</div>}
    </div>
  );
}
```

## UIMessage Structure (v5)

```typescript
// ❌ Old: message.content was a string
// ✅ New: message.parts is an array

interface UIMessage {
  id: string;
  role: "user" | "assistant" | "system";
  parts: MessagePart[];
}

type MessagePart =
  | { type: "text"; text: string }
  | { type: "image"; image: string }
  | { type: "tool-call"; toolCallId: string; toolName: string; args: unknown }
  | { type: "tool-result"; toolCallId: string; result: unknown };

// Extract text from parts
function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("");
}

// Render message
function Message({ message }: { message: UIMessage }) {
  return (
    <div className={message.role === "user" ? "user" : "assistant"}>
      {message.parts.map((part, index) => {
        if (part.type === "text") {
          return <p key={index}>{part.text}</p>;
        }
        if (part.type === "image") {
          return <img key={index} src={part.image} alt="" />;
        }
        return null;
      })}
    </div>
  );
}
```

## Server-Side (Route Handler)

```typescript
// app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai("gpt-4o"),
    messages,
    system: "You are a helpful assistant.",
  });

  return result.toDataStreamResponse();
}
```

## With LangChain

```typescript
// app/api/chat/route.ts
import { toUIMessageStream } from "@ai-sdk/langchain";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    streaming: true,
  });

  // Convert UI messages to LangChain format
  const langchainMessages = messages.map((m) => {
    const text = m.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("");
    return m.role === "user"
      ? new HumanMessage(text)
      : new AIMessage(text);
  });

  const stream = await model.stream(langchainMessages);

  return toUIMessageStream(stream).toDataStreamResponse();
}
```

## Streaming with Tools

```typescript
import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";

const result = await streamText({
  model: openai("gpt-4o"),
  messages,
  tools: {
    getWeather: tool({
      description: "Get weather for a location",
      parameters: z.object({
        location: z.string().describe("City name"),
      }),
      execute: async ({ location }) => {
        // Fetch weather data
        return { temperature: 72, condition: "sunny" };
      },
    }),
  },
});
```

## useCompletion (Text Generation)

```typescript
import { useCompletion } from "@ai-sdk/react";
import { DefaultCompletionTransport } from "ai";

const { completion, complete, isLoading } = useCompletion({
  transport: new DefaultCompletionTransport({ api: "/api/complete" }),
});

// Trigger completion
await complete("Write a haiku about");
```

## Error Handling

```typescript
const { error, messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({ api: "/api/chat" }),
  onError: (error) => {
    console.error("Chat error:", error);
    toast.error("Failed to send message");
  },
});

// Display error
{error && (
  <div className="error">
    {error.message}
    <button onClick={() => sendMessage({ text: lastInput })}>
      Retry
    </button>
  </div>
)}
```

## Keywords
ai sdk, vercel ai, chat, streaming, langchain, openai, llm


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
