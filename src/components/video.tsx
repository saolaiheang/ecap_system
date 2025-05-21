export default function TestVideo() {
  return (
    <div className="w-full">
      <div className="relative pt-[56.25%]"> {/* 16:9 Aspect Ratio */}
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-md"
          src="https://www.youtube.com/embed/V1u9X36RCJ0?autoplay=1&mute=1&loop=1&playlist=V1u9X36RCJ0&controls=0&modestbranding=1"
          title="Responsive YouTube Video"
          frameBorder="0"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
