import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../theme';
import WorkoutTimer from '../components/WorkoutTimer';
import { RootStackParamList, Workout } from '../types';

type Route = RouteProp<RootStackParamList, 'Workout'>;

const MOCK_WORKOUT: Workout = {
  id: 'i10k-w1-d2',
  day: 'Thursday',
  type: 'Tempo',
  distance: 7,
  duration: 45,
  description: '2km warm-up, 3km tempo at threshold pace, 2km cool-down',
  intervals: [
    { duration: 600, pace: '6:30/km', type: 'rest' },
    { duration: 900, pace: '5:10/km', type: 'work' },
    { duration: 600, pace: '6:30/km', type: 'rest' },
  ],
};

const typeEmojis: Record<string, string> = {
  'Easy Run': '🏃',
  'Tempo': '⚡',
  'Long Run': '🛣️',
  'Intervals': '🔁',
  'Rest': '😴',
  'Cross Training': '🚴',
};

export default function WorkoutScreen() {
  const route = useRoute<Route>();
  const { workoutName } = route.params;
  const [completed, setCompleted] = useState(false);

  const workout = MOCK_WORKOUT;
  const emoji = typeEmojis[workout.type] || '🏃';

  const handleComplete = () => {
    setCompleted(true);
  };

  if (completed) {
    return (
      <View style={styles.completedContainer}>
        <Text style={styles.completedEmoji}>🎉</Text>
        <Text style={styles.completedTitle}>Workout Complete!</Text>
        <Text style={styles.completedSubtitle}>Great job! You finished {workout.distance ? `${workout.distance} km` : `${workout.duration} min`}</Text>
        <View style={styles.completedStats}>
          <View style={styles.completedStat}>
            <Text style={styles.completedStatValue}>{workout.distance || '–'}</Text>
            <Text style={styles.completedStatLabel}>km</Text>
          </View>
          <View style={styles.completedStat}>
            <Text style={styles.completedStatValue}>{workout.duration}</Text>
            <Text style={styles.completedStatLabel}>min</Text>
          </View>
        </View>
        <Text style={styles.xp}>+50 XP earned 🏅</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Workout Header */}
        <View style={styles.workoutHeader}>
          <Text style={styles.workoutEmoji}>{emoji}</Text>
          <Text style={styles.workoutName}>{workoutName}</Text>
          <Text style={styles.workoutType}>{workout.type}</Text>
        </View>

        {/* Description */}
        <View style={styles.descCard}>
          <Text style={styles.descTitle}>📋 Session Overview</Text>
          <Text style={styles.descText}>{workout.description}</Text>
          <View style={styles.descStats}>
            {workout.distance && (
              <View style={styles.descStat}>
                <Text style={styles.descStatValue}>{workout.distance} km</Text>
                <Text style={styles.descStatLabel}>Distance</Text>
              </View>
            )}
            <View style={styles.descStat}>
              <Text style={styles.descStatValue}>{workout.duration} min</Text>
              <Text style={styles.descStatLabel}>Duration</Text>
            </View>
          </View>
        </View>

        {/* Timer */}
        <View style={styles.timerCard}>
          <Text style={styles.timerTitle}>⏱ Workout Timer</Text>
          <WorkoutTimer
            intervals={workout.intervals}
            totalDuration={workout.duration}
            onComplete={handleComplete}
          />
        </View>

        {/* Intervals breakdown */}
        {workout.intervals && workout.intervals.length > 0 && (
          <View style={styles.intervalsCard}>
            <Text style={styles.intervalsTitle}>🔁 Interval Breakdown</Text>
            {workout.intervals.map((interval, idx) => (
              <View key={idx} style={[styles.intervalRow, { borderLeftColor: interval.type === 'work' ? colors.intervals : colors.easy }]}>
                <View style={styles.intervalMeta}>
                  <Text style={[styles.intervalType, { color: interval.type === 'work' ? colors.intervals : colors.easy }]}>
                    {interval.type === 'work' ? '⚡ WORK' : '🟢 RECOVER'}
                  </Text>
                  <Text style={styles.intervalDuration}>{Math.floor(interval.duration / 60)}:{String(interval.duration % 60).padStart(2, '0')}</Text>
                </View>
                <Text style={styles.intervalPace}>{interval.pace}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.md },
  workoutHeader: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  workoutEmoji: { fontSize: 56, marginBottom: spacing.sm },
  workoutName: { fontSize: 22, fontWeight: '700', color: colors.text, textAlign: 'center' },
  workoutType: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  descCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  descTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  descText: { fontSize: 13, color: colors.textSecondary, lineHeight: 18, marginBottom: spacing.md },
  descStats: { flexDirection: 'row', gap: spacing.xl },
  descStat: { alignItems: 'center' },
  descStatValue: { fontSize: 20, fontWeight: '700', color: colors.primary },
  descStatLabel: { fontSize: 11, color: colors.textMuted },
  timerCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  timerTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: spacing.xs, textAlign: 'center' },
  intervalsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  intervalsTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  intervalRow: {
    borderLeftWidth: 3,
    paddingLeft: spacing.md,
    marginBottom: spacing.sm,
  },
  intervalMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  intervalType: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  intervalDuration: { fontSize: 12, color: colors.textSecondary },
  intervalPace: { fontSize: 13, color: colors.text },
  completedContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  completedEmoji: { fontSize: 80, marginBottom: spacing.lg },
  completedTitle: { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  completedSubtitle: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xl },
  completedStats: { flexDirection: 'row', gap: spacing.xxl, marginBottom: spacing.lg },
  completedStat: { alignItems: 'center' },
  completedStatValue: { fontSize: 36, fontWeight: '700', color: colors.primary },
  completedStatLabel: { fontSize: 13, color: colors.textMuted },
  xp: { fontSize: 16, fontWeight: '600', color: colors.success },
});
