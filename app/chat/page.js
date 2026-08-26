import ChatWindow from "../components/ChatWindow";

export const metadata = {
  title: "Report Assistant — ScanVisualizer",
};

export default function ChatPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-xs uppercase tracking-widest text-accent mb-2">AI Assistant</p>
      <h1 className="text-2xl font-bold mb-4">Ask about your scan</h1>
      <ChatWindow />
    </div>
  );
}
