import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { colors, spacing, borderRadius } from '../theme';
import { Interval } from '../types';

interface Props {
  intervals?: Interval[];
  totalDuration: number;
  onComplete?: () => void;
}

export default function WorkoutTimer({ intervals, totalDuration, onComplete }: Props) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [currentIntervalIndex, setCurrentIntervalIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const totalSeconds = totalDuration * 60;
  const progress = elapsed / totalSeconds;
  const remaining = totalSeconds - elapsed;

  const currentInterval = intervals?.[currentIntervalIndex];

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => {
          const next = prev + 1;
          if (next >= totalSeconds) {
            setIsRunning(false);
            onComplete?.();
            return totalSeconds;
          }
          // Advance intervals
          if (intervals) {
            let acc = 0;
            for (let i = 0; i < intervals.length; i++) {
              acc += intervals[i].duration;
              if (next < acc) {
                setCurrentIntervalIndex(i);
                break;
              }
            }
          }
          return next;
        });
      }, 1000);

      // Pulse animation for active workout
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const isWorkInterval = currentInterval?.type === 'work';

  return (
    <View style={styles.container}>
      {/* Main Timer */}
      <Animated.View style={[styles.timerRing, { transform: [{ scale: isRunning ? pulseAnim : 1 }], borderColor: isRunning ? (isWorkInterval ? colors.intervals : colors.easy) : colors.surfaceLight }]}>
        <Text style={styles.timeText}>{formatTime(remaining)}</Text>
        <Text style={styles.timeLabel}>remaining</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` as any, backgroundColor: isWorkInterval ? colors.intervals : colors.easy }]} />
        </View>
      </Animated.View>

      {/* Current Interval */}
      {currentInterval && isRunning && (
        <View style={[styles.intervalBadge, { backgroundColor: isWorkInterval ? colors.intervals + '20' : colors.easy + '20' }]}>
          <Text style={[styles.intervalType, { color: isWorkInterval ? colors.intervals : colors.easy }]}>
            {isWorkInterval ? '⚡ WORK' : '🟢 RECOVER'}
          </Text>
          <Text style={styles.intervalPace}>{currentInterval.pace}</Text>
        </View>
      )}

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.resetBtn} onPress={() => { setElapsed(0); setCurrentIntervalIndex(0); setIsRunning(false); }}>
          <Text style={styles.resetText}>↺</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.playBtn, { backgroundColor: isRunning ? colors.warning : colors.primary }]}
          onPress={() => setIsRunning(!isRunning)}
        >
          <Text style={styles.playText}>{isRunning ? '⏸' : '▶'}</Text>
        </TouchableOpacity>
        <View style={styles.resetBtn} />
      </View>

      <Text style={styles.elapsedText}>Elapsed: {formatTime(elapsed)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  timerRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 6,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  timeText: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.text,
  },
  timeLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  progressBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 3,
    backgroundColor: colors.surfaceLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  intervalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
  },
  intervalType: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  intervalPace: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
    marginBottom: spacing.md,
  },
  playBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playText: {
    fontSize: 28,
    color: '#fff',
  },
  resetBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetText: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  elapsedText: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
