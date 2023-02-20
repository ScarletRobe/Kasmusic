export const getFormattedTime = (seconds: number) => {
  const hours = Math.floor(seconds / 60 / 60);
  const min = Math.floor(seconds / 60) - hours * 60;
  const sec = seconds % 60;
  console.log(hours);
  return `${hours ? hours + ':' : ''}${min < 10 ? '0' + min : min}:${
    sec < 10 ? '0' + sec : sec
  }`;
};
