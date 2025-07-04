"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  Music2,
} from "lucide-react";

const AUDIO_FILE_PATH = "/music/lofiee.mp3";

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  // Update mobile detection and handle scroll indicator
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.matchMedia("(max-width: 640px)").matches;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle scroll indicator visibility
  useEffect(() => {
    const scrollIndicator = document.querySelector(".scroll-indicator");
    if (scrollIndicator && isMobile) {
      if (isVisible) {
        scrollIndicator.classList.add("opacity-0", "pointer-events-none");
      } else {
        scrollIndicator.classList.remove("opacity-0", "pointer-events-none");
      }
    }

    return () => {
      const scrollIndicator = document.querySelector(".scroll-indicator");
      if (scrollIndicator) {
        scrollIndicator.classList.remove("opacity-0", "pointer-events-none");
      }
    };
  }, [isVisible, isMobile]);

  // Handle auto-hide on mobile with smooth transitions
  useEffect(() => {
    if (isMobile && isVisible) {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 15000);
    }

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [isMobile, isVisible]);

  // Create audio element and auto-play
  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.src = AUDIO_FILE_PATH;
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    const handleError = (e: ErrorEvent) => {
      console.error("Audio error:", e);
      setError(`Error loading audio: ${e.message}`);
      setIsPlaying(false);
    };

    const handleLoadSuccess = async () => {
      console.log("Audio file loaded successfully");
      setError(null);
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Auto-play failed:", err);
        setIsPlaying(false);
      }
    };

    audio.addEventListener("error", handleError);
    audio.addEventListener("loadeddata", handleLoadSuccess);

    return () => {
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("loadeddata", handleLoadSuccess);
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Initialize audio context and analyzer
  useEffect(() => {
    if (!audioRef.current) return;

    try {
      const context = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const analyserNode = context.createAnalyser();
      analyserNode.fftSize = 256;

      const source = context.createMediaElementSource(audioRef.current);
      source.connect(analyserNode);
      analyserNode.connect(context.destination);

      setAudioContext(context);
      setAnalyser(analyserNode);
      console.log("Audio context initialized successfully");
    } catch (err) {
      console.error("Error initializing audio context:", err);
      setError("Error initializing audio system");
    }

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  // Visualizer effect
  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawVisualizer = () => {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, "#3b82f6");
        gradient.addColorStop(1, "#60a5fa");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, canvas.height - barHeight, barWidth - 2, barHeight, 5);
        ctx.fill();

        x += barWidth;
      }

      animationFrameRef.current = requestAnimationFrame(drawVisualizer);
    };

    if (isPlaying) {
      drawVisualizer();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, analyser]);

  const togglePlay = async () => {
    if (!audioRef.current || !audioContext) return;

    try {
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setError(null);
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
          console.log("Playback started successfully");
        }
      }
    } catch (err) {
      console.error("Playback error:", err);
      setError("Error playing audio. Try clicking again.");
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(!isMuted);
  };

  const toggleVisibility = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    setIsVisible((prev) => !prev);
  };

  return (
    <>
      <AnimatePresence>
        {!isVisible && (
          <motion.button
            className="fixed bottom-8 right-0 bg-blue-500/50 hover:bg-blue-500 text-white p-2 rounded-l-xl z-50 shadow-lg cursor-pointer"
            onClick={toggleVisibility}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            whileHover={{ x: -5 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          >
            <Music2 size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`fixed glass-effect p-4 rounded-2xl z-40 opacity-80 hover:opacity-100 transition-all duration-500 group hover:shadow-lg hover:shadow-blue-500/20 backdrop-blur-sm ${
              isMobile
                ? "bottom-8 left-0 right-0 mx-auto max-w-sm w-[calc(100%-2rem)]"
                : "bottom-8 right-8"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.8, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
              opacity: { duration: 0.3 },
            }}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.2 },
            }}
          >
            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <button
                onClick={togglePlay}
                className={`w-10 h-10 rounded-full ${
                  error
                    ? "bg-red-500/50"
                    : "bg-blue-500/50 group-hover:bg-blue-500"
                } flex items-center justify-center text-white/90 group-hover:text-white transition-all duration-300`}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>

              <div className="relative w-48 h-12 opacity-75 group-hover:opacity-100 transition-opacity duration-300">
                <canvas
                  ref={canvasRef}
                  width={192}
                  height={48}
                  className="absolute inset-0"
                />
              </div>

              <button
                onClick={toggleMute}
                className={`w-10 h-10 rounded-full ${
                  error
                    ? "bg-red-500/20"
                    : "bg-blue-500/30 group-hover:bg-blue-500/20"
                } flex items-center justify-center text-white/90 group-hover:text-white transition-all duration-300`}
                disabled={!!error}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>

            <AnimatePresence>
              {(isPlaying || error) && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`text-sm mt-2 text-center transition-colors duration-300 ${
                    error
                      ? "text-red-400"
                      : "text-white/70 group-hover:text-white/90"
                  }`}
                >
                  {error || "Now Playing: Don Toliver - Givin Up 🎵"}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MusicPlayer;
