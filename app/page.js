'use client';
import { invoke } from '@tauri-apps/api/core';
import { useState } from 'react';

export default function Home() {
  const [greeting, setGreeting] = useState('');

  async function greet() {
    // This will call a Rust function that we'll create later
    const response = await invoke('greet', { name: 'Next.js' });
    setGreeting(response);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold">Next.js + Tauri</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={greet}
        >
          Greet
        </button>
        {greeting && <p className="mt-4">{greeting}</p>}
      </div>
    </main>
  );
}