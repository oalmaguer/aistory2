export default function Reader({ story }: { story: string }) {
  return (
    <div className="bg-black/50 p-6 rounded-lg border border-red-900/30 prose prose-invert prose-red">
      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
        {story}
      </p>
    </div>
  );
}
