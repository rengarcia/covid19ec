function stop(confirmed = 0, base = 0) {
  if (confirmed <= 10) {
    return base + 0;
  }
  if (confirmed > 10 && confirmed <= 50) {
    return base + 1;
  }
  if (confirmed > 50 && confirmed <= 200) {
    return base + 2;
  }
  if (confirmed > 200 && confirmed <= 700) {
    return base + 3;
  }
  if (confirmed > 700) {
    return base + 4;
  }
}

export default stop;
