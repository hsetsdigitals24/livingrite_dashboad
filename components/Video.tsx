"use client";


const Video = ({ src }: { src: string }) => {
  return (
    <div className="relative w-full max-w-md">
      <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-sm border border-white/10 overflow-hidden shadow-2xl">
        <video
          src={src}
          className="w-full h-full object-cover"
          controls
          autoPlay
          loop
          muted
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute -top-8 -left-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl animate-float">
        <div className="text-sm font-semibold text-white">Expert Care</div>
        <div className="text-xs text-gray-300">Hospital-trained staff</div>
      </div>

      <div className="absolute -bottom-8 -right-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl animate-float animation-delay-200">
        <div className="text-sm font-semibold text-white">Available 24/7</div>
        <div className="text-xs text-gray-300">Always here for you</div>
      </div>
    </div>
  );
};

export default Video;