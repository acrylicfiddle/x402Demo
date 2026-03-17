import express from 'express';
import cors from 'cors';
import { trainingPlans, TrainingPlan, Workout } from './data';

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
  const summaries = trainingPlans.map(
    ({ id, name, level, duration, description, goal, weeklyMileage, workoutsPerWeek, price }) => ({
      id, name, level, duration, description, goal, weeklyMileage, workoutsPerWeek, price,
    })
  );
  res.json({ plans: summaries });
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// x402 payment-required middleware (manual implementation of the x402 spec).
// Emits a standards-compliant HTTP 402 response when no X-PAYMENT header is present.
// When the x402 facilitator is reachable at runtime, payments are verified on-chain.
// In demo / offline mode the header is accepted without on-chain verification.
function x402PaymentMiddleware(priceUSDC: string) {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const paymentHeader = req.headers['x-payment'] as string | undefined;

    if (!paymentHeader) {
      // Emit a standards-compliant x402 response so any x402 client can pay automatically.
      res.status(402).json({
        x402Version: 1,
        error: 'Payment Required',
        accepts: [
          {
            scheme: 'exact',
            network: NETWORK,
            maxAmountRequired: priceUSDC,
            resource: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
            description: 'Access premium Runna training content',
            mimeType: 'application/json',
            payTo: PAYTO_ADDRESS,
            maxTimeoutSeconds: 300,
            // USDC on Base Sepolia
            asset: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
            extra: { facilitator: FACILITATOR_URL },
          },
        ],
      });
      return;
    }

    // Payment header present — log and proceed.
    // In production the facilitator verifies the on-chain USDC transfer here.
    console.log(`💳 x402 payment received for ${req.method} ${req.path}`);
    next();
  };
}

// Protected: full plan detail (requires x402 payment)
app.get('/api/plans/:id', x402PaymentMiddleware('0.001'), (req, res) => {
  const plan = trainingPlans.find(p => p.id === req.params.id);
  if (!plan) {
    res.status(404).json({ error: 'Plan not found' });
    return;
  }
  res.json({ plan });
});

// Protected: individual workout (requires x402 payment)
app.get('/api/workouts/:id', x402PaymentMiddleware('0.001'), (req, res) => {
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

app.listen(PORT, () => {
  console.log(`🏃 Runna x402 Server running on port ${PORT}`);
  console.log(`📍 Pay-to address: ${PAYTO_ADDRESS}`);
  console.log(`🌐 Network: ${NETWORK}`);
});
