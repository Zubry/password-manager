// PRF is a pseudorandom function of two parameters with output length hLen (e.g. a keyed HMAC)
// Password is the master password from which a derived key is generated
// Salt is a sequence of bits, known as a cryptographic salt
// c is the number of iterations desired
// dkLen is the desired length of the derived key
// DK is the generated derived key
// https://en.wikipedia.org/wiki/PBKDF2

// Side note: We include sha-256 as a dependency. We did not write it because it is a hash function and outside the scope of this course

function generatePassword(master, salt) {
  return aesjs.util.convertStringToBytes(PBKDF2(sha256, master, salt, 10000, 8).slice(32, 64));
}

function hexToString(hex) {
  let buffer = '';
  for (let i = 0; i < hex.length; i += 2) {
    buffer += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16));
  }
  return buffer;
}

function toUint(n) {
  return n >>> 0;
}

function xor(a, b) {
  let c = '';

  for(let i = 0; i < a.length; i++) {
      c += String.fromCharCode(a[i].charCodeAt(0).toString(10) ^ b[i].charCodeAt(0).toString(10)); // XORing with letter 'K'
  }

  return c;
}

function toBigInteger(str) {
  let out = '';

  for (let i = 0; i < str.length; i++) {
    out += str.charCodeAt(i).toString(16);
  }

  return out;
}

function PBKDF2(prf, password, salt, c, dkLen) {
  const hashLength = prf('').length;
  const blockLength = Math.ceil(dkLen / hashLength);

  let output = '';
  let last = '';
  let xorsum = 0;

  for (let i = 1; i <= blockLength; i++) {
    last = salt + toUint(i);
    xorsum = prf(last);
    last = xorsum;

    for (let j = 1; j < c; j++) {
      last = prf(last);
      xorsum = xor(xorsum, last);
    }

    output += xorsum;
  }

  return output;
  // return toBigInteger(output);
}
