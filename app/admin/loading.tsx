export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-64 rounded-lg bg-slate-800" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="h-32 rounded-2xl border border-slate-800 bg-slate-900" />
        <div className="h-32 rounded-2xl border border-slate-800 bg-slate-900" />
        <div className="h-32 rounded-2xl border border-slate-800 bg-slate-900" />
        <div className="h-32 rounded-2xl border border-slate-800 bg-slate-900" />
      </div>
      <div className="h-64 rounded-2xl border border-slate-800 bg-slate-900" />
    </div>
  );
}
