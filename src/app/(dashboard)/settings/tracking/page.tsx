import { PixelList } from "@/components/tracking/pixel-list";

export default function TrackingSettingsPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Tracking</h1>
        <button className="border px-4 py-2 rounded-lg text-sm">Tutorial</button>
      </div>
      <PixelList />
    </div>
  );
}