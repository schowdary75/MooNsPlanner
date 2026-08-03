declare module 'deasync' {
  const deasync: { loopWhile(predicate: () => boolean): void };
  export default deasync;
}
