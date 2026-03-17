import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl, StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing } from '../theme';
import PlanCard from '../components/PlanCard';
import { TrainingPlanSummary, RootStackParamList } from '../types';
import { getPlans } from '../api/client';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const MOCK_PLANS: TrainingPlanSummary[] = [
  {
    id: 'beginner-5k',
    name: 'Couch to 5K',
    level: 'Beginner',
    duration: '8 weeks',
    description: 'Go from zero to running your first 5K. Perfect for complete beginners.',
    goal: 'Complete a 5K race',
    weeklyMileage: '10-20 km',
    workoutsPerWeek: 3,
    price: 1,
  },
  {
    id: 'intermediate-10k',
    name: '10K Personal Best',
    level: 'Intermediate',
    duration: '10 weeks',
    description: 'Break your 10K personal best with structured speed work and long runs.',
    goal: 'Sub-55 minute 10K',
    weeklyMileage: '30-45 km',
    workoutsPerWeek: 4,
    price: 1,
  },
  {
    id: 'advanced-marathon',
    name: 'Marathon Qualifier',
    level: 'Advanced',
    duration: '16 weeks',
    description: 'A demanding marathon training plan for experienced runners targeting a BQ time.',
    goal: 'Boston Qualifier',
    weeklyMileage: '60-90 km',
    workoutsPerWeek: 6,
    price: 1,
  },
];

export default function PlansScreen() {
  const navigation = useNavigation<Nav>();
  const [plans, setPlans] = useState<TrainingPlanSummary[]>(MOCK_PLANS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPlans = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const data = await getPlans();
      if (data && data.length > 0) setPlans(data);
    } catch {
      // Use mock data if server not available
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchPlans(true)} tintColor={colors.primary} />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Training Plans</Text>
          <Text style={styles.subtitle}>Premium plans powered by x402 micropayments</Text>
        </View>

        {/* x402 Info Banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoEmoji}>⚡</Text>
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Pay-per-use with x402</Text>
            <Text style={styles.infoBody}>Access any plan instantly with USDC micropayments on Base. No subscriptions.</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : (
          plans.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onPress={() => navigation.navigate('PlanDetail', { planId: plan.id, planName: plan.name })}
            />
          ))
        )}

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.md },
  header: { marginBottom: spacing.lg, paddingTop: spacing.md },
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: colors.primary + '15',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary + '30',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  infoEmoji: { fontSize: 24, marginTop: 2 },
  infoText: { flex: 1 },
  infoTitle: { fontSize: 14, fontWeight: '700', color: colors.primary, marginBottom: 4 },
  infoBody: { fontSize: 12, color: colors.textSecondary, lineHeight: 17 },
});
