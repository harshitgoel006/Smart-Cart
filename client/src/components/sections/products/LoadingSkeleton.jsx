const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden"
          style={{
            borderRadius: "16px",
            border: "0.5px solid rgba(167,139,250,0.12)",
            background: "linear-gradient(160deg,#faf7ff,#fff)",
          }}
        >
          {/* Top accent placeholder */}
          <div style={{ height: "2px", background: "rgba(167,139,250,0.15)" }} />

          {/* Image area */}
          <div style={{ height: "200px", background: "rgba(167,139,250,0.08)" }} />

          {/* Content */}
          <div className="flex flex-col gap-3 p-4">
            <div style={{ height: "9px", width: "60px", borderRadius: "4px", background: "rgba(167,139,250,0.15)" }} />
            <div style={{ height: "13px", width: "100%", borderRadius: "4px", background: "rgba(167,139,250,0.1)" }} />
            <div style={{ height: "13px", width: "75%", borderRadius: "4px", background: "rgba(167,139,250,0.1)" }} />
            <div style={{ height: "10px", width: "80px", borderRadius: "4px", background: "rgba(167,139,250,0.08)" }} />
            <div style={{ height: "20px", width: "100px", borderRadius: "4px", background: "rgba(167,139,250,0.1)" }} />
            <div style={{ height: "34px", width: "100%", borderRadius: "10px", background: "rgba(139,92,246,0.1)", marginTop: "2px" }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;