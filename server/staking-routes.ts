
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from './simple-auth';
import { storage } from './storage';

const router = Router();

const stakeSchema = z.object({
  symbol: z.string(),
  amount: z.string(),
  stakingPeriod: z.enum(['30', '60', '90', '180', '365']),
  apy: z.string()
});

// Start staking
router.post('/stake', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const stakeData = stakeSchema.parse(req.body);
    
    const portfolio = await storage.getPortfolio(userId);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    // Check if user has sufficient holdings
    const holding = await storage.getHolding(portfolio.id, stakeData.symbol);
    if (!holding || parseFloat(holding.amount) < parseFloat(stakeData.amount)) {
      return res.status(400).json({ message: "Insufficient holdings to stake" });
    }

    // Create staking record
    const stakingRecord = await storage.createStakingRecord({
      userId,
      portfolioId: portfolio.id,
      symbol: stakeData.symbol,
      amount: stakeData.amount,
      stakingPeriod: parseInt(stakeData.stakingPeriod),
      apy: parseFloat(stakeData.apy),
      startDate: new Date(),
      endDate: new Date(Date.now() + parseInt(stakeData.stakingPeriod) * 24 * 60 * 60 * 1000),
      status: 'active'
    });

    // Update holding to reflect staked amount
    const newAmount = parseFloat(holding.amount) - parseFloat(stakeData.amount);
    if (newAmount > 0) {
      await storage.upsertHolding({
        portfolioId: portfolio.id,
        symbol: stakeData.symbol,
        name: holding.name,
        amount: newAmount.toString(),
        averagePurchasePrice: holding.averagePurchasePrice,
        currentPrice: holding.currentPrice,
      });
    } else {
      await storage.deleteHolding(holding.id);
    }

    res.json(stakingRecord);
  } catch (error) {
    console.error("Staking error:", error);
    res.status(500).json({ message: "Failed to stake cryptocurrency" });
  }
});

// Get user's staking records
router.get('/stakes', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const stakes = await storage.getUserStakingRecords(userId);
    
    // Calculate current rewards for each stake
    const stakesWithRewards = stakes.map(stake => {
      const now = new Date();
      const startDate = new Date(stake.startDate);
      const daysStaked = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const dailyReward = (parseFloat(stake.amount) * stake.apy / 100) / 365;
      const currentRewards = dailyReward * daysStaked;
      
      return {
        ...stake,
        currentRewards: currentRewards.toFixed(6),
        daysStaked
      };
    });

    res.json(stakesWithRewards);
  } catch (error) {
    console.error("Get stakes error:", error);
    res.status(500).json({ message: "Failed to fetch staking records" });
  }
});

// Unstake cryptocurrency
router.post('/unstake/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const stakeId = req.params.id;
    
    const stake = await storage.getStakingRecord(stakeId);
    if (!stake || stake.userId !== userId) {
      return res.status(404).json({ message: "Staking record not found" });
    }

    if (stake.status !== 'active') {
      return res.status(400).json({ message: "Staking record is not active" });
    }

    // Calculate rewards
    const now = new Date();
    const startDate = new Date(stake.startDate);
    const daysStaked = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const dailyReward = (parseFloat(stake.amount) * stake.apy / 100) / 365;
    const totalRewards = dailyReward * daysStaked;

    // Check if unstaking before maturity (apply penalty if needed)
    const endDate = new Date(stake.endDate);
    const isEarlyUnstake = now < endDate;
    const finalRewards = isEarlyUnstake ? totalRewards * 0.5 : totalRewards; // 50% penalty for early unstake

    // Return staked amount + rewards to user's portfolio
    const portfolio = await storage.getPortfolio(userId);
    if (portfolio) {
      const totalReturn = parseFloat(stake.amount) + finalRewards;
      
      // Update or create holding
      const existingHolding = await storage.getHolding(portfolio.id, stake.symbol);
      if (existingHolding) {
        const newAmount = parseFloat(existingHolding.amount) + totalReturn;
        await storage.upsertHolding({
          portfolioId: portfolio.id,
          symbol: stake.symbol,
          name: existingHolding.name,
          amount: newAmount.toString(),
          averagePurchasePrice: existingHolding.averagePurchasePrice,
          currentPrice: existingHolding.currentPrice,
        });
      } else {
        await storage.upsertHolding({
          portfolioId: portfolio.id,
          symbol: stake.symbol,
          name: stake.symbol,
          amount: totalReturn.toString(),
          averagePurchasePrice: '0',
          currentPrice: '0',
        });
      }
    }

    // Update staking record
    await storage.updateStakingRecord(stakeId, {
      status: 'completed',
      actualEndDate: now,
      finalRewards: finalRewards,
      isEarlyUnstake
    });

    res.json({ 
      message: "Successfully unstaked",
      rewards: finalRewards,
      penalty: isEarlyUnstake,
      totalReturn: parseFloat(stake.amount) + finalRewards
    });
  } catch (error) {
    console.error("Unstaking error:", error);
    res.status(500).json({ message: "Failed to unstake cryptocurrency" });
  }
});

// Get staking rewards summary
router.get('/rewards/summary', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const stakes = await storage.getUserStakingRecords(userId);
    
    let totalStaked = 0;
    let totalRewards = 0;
    let activeStakes = 0;
    
    stakes.forEach(stake => {
      if (stake.status === 'active') {
        activeStakes++;
        totalStaked += parseFloat(stake.amount);
        
        const now = new Date();
        const startDate = new Date(stake.startDate);
        const daysStaked = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const dailyReward = (parseFloat(stake.amount) * stake.apy / 100) / 365;
        totalRewards += dailyReward * daysStaked;
      }
    });

    res.json({
      totalStaked,
      totalRewards,
      activeStakes,
      completedStakes: stakes.filter(s => s.status === 'completed').length
    });
  } catch (error) {
    console.error("Rewards summary error:", error);
    res.status(500).json({ message: "Failed to fetch rewards summary" });
  }
});

export default router;
