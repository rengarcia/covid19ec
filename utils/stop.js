function stop(confirmed = 0, base = 0) {
  if (confirmed > 0 && confirmed <= 10) {
    return base + 1;
  }
  if (confirmed > 10 && confirmed <= 50) {
    return base + 2;
  }
  if (confirmed > 50 && confirmed <= 125) {
    return base + 3;
  }
  if (confirmed > 125 && confirmed <= 500) {
    return base + 4;
  }
  if (confirmed > 500) {
    return base + 5;
  }
  return base + 0;
}

export default stop;
