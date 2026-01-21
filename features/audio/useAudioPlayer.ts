import { useCallback, useEffect, useRef } from "react";
import { useAudioPlayer as useExpoAudioPlayer } from "expo-audio";

interface UseAudioPlayerOptions {
  source: number;
  loop?: boolean;
  volume?: number;
}

export function useAudioPlayer({
  source,
  loop = true,
  volume = 1,
}: UseAudioPlayerOptions) {
  const player = useExpoAudioPlayer(source);

  /**
   * Merken der letzten "echten" Lautstärke
   * (nur relevant, wenn Volume dynamisch geändert wird)
   */
  const volumeRef = useRef(volume);
  const fadeFrameRef = useRef<number | null>(null);

  /**
   * Initiale & laufende Konfiguration
   */
  useEffect(() => {
    player.loop = loop;
    player.volume = volume;
  }, [player, loop, volume]);

  // --- Core controls ---
  const play = useCallback(() => {
    player.play();
  }, [player]);

  const pause = useCallback(() => {
    player.pause();
  }, [player]);

  const reset = useCallback(() => {
    player.seekTo(0);
    player.pause();
  }, [player]);

  // --- Fade logic ---
  const cancelFade = () => {
    if (fadeFrameRef.current !== null) {
      cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }
  };

  const fadeTo = useCallback(
    (targetVolume: number, durationMs: number) => {
      cancelFade();

      if (player.muted) return;

      const startVolume = player.volume ?? 0;
      const delta = targetVolume - startVolume;
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);

        player.volume = startVolume + delta * progress;

        if (progress < 1) {
          fadeFrameRef.current = requestAnimationFrame(tick);
        } else {
          player.volume = targetVolume;
          fadeFrameRef.current = null;
        }
      };

      fadeFrameRef.current = requestAnimationFrame(tick);
    },
    [player],
  );

  // --- Mute ---
  const mute = useCallback(() => {
    player.muted = true;
  }, [player]);

  const unmute = useCallback(() => {
    player.muted = false;
    player.volume = volumeRef.current;
  }, [player]);

  const toggleMute = useCallback(() => {
    player.muted ? unmute() : mute();
  }, [player, mute, unmute]);

  return {
    isPlaying: player.playing,
    isMuted: player.muted,

    play,
    pause,
    mute,
    unmute,
    toggleMute,
    fadeTo,
    reset,
  };
}
