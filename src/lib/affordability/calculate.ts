import { AFFORDABILITY_CONFIG } from "./config";

export type AffordabilityInputs = {
  annualIncome: number;
  monthlyDebts: number;
  downPayment: number;
  metro: string;
};

export type CostBreakdown = {
  mortgagePrincipalAndInterest: number;
  propertyTax: number;
  insurance: number;
  maintenanceReserve: number;
};

export type AffordabilityResult = {
  solo: {
    maxHomeValue: number;
    estimatedMonthlyPayment: number;
    breakdown: CostBreakdown;
  };
  coOwner: {
    maxHomeValue: number;
    estimatedMonthlyShare: number;
    groupSize: number;
    breakdown: CostBreakdown;
  };
  gap: number;
  feasible: boolean;
};

export function calculateAffordability(
  inputs: AffordabilityInputs
): AffordabilityResult {
  const { annualIncome, monthlyDebts, downPayment } = inputs;
  const cfg = AFFORDABILITY_CONFIG;

  const monthlyIncome = annualIncome / 12;
  const frontEndCap = monthlyIncome * cfg.frontEndRatio;
  const backEndCap = monthlyIncome * cfg.backEndRatio - monthlyDebts;
  const maxHousingPayment = Math.min(frontEndCap, backEndCap);

  if (maxHousingPayment <= 0 || annualIncome <= 0) {
    return {
      solo: {
        maxHomeValue: 0,
        estimatedMonthlyPayment: 0,
        breakdown: emptyBreakdown(),
      },
      coOwner: {
        maxHomeValue: 0,
        estimatedMonthlyShare: 0,
        groupSize: cfg.defaultCoOwnerGroupSize,
        breakdown: emptyBreakdown(),
      },
      gap: 0,
      feasible: false,
    };
  }

  const monthlyRate = cfg.mortgageRate / 12;
  const n = cfg.loanTermMonths;
  const monthlyOverheadRate =
    (cfg.propertyTaxRate + cfg.insuranceRate + cfg.maintenanceReserveRate) /
    12;
  const piFactor = monthlyRate / (1 - Math.pow(1 + monthlyRate, -n));

  // Solve: maxHousingPayment = (P - dp) * piFactor + P * monthlyOverheadRate
  const soloMaxHome =
    (maxHousingPayment + downPayment * piFactor) /
    (piFactor + monthlyOverheadRate);

  const mortgage = Math.max(0, soloMaxHome - downPayment);
  const soloPI = mortgage * piFactor;
  const soloTax = soloMaxHome * (cfg.propertyTaxRate / 12);
  const soloIns = soloMaxHome * (cfg.insuranceRate / 12);
  const soloMaint = soloMaxHome * (cfg.maintenanceReserveRate / 12);
  const soloMonthly = soloPI + soloTax + soloIns + soloMaint;

  const N = cfg.defaultCoOwnerGroupSize;
  const coOwnerFullPropertyPrice = soloMaxHome * N;
  // Co-owner monthly outlay is the same maxHousingPayment ceiling, split breakdown per-share basis:
  const coOwnerPI = soloPI;
  const coOwnerTax = soloTax;
  const coOwnerIns = soloIns;
  const coOwnerMaint = soloMaint;
  const coOwnerMonthly = coOwnerPI + coOwnerTax + coOwnerIns + coOwnerMaint;

  return {
    solo: {
      maxHomeValue: Math.round(soloMaxHome),
      estimatedMonthlyPayment: Math.round(soloMonthly),
      breakdown: {
        mortgagePrincipalAndInterest: Math.round(soloPI),
        propertyTax: Math.round(soloTax),
        insurance: Math.round(soloIns),
        maintenanceReserve: Math.round(soloMaint),
      },
    },
    coOwner: {
      maxHomeValue: Math.round(coOwnerFullPropertyPrice),
      estimatedMonthlyShare: Math.round(coOwnerMonthly),
      groupSize: N,
      breakdown: {
        mortgagePrincipalAndInterest: Math.round(coOwnerPI),
        propertyTax: Math.round(coOwnerTax),
        insurance: Math.round(coOwnerIns),
        maintenanceReserve: Math.round(coOwnerMaint),
      },
    },
    gap: Math.round(coOwnerFullPropertyPrice - soloMaxHome),
    feasible: true,
  };
}

function emptyBreakdown(): CostBreakdown {
  return {
    mortgagePrincipalAndInterest: 0,
    propertyTax: 0,
    insurance: 0,
    maintenanceReserve: 0,
  };
}

export function fmtUSD(n: number): string {
  return `$${Math.max(0, Math.round(n)).toLocaleString("en-US")}`;
}
