const pipe = (...fns) => (x) => fns.reduce(async (y, f) => f(await y), x);

export default pipe;
