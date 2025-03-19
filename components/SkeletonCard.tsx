import ImagePlaceholder from "./ImagePlaceholder";

function SkeletonCard() {
  return (
    <div className="relative w-[355px] rounded-xl overflow-hidden bg-zinc-800 border-4 border-zinc-600 p-1 flex flex-col justify-between shimmer z-10 opacity-50">
      <ImagePlaceholder text="" />
      <div className="block p-2 opacity-50 animate-pulse">
        <div className="bg-pink-500 w-1/3 h-4 my-2 rounded-md animate-pulse"></div>
        <div className="w-full h-6 bg-gray-700 text-2xl rounded-md animate-pulse"></div>
        <div className="h-1 rounded-md bg-slate-600 my-2"></div>
        <div className="w-full h-10 bg-gray-600 rounded-md my-2 animate-pulse">
        </div>
      </div>
      <div className="flex justify-between opacity-50 gap-1 rounded-lg  overflow-hidden">
        <div className="p-6 bg-gray-600 w-full animate-pulse"></div>
        <div className="p-6 bg-gray-600 w-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;