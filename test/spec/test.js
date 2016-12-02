(function () {
  'use strict';

  describe('PBKDF2', function () {
    describe('Password-based key derivation', function () {
      it('should generate matching passwords', function () {
        assert(generatePassword('s33krit', 'nacl') === generatePassword('s33krit', 'nacl'));
      });
    });
  });
})();
