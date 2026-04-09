"use client";

const Video = ({ src }: { src: string }) => {
  // Extract YouTube video ID from various YouTube URL formats
  const getYoutubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  };

  const youtubeId = getYoutubeId(src);
  const isYoutubeUrl = youtubeId !== null;

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-sm border border-white/10 shadow-2xl">
        {isYoutubeUrl ? (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title="Video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        ) : (
          <video
            src={src}
            className="w-full h-full object-cover"
            controls
            autoPlay={false}
            loop
            muted
          />
        )}
      </div>

      {/* Floating Elements */}
      <div className="absolute -top-8 -left-8 bg-primary/90 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl animate-float">
        <div className="text-sm font-semibold text-white">Expert Care</div>
        <div className="text-xs text-gray-300">Hospital-trained staff</div>
      </div>

      <div className="absolute -bottom-8 -right-8 bg-primary/90 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl animate-float animation-delay-200">
        <div className="text-sm font-semibold text-white">Available 24/7</div>
        <div className="text-xs text-gray-300">Always here for you</div>
      </div>
    </div>
  );
};

export default Video;