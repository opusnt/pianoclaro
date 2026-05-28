export function getBlackKeyLeftPercent(previousWhiteIndex: number, whiteKeyCount: number) {
  if (previousWhiteIndex < 0 || whiteKeyCount <= 0) {
    return 0;
  }

  return ((previousWhiteIndex + 1) / whiteKeyCount) * 100;
}
