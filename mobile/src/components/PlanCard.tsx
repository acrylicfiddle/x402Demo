import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../theme';
import { TrainingPlanSummary } from '../types';

interface Props {
  plan: TrainingPlanSummary;
  onPress: () => void;
}

const levelColors = {
  Beginner: colors.success,
  Intermediate: colors.warning,
  Advanced: colors.error,
};

export default function PlanCard({ plan, onPress }: Props) {
  const levelColor = levelColors[plan.level];
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.levelBadge, { backgroundColor: levelColor + '20', borderColor: levelColor }]}>
        <Text style={[styles.levelText, { color: levelColor }]}>{plan.level}</Text>
      </View>
      <Text style={styles.name}>{plan.name}</Text>
      <Text style={styles.description} numberOfLines={2}>{plan.description}</Text>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{plan.duration}</Text>
          <Text style={styles.statLabel}>Duration</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{plan.weeklyMileage}</Text>
          <Text style={styles.statLabel}>Weekly km</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{plan.workoutsPerWeek}x</Text>
          <Text style={styles.statLabel}>Per week</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.goal}>🎯 {plan.goal}</Text>
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>${(plan.price / 1000).toFixed(3)} USDC</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginBottom: spacing.sm,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '600',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  divider: {
    width: 1,
    backgroundColor: colors.surfaceLight,
    marginHorizontal: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goal: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
  priceTag: {
    backgroundColor: colors.primary + '20',
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  priceText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
});
