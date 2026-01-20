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

  /**
   * Initiale & laufende Konfiguration
   */
  useEffect(() => {
    player.loop = loop;
  }, [player, loop]);

  useEffect(() => {
    player.volume = volume;
    volumeRef.current = volume;
  }, [player, volume]);

  const play = useCallback(() => {
    player.play();
  }, [player]);

  const pause = useCallback(() => {
    player.pause();
  }, [player]);

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
  };
}
