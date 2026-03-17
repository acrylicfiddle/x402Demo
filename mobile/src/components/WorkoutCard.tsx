import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../theme';
import { Workout } from '../types';

interface Props {
  workout: Workout;
  onPress: () => void;
  locked?: boolean;
}

const typeColors: Record<string, string> = {
  'Easy Run': colors.easy,
  'Tempo': colors.tempo,
  'Long Run': colors.longRun,
  'Intervals': colors.intervals,
  'Rest': colors.rest,
  'Cross Training': colors.cross,
};

const typeEmojis: Record<string, string> = {
  'Easy Run': '🏃',
  'Tempo': '⚡',
  'Long Run': '🛣️',
  'Intervals': '🔁',
  'Rest': '😴',
  'Cross Training': '🚴',
};

export default function WorkoutCard({ workout, onPress, locked }: Props) {
  const typeColor = typeColors[workout.type] || colors.primary;
  const typeEmoji = typeEmojis[workout.type] || '🏃';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85} disabled={workout.type === 'Rest'}>
      <View style={[styles.typeIndicator, { backgroundColor: typeColor }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.day}>{workout.day}</Text>
          <View style={[styles.typeBadge, { backgroundColor: typeColor + '25' }]}>
            <Text style={styles.typeEmoji}>{typeEmoji}</Text>
            <Text style={[styles.typeText, { color: typeColor }]}>{workout.type}</Text>
          </View>
        </View>
        <Text style={styles.description} numberOfLines={2}>{workout.description}</Text>
        <View style={styles.meta}>
          {workout.distance && (
            <Text style={styles.metaItem}>📍 {workout.distance} km</Text>
          )}
          <Text style={styles.metaItem}>⏱ {workout.duration} min</Text>
          {workout.intervals && (
            <Text style={styles.metaItem}>🔁 {workout.intervals.length} intervals</Text>
          )}
        </View>
      </View>
      {locked && (
        <View style={styles.lockOverlay}>
          <Text style={styles.lockIcon}>🔒</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  typeIndicator: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  day: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    gap: 4,
  },
  typeEmoji: {
    fontSize: 11,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  meta: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metaItem: {
    fontSize: 11,
    color: colors.textMuted,
  },
  lockOverlay: {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  lockIcon: {
    fontSize: 20,
  },
});
