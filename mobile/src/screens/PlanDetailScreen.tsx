import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator, StatusBar, Alert
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, borderRadius } from '../theme';
import WorkoutCard from '../components/WorkoutCard';
import { TrainingPlan, RootStackParamList } from '../types';
import { getPlanDetail } from '../api/client';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'PlanDetail'>;

const MOCK_PLAN: TrainingPlan = {
  id: 'intermediate-10k',
  name: '10K Personal Best',
  level: 'Intermediate',
  duration: '10 weeks',
  description: 'Break your 10K personal best with structured speed work and long runs.',
  goal: 'Sub-55 minute 10K',
  weeklyMileage: '30-45 km',
  workoutsPerWeek: 4,
  price: 1,
  weeks: [
    {
      week: 1,
      focus: 'Base building',
      workouts: [
        {
          id: 'i10k-w1-d1',
          day: 'Tuesday',
          type: 'Easy Run',
          distance: 6,
          duration: 40,
          description: 'Easy conversational pace. Heart rate zone 2.',
        },
        {
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
        },
        {
          id: 'i10k-w1-d3',
          day: 'Saturday',
          type: 'Long Run',
          distance: 12,
          duration: 70,
          description: 'Long slow run. Focus on time on feet, not speed.',
        },
        {
          id: 'i10k-w1-d4',
          day: 'Sunday',
          type: 'Cross Training',
          duration: 40,
          description: '40 min easy cycling or swimming for active recovery.',
        },
      ],
    },
    {
      week: 2,
      focus: 'Speed introduction',
      workouts: [
        {
          id: 'i10k-w2-d1',
          day: 'Tuesday',
          type: 'Easy Run',
          distance: 7,
          duration: 45,
          description: 'Easy conversational pace.',
        },
        {
          id: 'i10k-w2-d2',
          day: 'Thursday',
          type: 'Intervals',
          distance: 8,
          duration: 50,
          description: '4 x 1km at 10K race pace with 2 min recovery',
          intervals: [
            { duration: 600, pace: '6:00/km', type: 'rest' },
            { duration: 300, pace: '5:00/km', type: 'work' },
            { duration: 120, pace: '7:00/km', type: 'rest' },
            { duration: 300, pace: '5:00/km', type: 'work' },
            { duration: 120, pace: '7:00/km', type: 'rest' },
            { duration: 300, pace: '5:00/km', type: 'work' },
            { duration: 120, pace: '7:00/km', type: 'rest' },
            { duration: 300, pace: '5:00/km', type: 'work' },
            { duration: 600, pace: '6:00/km', type: 'rest' },
          ],
        },
        {
          id: 'i10k-w2-d3',
          day: 'Saturday',
          type: 'Long Run',
          distance: 14,
          duration: 85,
          description: 'Long run at easy pace. Fuel at 45 min mark.',
        },
        {
          id: 'i10k-w2-d4',
          day: 'Sunday',
          type: 'Easy Run',
          distance: 5,
          duration: 35,
          description: 'Recovery run at very easy pace.',
        },
      ],
    },
  ],
};

export default function PlanDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { planId, planName } = route.params;

  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(0);

  useEffect(() => {
    fetchPlan();
  }, [planId]);

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const data = await getPlanDetail(planId);
      setPlan(data.plan);
      setLocked(false);
    } catch (error: any) {
      if (error.message?.includes('Payment required') || error.response?.status === 402) {
        setLocked(true);
        setPlan(MOCK_PLAN);
      } else {
        // Fallback to mock data for demo
        setPlan(MOCK_PLAN);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePayAndUnlock = () => {
    Alert.alert(
      '💳 x402 Payment',
      `Access the full "${planName}" plan for $0.001 USDC.\n\nIn production, this would:\n1. Connect to your Base wallet\n2. Sign a USDC micropayment\n3. Send X-PAYMENT header to server\n4. Unlock full plan instantly`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay $0.001 USDC',
          onPress: () => {
            setLocked(false);
            Alert.alert('✅ Payment Successful', 'Plan unlocked via x402 protocol!');
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!plan) return null;
  const currentWeek = plan.weeks[selectedWeek] || plan.weeks[0];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Plan Header */}
        <View style={styles.planHeader}>
          <View style={styles.levelRow}>
            <View style={[styles.levelBadge, { backgroundColor: plan.level === 'Beginner' ? colors.success : plan.level === 'Intermediate' ? colors.warning : colors.error }]}>
              <Text style={styles.levelText}>{plan.level}</Text>
            </View>
            <Text style={styles.duration}>{plan.duration}</Text>
          </View>
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planDescription}>{plan.description}</Text>

          <View style={styles.planStats}>
            <View style={styles.planStat}>
              <Text style={styles.planStatValue}>{plan.weeklyMileage}</Text>
              <Text style={styles.planStatLabel}>Weekly KM</Text>
            </View>
            <View style={styles.planStat}>
              <Text style={styles.planStatValue}>{plan.workoutsPerWeek}x</Text>
              <Text style={styles.planStatLabel}>Per Week</Text>
            </View>
            <View style={styles.planStat}>
              <Text style={styles.planStatValue}>{plan.weeks.length}</Text>
              <Text style={styles.planStatLabel}>Weeks</Text>
            </View>
          </View>
        </View>

        {/* Lock Banner */}
        {locked && (
          <TouchableOpacity style={styles.lockBanner} onPress={handlePayAndUnlock}>
            <Text style={styles.lockTitle}>🔒 Premium Plan</Text>
            <Text style={styles.lockSubtitle}>Pay $0.001 USDC via x402 to unlock full plan with all workouts</Text>
            <View style={styles.payBtn}>
              <Text style={styles.payBtnText}>💳 Pay $0.001 USDC & Unlock</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Week Selector */}
        <Text style={styles.sectionTitle}>Training Schedule</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weekSelector}>
          {plan.weeks.map((week, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.weekTab, selectedWeek === idx && styles.weekTabActive]}
              onPress={() => setSelectedWeek(idx)}
            >
              <Text style={[styles.weekTabText, selectedWeek === idx && styles.weekTabTextActive]}>
                Week {week.week}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Week Focus */}
        <View style={styles.weekFocus}>
          <Text style={styles.weekFocusLabel}>Focus</Text>
          <Text style={styles.weekFocusText}>{currentWeek.focus}</Text>
        </View>

        {/* Workouts */}
        {currentWeek.workouts.map((workout) => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            locked={locked && workout.type !== 'Rest'}
            onPress={() => {
              if (locked) {
                handlePayAndUnlock();
              } else {
                navigation.navigate('Workout', { workoutId: workout.id, workoutName: `${workout.day} - ${workout.type}` });
              }
            }}
          />
        ))}

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  scrollContent: { padding: spacing.md },
  planHeader: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  levelBadge: {
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  levelText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  duration: { fontSize: 13, color: colors.textSecondary },
  planName: { fontSize: 26, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  planDescription: { fontSize: 13, color: colors.textSecondary, lineHeight: 18, marginBottom: spacing.md },
  planStats: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  planStat: { flex: 1, alignItems: 'center' },
  planStatValue: { fontSize: 16, fontWeight: '700', color: colors.text },
  planStatLabel: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  lockBanner: {
    backgroundColor: colors.primary + '15',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  lockTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  lockSubtitle: { fontSize: 13, color: colors.textSecondary, lineHeight: 18, marginBottom: spacing.md },
  payBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    alignSelf: 'flex-start',
  },
  payBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  weekSelector: { marginBottom: spacing.sm },
  weekTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    backgroundColor: colors.surface,
    marginRight: spacing.xs,
  },
  weekTabActive: { backgroundColor: colors.primary },
  weekTabText: { fontSize: 13, color: colors.textSecondary },
  weekTabTextActive: { color: '#fff', fontWeight: '600' },
  weekFocus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  weekFocusLabel: { fontSize: 12, color: colors.textMuted },
  weekFocusText: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },
});
