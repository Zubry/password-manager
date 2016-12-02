function generateRandomBits(n) {
  let seed = Date.now() + performance.now();
  let out = '';

  for (let i = 0; i < n * 2; i++) {
    const r = (seed + Math.random() * 16) % 16 | 0;
    seed = Math.floor(seed / 16);
    out += (r & 0x3 | 0x8).toString(16);
  }

  return BigInteger.parse(out, 16);
}
