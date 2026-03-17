export interface TrainingPlanSummary {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  description: string;
  goal: string;
  weeklyMileage: string;
  workoutsPerWeek: number;
  price: number;
}

export interface TrainingPlan extends TrainingPlanSummary {
  weeks: TrainingWeek[];
}

export interface TrainingWeek {
  week: number;
  focus: string;
  workouts: Workout[];
}

export interface Workout {
  id: string;
  day: string;
  type: 'Easy Run' | 'Tempo' | 'Long Run' | 'Intervals' | 'Rest' | 'Cross Training';
  distance?: number;
  duration: number;
  description: string;
  intervals?: Interval[];
}

export interface Interval {
  duration: number;
  pace: string;
  type: 'work' | 'rest';
}

export type RootStackParamList = {
  Main: undefined;
  PlanDetail: { planId: string; planName: string };
  Workout: { workoutId: string; workoutName: string };
};

export type MainTabParamList = {
  Home: undefined;
  Plans: undefined;
  Settings: undefined;
};
