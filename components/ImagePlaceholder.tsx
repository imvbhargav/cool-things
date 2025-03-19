function ImagePlaceholder({ text }: Readonly<{ text: string }>) {
  const bgColor = text == '' ? "bg-zinc-800 animate-pulse" : "bg-black";
  return (
    <div className={`w-full aspect-video rounded-lg flex justify-center items-center z-0 ${bgColor}`}>
      { text }
    </div>
  );
};

export default ImagePlaceholder;