interface RollTypeModalData {
  rollType ? : RollType;
  standards ? : Standard[];
  operation(result: Promise < RollType > );
}
