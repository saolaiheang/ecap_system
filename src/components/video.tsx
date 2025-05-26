export default function TestVideo() {
  return (
    <div className="w-full">
      <div className="relative pt-[56.25%]"> {/* 16:9 Aspect Ratio */}
        <video
          className="absolute top-0 left-0 w-full h-full rounded-md object-cover"
          src="https://res.cloudinary.com/dftmo6ep2/video/upload/v1748243100/y2mate.com_-_PSE_Sport_Club_event_2022_1080p_mcttxw.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
    </div>
  );
}
