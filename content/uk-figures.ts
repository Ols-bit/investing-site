// Verify every tax-year figure against GOV.UK each tax year before publishing.
export const lastChecked = "2026-10-16";

export const ukFigures = {
  taxYear: "2026 to 2027",
  isaAnnualAllowance: 20_000,
  lisaAnnualContributionLimit: 4_000,
  lisaBonusPercent: 25,
  lisaMaximumAnnualBonus: 1_000,
  lisaLastAgeToOpen: 40,
  lisaLastAgeToContribute: 50,
  pensionAnnualAllowance: 60_000,
  pensionReliefAtSourceBasicRatePercent: 20,
  pensionGrossLimitWithoutEarnings: 2_880,
  workplaceQualifyingEarningsLower: 6_240,
  workplaceQualifyingEarningsUpper: 50_270,
  workplaceEmployeeMinimumPercent: 5,
  workplaceEmployerMinimumPercent: 3,
  workplaceCombinedMinimumPercent: 8,
  capitalGainsAnnualExemptAmount: 3_000,
  dividendAllowance: 500,
  examples: {
    isaContribution: 12_500,
    lifetimeIsaContribution: 2_000,
    pensionNetContribution: 80,
    workplaceQualifyingPay: 1_000,
    taxableGainBeforeAllowance: 7_000,
    dividendsReceived: 1_200,
    platformBalance: 10_000,
    platformFeePercent: 0.25,
    investmentChargePercent: 0.1,
  },
} as const;

export function formatUKPounds(amount: number) {
  return amount.toLocaleString("en-GB", { maximumFractionDigits: 2 });
}

export const ukExamples = {
  isaRemainingAllowance: ukFigures.isaAnnualAllowance - ukFigures.examples.isaContribution,
  lifetimeIsaBonus: ukFigures.examples.lifetimeIsaContribution * ukFigures.lisaBonusPercent / 100,
  pensionTaxRelief: ukFigures.examples.pensionNetContribution * ukFigures.pensionReliefAtSourceBasicRatePercent / 100,
  workplaceEmployeeContribution: ukFigures.examples.workplaceQualifyingPay * ukFigures.workplaceEmployeeMinimumPercent / 100,
  workplaceEmployerContribution: ukFigures.examples.workplaceQualifyingPay * ukFigures.workplaceEmployerMinimumPercent / 100,
  gainAfterAnnualExemptAmount: ukFigures.examples.taxableGainBeforeAllowance - ukFigures.capitalGainsAnnualExemptAmount,
  dividendsAboveAllowance: ukFigures.examples.dividendsReceived - ukFigures.dividendAllowance,
  annualPlatformFee: ukFigures.examples.platformBalance * ukFigures.examples.platformFeePercent / 100,
  annualInvestmentCharge: ukFigures.examples.platformBalance * ukFigures.examples.investmentChargePercent / 100,
};
