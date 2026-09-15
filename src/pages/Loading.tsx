const LoadingScreen = function ({ extraText }: { extraText?: string }) {
  return (
    <>
      <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col gap-6! items-center justify-center p-6!">
        <div className="w-12 h-12 border-4 border-[#d1b797] border-t-transparent rounded-full animate-spin mb-4!" />
        <p className="text-sm uppercase tracking-widest text-zinc-400">
          Loading Profile...
        </p>
        <p className="text-sm uppercase tracking-widest text-zinc-400">
          {extraText}
        </p>
      </div>
      ;
    </>
  );
};

export default LoadingScreen;
