/* ══ EFFECTS SYSTEM ══ */

const EFFECT_SYSTEM = {
  healthBoost: {
    apply: (level) => {
      const amounts = { I: 25, II: 50, III: 100 };
      return {
        boost: amounts[level] || 25,
        maxHp: 100 + (amounts[level] || 25),
        duration: { I: 20000, II: 25000, III: 30000 }[level] || 20000
      };
    },
    damage: (current, boost, amount) => {
      if (amount <= boost) {
        return { boost: boost - amount, hp: current, isKilled: false };
      } else {
        let remaining = amount - boost;
        return { boost: 0, hp: current - remaining, isKilled: current - remaining <= 0 };
      }
    }
  },
  
  infected: {
    apply: (level) => {
      const levels = { I: { vfx: 0.3, effect: "light" }, II: { vfx: 0.5, effect: "medium" }, III: { vfx: 0.8, effect: "heavy" } };
      return levels[level] || levels.I;
    },
    vfx: (level) => {
      // تقطع في الشاشة
      if (level === "I") return "10% screen glitch";
      if (level === "II") return "30% screen glitch + weak vision";
      if (level === "III") return "70% screen glitch + messages + no vision";
    }
  },
  
  weakness: {
    apply: (level) => {
      const multipliers = { I: 0.8, II: 0.6, III: 0.4 };
      return { damageMultiplier: multipliers[level] || 0.8 };
    }
  },
  
  blind: {
    apply: (level) => {
      const visions = { I: 3, II: 1, III: 0 };
      return { vision: visions[level] || 3 };
    }
  },
  
  bleeding: {
    apply: (level) => {
      const dps = { I: 2, II: 4, III: 7 };
      return { dps: dps[level] || 2, duration: 10000 };
    }
  },
  
  burning: {
    apply: (level) => {
      const dps = { I: 3, II: 5, III: 8 };
      return { dps: dps[level] || 3, duration: 7000 };
    }
  },
  
  stun: {
    apply: (duration) => {
      return { duration, canMove: false, canAttack: false };
    }
  },
  
  corruption: {
    apply: (level) => {
      const dps = { I: 2, II: 5, III: 9 };
      return { dps: dps[level] || 2, vfx: "purple overlay", duration: 8000 };
    }
  }
};

function applyGameEffect(effectName, level = "I") {
  const effect = EFFECT_SYSTEM[effectName];
  if (!effect) {
    console.warn(`Effect ${effectName} not found`);
    return null;
  }
  return effect.apply(level);
}

function handleHealthDamage(currentHp, boostHp, boostMax, damage) {
  const result = EFFECT_SYSTEM.healthBoost.damage(currentHp, boostHp, damage);
  return {
    newHp: result.hp,
    newBoost: result.boost,
    boostExhausted: result.boost === 0 && boostHp > 0,
    playerDead: result.isKilled
  };
}
