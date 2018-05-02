interface RollInfo {
    rollType: RollType,
    rollBatches: RollBatch[],
    restRollLeftover: RollLeftover,
    totalRollLeftover: RollLeftover 
    rollCheck: RollCheck;
}