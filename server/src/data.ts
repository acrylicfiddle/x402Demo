export interface TrainingPlan {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  description: string;
  goal: string;
  weeklyMileage: string;
  workoutsPerWeek: number;
  price: number;  // in USD cents (for x402)
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
  distance?: number;  // km
  duration: number;   // minutes
  description: string;
  intervals?: Interval[];
}

export interface Interval {
  duration: number;  // seconds
  pace: string;
  type: 'work' | 'rest';
}

export const trainingPlans: TrainingPlan[] = [
  {
    id: 'beginner-5k',
    name: 'Couch to 5K',
    level: 'Beginner',
    duration: '8 weeks',
    description: 'Go from zero to running your first 5K. Perfect for complete beginners.',
    goal: 'Complete a 5K race',
    weeklyMileage: '10-20 km',
    workoutsPerWeek: 3,
    price: 1,  // $0.001 USDC via x402
    weeks: [
      {
        week: 1,
        focus: 'Building the habit',
        workouts: [
          {
            id: 'b5k-w1-d1',
            day: 'Monday',
            type: 'Easy Run',
            distance: 2,
            duration: 20,
            description: 'Walk/run intervals: 1 min run, 2 min walk x 6'
          },
          {
            id: 'b5k-w1-d2',
            day: 'Wednesday',
            type: 'Easy Run',
            distance: 2,
            duration: 20,
            description: 'Walk/run intervals: 1 min run, 2 min walk x 6'
          },
          {
            id: 'b5k-w1-d3',
            day: 'Friday',
            type: 'Easy Run',
            distance: 2.5,
            duration: 25,
            description: 'Walk/run intervals: 90 sec run, 2 min walk x 6'
          }
        ]
      },
      {
        week: 2,
        focus: 'Extending run time',
        workouts: [
          {
            id: 'b5k-w2-d1',
            day: 'Monday',
            type: 'Easy Run',
            distance: 3,
            duration: 25,
            description: 'Walk/run: 2 min run, 1 min walk x 7'
          },
          {
            id: 'b5k-w2-d2',
            day: 'Wednesday',
            type: 'Easy Run',
            distance: 3,
            duration: 25,
            description: 'Walk/run: 2 min run, 1 min walk x 7'
          },
          {
            id: 'b5k-w2-d3',
            day: 'Friday',
            type: 'Easy Run',
            distance: 3.5,
            duration: 30,
            description: 'Walk/run: 3 min run, 1 min walk x 6'
          }
        ]
      }
    ]
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
            description: 'Easy conversational pace. Heart rate zone 2.'
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
              { duration: 600, pace: '6:30/km', type: 'rest' }
            ]
          },
          {
            id: 'i10k-w1-d3',
            day: 'Saturday',
            type: 'Long Run',
            distance: 12,
            duration: 70,
            description: 'Long slow run. Focus on time on feet, not speed.'
          },
          {
            id: 'i10k-w1-d4',
            day: 'Sunday',
            type: 'Cross Training',
            duration: 40,
            description: '40 min easy cycling or swimming for active recovery.'
          }
        ]
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
            description: 'Easy conversational pace.'
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
              { duration: 600, pace: '6:00/km', type: 'rest' }
            ]
          },
          {
            id: 'i10k-w2-d3',
            day: 'Saturday',
            type: 'Long Run',
            distance: 14,
            duration: 85,
            description: 'Long run at easy pace. Fuel at 45 min mark.'
          },
          {
            id: 'i10k-w2-d4',
            day: 'Sunday',
            type: 'Easy Run',
            distance: 5,
            duration: 35,
            description: 'Recovery run at very easy pace.'
          }
        ]
      }
    ]
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
    weeks: [
      {
        week: 1,
        focus: 'Aerobic base',
        workouts: [
          {
            id: 'am-w1-d1',
            day: 'Monday',
            type: 'Easy Run',
            distance: 10,
            duration: 55,
            description: 'Easy recovery run at zone 2 heart rate.'
          },
          {
            id: 'am-w1-d2',
            day: 'Tuesday',
            type: 'Tempo',
            distance: 14,
            duration: 75,
            description: '3km warm up, 8km marathon goal pace, 3km cool down',
            intervals: [
              { duration: 900, pace: '5:30/km', type: 'rest' },
              { duration: 2400, pace: '4:45/km', type: 'work' },
              { duration: 900, pace: '5:30/km', type: 'rest' }
            ]
          },
          {
            id: 'am-w1-d3',
            day: 'Wednesday',
            type: 'Easy Run',
            distance: 12,
            duration: 65,
            description: 'Easy run. Keep heart rate low.'
          },
          {
            id: 'am-w1-d4',
            day: 'Thursday',
            type: 'Intervals',
            distance: 15,
            duration: 80,
            description: '6 x 1mile at 10K pace with 90 sec jog recovery',
            intervals: [
              { duration: 600, pace: '5:00/km', type: 'rest' },
              { duration: 480, pace: '4:20/km', type: 'work' },
              { duration: 90, pace: '6:30/km', type: 'rest' },
              { duration: 480, pace: '4:20/km', type: 'work' },
              { duration: 90, pace: '6:30/km', type: 'rest' },
              { duration: 480, pace: '4:20/km', type: 'work' },
              { duration: 90, pace: '6:30/km', type: 'rest' },
              { duration: 480, pace: '4:20/km', type: 'work' },
              { duration: 90, pace: '6:30/km', type: 'rest' },
              { duration: 480, pace: '4:20/km', type: 'work' },
              { duration: 90, pace: '6:30/km', type: 'rest' },
              { duration: 480, pace: '4:20/km', type: 'work' },
              { duration: 600, pace: '5:00/km', type: 'rest' }
            ]
          },
          {
            id: 'am-w1-d5',
            day: 'Friday',
            type: 'Easy Run',
            distance: 10,
            duration: 55,
            description: 'Easy shakeout run.'
          },
          {
            id: 'am-w1-d6',
            day: 'Sunday',
            type: 'Long Run',
            distance: 28,
            duration: 150,
            description: '28km long run. Run first 20km easy, last 8km at marathon goal pace.'
          }
        ]
      }
    ]
  }
];
