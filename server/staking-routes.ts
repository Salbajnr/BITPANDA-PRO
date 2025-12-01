
import { Router } from "express";
import { requireAuth } from "./simple-auth";
import { storage } from "./storage";
import { supabaseDB } from "./supabase-db-service";
import { z } from "zod";

const router = Router();

const createStakeSchema = z.object({
  assetSymbol: z.string().min(1).max(10),
  amount: z.number().min(0.001),
  stakingTerm: z.enum(['flexible', '30d', '60d', '90d', '180d', '365d']),
  autoReinvest: z.boolean().default(false)
});

router.get('/pools', requireAuth, async (req, res) => {
  try {
    let pools = await supabaseDB.getActiveStakingPools();

    if (!pools || pools.length === 0) {
      const defaultPools = [
        {
          symbol: 'BTC',
          name: 'Bitcoin',
          apy: 4.5,
          min_amount: 0.001,
          max_amount: 100,
          terms: ['flexible', '30d', '60d', '90d'],
          description: 'Stake Bitcoin and earn rewards'
        },
        {
          symbol: 'ETH',
          name: 'Ethereum',
          apy: 5.2,
          min_amount: 0.01,
          max_amount: 1000,
          terms: ['flexible', '30d', '60d', '90d', '180d'],
          description: 'Ethereum 2.0 staking rewards'
        },
        {
          symbol: 'ADA',
          name: 'Cardano',
          apy: 4.8,
          min_amount: 10,
          max_amount: 100000,
          terms: ['flexible', '60d', '90d', '180d', '365d'],
          description: 'Cardano delegation rewards'
        },
        {
          symbol: 'DOT',
          name: 'Polkadot',
          apy: 12.5,
          min_amount: 1,
          max_amount: 10000,
          terms: ['flexible', '90d', '180d', '365d'],
          description: 'Polkadot nomination rewards'
        },
        {
          symbol: 'USDC',
          name: 'USD Coin',
          apy: 8.0,
          min_amount: 1,
          max_amount: 1000000,
          terms: ['flexible', '30d', '60d', '90d', '180d', '365d'],
          description: 'Stable coin staking with high yields'
        }
      ];

      for (const pool of defaultPools) {
        try {
          await supabaseDB.createStakingPool(pool);
        } catch (error) {
          console.warn(`Failed to create staking pool ${pool.symbol}:`, error);
        }
      }

      pools = await supabaseDB.getActiveStakingPools();
    }

    res.json(pools);
  } catch (error) {
    console.error('Error fetching staking pools:', error);
    res.status(500).json({ message: 'Failed to fetch staking pools' });
  }
});

router.get('/positions', requireAuth, async (req, res) => {
  try {
    const stakes = await supabaseDB.getUserStakingPositions(req.user!.id);
    res.json(stakes);
  } catch (error) {
    console.error('Error fetching staking positions:', error);
    res.status(500).json({ message: 'Failed to fetch staking positions' });
  }
});

router.post('/stake', requireAuth, async (req, res) => {
  try {
    const stakeData = createStakeSchema.parse(req.body);

    const pools = await supabaseDB.getActiveStakingPools();
    const pool = pools.find(p => p.symbol === stakeData.assetSymbol);
    if (!pool) {
      return res.status(400).json({ message: 'Invalid staking asset' });
    }

    if (stakeData.amount < pool.min_amount || stakeData.amount > pool.max_amount) {
      return res.status(400).json({
        message: `Amount must be between ${pool.min_amount} and ${pool.max_amount} ${pool.symbol}`
      });
    }

    if (!pool.terms.includes(stakeData.stakingTerm)) {
      return res.status(400).json({ message: 'Invalid staking term for this asset' });
    }

    const portfolio = await storage.getPortfolio(req.user!.id);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    const holding = await storage.getHolding(portfolio.id, stakeData.assetSymbol);
    if (!holding || parseFloat(holding.amount) < stakeData.amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const stake = await supabaseDB.createUserStakingPosition({
      user_id: req.user!.id,
      asset_symbol: stakeData.assetSymbol,
      amount: stakeData.amount,
      apy: pool.apy,
      staking_term: stakeData.stakingTerm,
      start_date: new Date().toISOString()
    });

    await storage.updateHolding(holding.id, {
      amount: (parseFloat(holding.amount) - stakeData.amount).toString()
    });

    res.json(stake);
  } catch (error) {
    console.error('Error creating stake:', error);
    const { formatErrorForResponse } = await import('./lib/errorUtils');
    const formatted = formatErrorForResponse(error);
    if (Array.isArray(formatted)) {
      return res.status(400).json({ message: 'Invalid input data', errors: formatted });
    }
    res.status(500).json({ message: 'Failed to create stake' });
  }
});

router.post('/unstake/:positionId', requireAuth, async (req, res) => {
  try {
    const position = await storage.getStakingPosition(req.params.positionId, req.user!.id);
    if (!position) {
      return res.status(404).json({ message: 'Staking position not found' });
    }

    if (position.status !== 'active') {
      return res.status(400).json({ message: 'Position is not active' });
    }

    const rewards = calculateStakingRewards(position);

    await supabaseDB.updateStakingPosition(req.params.positionId, {
      status: 'completed',
      end_date: new Date().toISOString(),
      total_rewards: rewards
    });

    const portfolio = await storage.getPortfolio(req.user!.id);
    if (portfolio) {
      const holding = await storage.getHolding(portfolio.id, position.asset_symbol);
      if (holding) {
        const newAmount = parseFloat(holding.amount) + parseFloat(position.amount) + rewards;
        await storage.updateHolding(holding.id, {
          amount: newAmount.toString()
        });
      }
    }

    res.json({
      message: 'Successfully unstaked',
      originalAmount: position.amount,
      rewards: rewards,
      totalReturned: parseFloat(position.amount) + rewards
    });
  } catch (error) {
    console.error('Error unstaking:', error);
    res.status(500).json({ message: 'Failed to unstake position' });
  }
});

router.get('/rewards', requireAuth, async (req, res) => {
  try {
    const rewards = await storage.getStakingRewards(req.user!.id);
    res.json(rewards);
  } catch (error) {
    console.error('Error fetching staking rewards:', error);
    res.status(500).json({ message: 'Failed to fetch rewards' });
  }
});

router.get('/analytics', requireAuth, async (req, res) => {
  try {
    const analytics = await storage.getStakingAnalytics(req.user!.id);
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching staking analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

function calculateEndDate(term: string): Date {
  const now = new Date();
  const endDate = new Date(now);

  switch (term) {
    case 'flexible':
      return endDate;
    case '30d':
      endDate.setDate(now.getDate() + 30);
      break;
    case '60d':
      endDate.setDate(now.getDate() + 60);
      break;
    case '90d':
      endDate.setDate(now.getDate() + 90);
      break;
    case '180d':
      endDate.setDate(now.getDate() + 180);
      break;
    case '365d':
      endDate.setDate(now.getDate() + 365);
      break;
  }

  return endDate;
}

function calculateStakingRewards(position: any): number {
  const startDate = new Date(position.start_date);
  const now = new Date();
  const daysStaked = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const annualRate = position.apy / 100;
  const dailyRate = annualRate / 365;

  const rewards = parseFloat(position.amount) * dailyRate * daysStaked;
  return Math.max(0, rewards);
}

export default router;
