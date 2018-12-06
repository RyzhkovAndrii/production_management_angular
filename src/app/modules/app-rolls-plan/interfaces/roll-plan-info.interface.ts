interface RollPlanInfo {
    rollType: RollType;
    currentRollLeftover: RollLeftover;
    planBatches: RollPlanBatchResponse[];
    weeklyLeftoverWithoutPlans: RollLeftover;
    weeklyLeftoverTotal: RollLeftover;
    inTwoWeeksLeftoverWithoutPlans: RollLeftover;
    inTwoWeeksLeftoverTotal: RollLeftover;
}