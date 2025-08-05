"use client";

export default function SystemTerminal() {
  // Ovde možeš zameniti poruke sa dinamičkim kasnije
  const messages = [
    "12.08.2025 12:34 : System ready, no errors",
    "12.08.2025 12:36 : Alarm Room #2012, Hi temp alarm, T=36C",
  ];

  return (
    <div className="bg-black text-green-400 font-mono text-sm px-4 py-2 border-t border-gray-700 fixed bottom-0 left-0 right-0 z-50">
      {messages.map((msg, i) => (
        <div key={i}>{msg}</div>
      ))}
    </div>
  );
}
