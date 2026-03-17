import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors, spacing, borderRadius } from '../theme';
import StatCard from '../components/StatCard';
import { MainTabParamList } from '../types';

type Nav = BottomTabNavigationProp<MainTabParamList>;

const recentRuns = [
  { date: 'Mon, Mar 17', type: 'Easy Run', distance: '6.2 km', duration: '38:24', pace: '6:12/km' },
  { date: 'Sat, Mar 15', type: 'Long Run', distance: '18.5 km', duration: '1:52:10', pace: '6:04/km' },
  { date: 'Thu, Mar 13', type: 'Tempo', distance: '8 km', duration: '41:30', pace: '5:11/km' },
];

const typeColors: Record<string, string> = {
  'Easy Run': colors.easy,
  'Tempo': colors.tempo,
  'Long Run': colors.longRun,
  'Intervals': colors.intervals,
};

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning, Runner 👋</Text>
            <Text style={styles.date}>{today}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🏃</Text>
          </View>
        </View>

        {/* Today's Workout Banner */}
        <TouchableOpacity style={styles.todayCard} onPress={() => navigation.navigate('Plans')}>
          <View style={styles.todayBadge}>
            <Text style={styles.todayBadgeText}>TODAY</Text>
          </View>
          <Text style={styles.todayTitle}>Tempo Run</Text>
          <Text style={styles.todaySubtitle}>8 km · 45 min · Zone 3-4</Text>
          <View style={styles.todayDetails}>
            <Text style={styles.todayDetail}>⚡ Threshold pace</Text>
            <Text style={styles.todayDetail}>💰 $0.001 USDC</Text>
          </View>
          <View style={styles.startBtn}>
            <Text style={styles.startBtnText}>Start Workout →</Text>
          </View>
        </TouchableOpacity>

        {/* Weekly Stats */}
        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.statsRow}>
          <StatCard label="Distance" value="32.5" unit="km" accent={colors.primary} />
          <StatCard label="Time" value="3:24" unit="hrs" accent={colors.secondary} />
          <StatCard label="Runs" value="4" unit="runs" accent={colors.success} />
        </View>

        {/* Streak */}
        <View style={styles.streakCard}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <View>
            <Text style={styles.streakTitle}>12 Day Streak!</Text>
            <Text style={styles.streakSubtitle}>Keep it up — you're on fire</Text>
          </View>
          <Text style={styles.streakBig}>12</Text>
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Runs</Text>
        {recentRuns.map((run, idx) => (
          <View key={idx} style={styles.runItem}>
            <View style={[styles.runDot, { backgroundColor: typeColors[run.type] || colors.primary }]} />
            <View style={styles.runInfo}>
              <Text style={styles.runType}>{run.type}</Text>
              <Text style={styles.runDate}>{run.date}</Text>
            </View>
            <View style={styles.runStats}>
              <Text style={styles.runDistance}>{run.distance}</Text>
              <Text style={styles.runMeta}>{run.pace} · {run.duration}</Text>
            </View>
          </View>
        ))}

        {/* Browse Plans CTA */}
        <TouchableOpacity style={styles.ctaCard} onPress={() => navigation.navigate('Plans')}>
          <Text style={styles.ctaTitle}>🎯 Ready for a new challenge?</Text>
          <Text style={styles.ctaSubtitle}>Browse our premium training plans powered by x402 payments</Text>
          <Text style={styles.ctaLink}>View Plans →</Text>
        </TouchableOpacity>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.md },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  greeting: { fontSize: 22, fontWeight: '700', color: colors.text },
  date: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 24 },
  todayCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  todayBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginBottom: spacing.sm,
  },
  todayBadgeText: { fontSize: 10, fontWeight: '700', color: '#fff', letterSpacing: 1 },
  todayTitle: { fontSize: 26, fontWeight: '700', color: '#fff', marginBottom: 4 },
  todaySubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: spacing.sm },
  todayDetails: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  todayDetail: { fontSize: 13, color: 'rgba(255,255,255,0.9)' },
  startBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignSelf: 'flex-start',
  },
  startBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    marginHorizontal: -spacing.xs,
  },
  streakCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  streakEmoji: { fontSize: 32 },
  streakTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  streakSubtitle: { fontSize: 12, color: colors.textSecondary },
  streakBig: { fontSize: 48, fontWeight: '700', color: colors.primary, marginLeft: 'auto' },
  runItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.xs,
  },
  runDot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.md },
  runInfo: { flex: 1 },
  runType: { fontSize: 14, fontWeight: '600', color: colors.text },
  runDate: { fontSize: 11, color: colors.textMuted },
  runStats: { alignItems: 'flex-end' },
  runDistance: { fontSize: 14, fontWeight: '700', color: colors.text },
  runMeta: { fontSize: 11, color: colors.textMuted },
  ctaCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  ctaTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  ctaSubtitle: { fontSize: 13, color: colors.textSecondary, marginBottom: spacing.sm, lineHeight: 18 },
  ctaLink: { fontSize: 13, fontWeight: '700', color: colors.primary },
});
