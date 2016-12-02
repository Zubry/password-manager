(function () {
  'use strict';

  describe('PRNG', function () {
    describe('Pseudo-random number generator', function() {
      it('should generate a random number of n bits', function(){
        assert(generateRandomBits(128).toString(16).length == 256);
        assert(generateRandomBits(64).toString(16).length == 128);
      })
    })
  });

  describe('PBKDF2', function () {
    describe('Password-based key derivation', function () {
      it('should generate matching passwords', function () {
        assert(generatePassword('s33krit', 'nacl').toString(16) === generatePassword('s33krit', 'nacl').toString(16));
      });
    });
  });
})();
