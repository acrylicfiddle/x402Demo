import express from 'express';
import cors from 'cors';
import { paymentMiddleware, x402ResourceServer } from '@x402/express';
import { HTTPFacilitatorClient } from '@x402/core/server';
import { ExactEvmScheme } from '@x402/evm/exact/server';
import { trainingPlans, TrainingPlan, Workout } from './data.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4021;
const PAYTO_ADDRESS = (process.env.SELLER_PAYTO || '0x0000000000000000000000000000000000000000') as `0x${string}`;
if (!process.env.SELLER_PAYTO) {
  console.warn('⚠️  SELLER_PAYTO not set — payments will go to zero address. Set this env var for production.');
}
const FACILITATOR_URL = process.env.FACILITATOR_URL || 'https://x402.org/facilitator';
const NETWORK = (process.env.NETWORK_CAIP2 || 'eip155:84532') as `${string}:${string}`; // Base Sepolia

// Free endpoint: list all plans (summary only, no workout details)
app.get('/api/plans', (_req, res) => {
  const summaries = trainingPlans.map(({ id, name, level, duration, description, goal, weeklyMileage, workoutsPerWeek, price }) => ({
    id, name, level, duration, description, goal, weeklyMileage, workoutsPerWeek, price
  }));
  res.json({ plans: summaries });
});

// Set up x402 resource server with facilitator and EVM scheme
const facilitatorClient = new HTTPFacilitatorClient({ url: FACILITATOR_URL });
const resourceServer = new x402ResourceServer(facilitatorClient)
  .register(NETWORK, new ExactEvmScheme());

// Protected endpoints: full plan and workout details (require x402 payment)
app.use(
  paymentMiddleware(
    {
      'GET /api/plans/:id': {
        accepts: {
          scheme: 'exact',
          price: '$0.001',
          network: NETWORK,
          payTo: PAYTO_ADDRESS,
        },
        description: 'Access premium training plan details',
      },
      'GET /api/workouts/:id': {
        accepts: {
          scheme: 'exact',
          price: '$0.001',
          network: NETWORK,
          payTo: PAYTO_ADDRESS,
        },
        description: 'Access individual workout session',
      },
    },
    resourceServer,
  )
);

app.get('/api/plans/:id', (req, res) => {
  const plan = trainingPlans.find(p => p.id === req.params.id);
  if (!plan) {
    res.status(404).json({ error: 'Plan not found' });
    return;
  }
  res.json({ plan });
});

app.get('/api/workouts/:id', (req, res) => {
  let foundWorkout: Workout | undefined;
  let foundPlan: TrainingPlan | undefined;

  for (const plan of trainingPlans) {
    for (const week of plan.weeks) {
      const workout = week.workouts.find(w => w.id === req.params.id);
      if (workout) {
        foundWorkout = workout;
        foundPlan = plan;
        break;
      }
    }
    if (foundWorkout) break;
  }

  if (!foundWorkout || !foundPlan) {
    res.status(404).json({ error: 'Workout not found' });
    return;
  }

  res.json({ workout: foundWorkout, planId: foundPlan.id, planName: foundPlan.name });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🏃 Runna x402 Server running on port ${PORT}`);
  console.log(`📍 Pay-to address: ${PAYTO_ADDRESS}`);
  console.log(`🌐 Network: ${NETWORK}`);
});

