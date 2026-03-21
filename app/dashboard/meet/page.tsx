export default function MeetPage() {
  return (
    <div className="bg-white dark:bg-black rounded-3xl overflow-hidden h-full">
      <iframe
        src="https://meet.jit.si/TeamForge-Demo"
        allow="camera; microphone; fullscreen; display-capture; autoplay"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}