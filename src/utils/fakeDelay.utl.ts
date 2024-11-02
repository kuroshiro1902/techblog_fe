export const fakeDelay = (cb: () => any) => {
  if (process.env.NODE_ENV !== 'production') {
    setTimeout(cb, 1000);
  } else {
    cb();
  }
};
