import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import Video from 'react-native-video';
import { colors } from '../../../core/theme/colors';
import { typography } from '../../../core/theme/typography';

interface VideoPlayerProps {
  videoUrl: string;
  initialPosition?: number;
  onProgress?: (progress: number) => void;
  /** Called with the current watched percentage (0-100) */
  onProgressPercent?: (percent: number) => void;
  onEnd?: () => void;
  /**
   * When true, the user cannot seek forward past the furthest
   * point they have naturally watched. Seeking backward is always allowed.
   * Set to false once the assessment is unlocked to allow free seeking.
   */
  seekLocked?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  initialPosition = 0,
  onProgress,
  onProgressPercent,
  onEnd,
  seekLocked = false,
}) => {
  const videoRef = useRef<any>(null);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);

  // Track the furthest point the user has naturally watched
  const maxWatchedTimeRef = useRef<number>(initialPosition);
  // Track the current playback time for seek enforcement
  const currentTimeRef = useRef<number>(0);
  // Flag to avoid re-entrancy when we programmatically seek back
  const isCorrectingSeekRef = useRef(false);

  const handleProgress = useCallback(
    (data: any) => {
      const currentTime = data.currentTime || 0;
      currentTimeRef.current = currentTime;

      // Only advance maxWatchedTime during natural playback (not during a correction)
      if (!isCorrectingSeekRef.current) {
        if (currentTime > maxWatchedTimeRef.current) {
          maxWatchedTimeRef.current = currentTime;
        }
      }

      if (onProgress) onProgress(currentTime);

      // Compute and report percentage
      if (onProgressPercent && duration > 0) {
        const percent = Math.round((currentTime / duration) * 100);
        onProgressPercent(percent);
      }
    },
    [onProgress, onProgressPercent, duration],
  );

  const handleSeek = useCallback(
    (data: any) => {
      if (!seekLocked) return; // Free seeking allowed

      const seekTarget = data.seekTime ?? data.currentTime ?? 0;
      const maxAllowed = maxWatchedTimeRef.current;

      // If seeking forward past what they've watched, snap back
      if (seekTarget > maxAllowed + 1) {
        // +1s tolerance for minor floating-point/frame differences
        isCorrectingSeekRef.current = true;
        videoRef.current?.seek(maxAllowed);

        // Reset correction flag after a brief delay
        setTimeout(() => {
          isCorrectingSeekRef.current = false;
        }, 500);
      }
    },
    [seekLocked],
  );

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load video.</Text>
          <Text style={styles.errorDetails}>{error} and video url:{videoUrl}</Text>
        </View>
      ) : (
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={styles.video}
          controls={true}
          controlsStyles={{
            hideForward: true,
            hideRewind: true,
            hideNext: true,
            hidePrevious: true,
          }}
          paused={paused}
          onLoad={(data: any) => {
            setLoading(false);
            const dur = data.duration || 0;
            setDuration(dur);
            if (initialPosition > 0 && videoRef.current) {
              videoRef.current.seek(initialPosition);
              maxWatchedTimeRef.current = initialPosition;
            }
          }}
          onProgress={handleProgress}
          onSeek={handleSeek}
          onEnd={onEnd}
          onError={(e: any) => {
            setLoading(false);
            console.log('Video error:', e);
            setError(
              e?.error?.errorString || 'Unknown playback error',
            );
          }}
          resizeMode="contain"
        />
      )}

      {loading && !error && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.black,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    ...typography.bodyLarge,
    color: colors.white,
    marginBottom: 8,
  },
  errorDetails: {
    ...typography.caption,
    color: colors.dangerLight,
    textAlign: 'center',
  },
});
