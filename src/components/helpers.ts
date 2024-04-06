export function millisecondsToMinutesSeconds(milliseconds) {
  // Calculate number of minutes (discarding decimals)
  const minutes = Math.floor(milliseconds / (1000 * 60));

  // Calculate remaining seconds (use modulo to get remainder after seconds conversion)
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

  // Format output with leading zeros for minutes and seconds if needed
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}