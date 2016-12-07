'use strict';


const masterPassword = 'cryptology-with-nemo';

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function encrypt(text, key) {
	console.log(key);
	let aesCtr = new aesjs.ModeOfOperation.ctr(key.slice(0, 32));
	let encryptedBuffer = aesCtr.encrypt(aesjs.util.convertStringToBytes(text));

  return aesjs.util.convertBytesToString(encryptedBuffer);
}

function decrypt(text, key) {
	console.log(key);
	let aesCtr = new aesjs.ModeOfOperation.ctr(key.slice(0, 32), new aesjs.Counter(1));
	let decryptedBuffer = aesCtr.decrypt(aesjs.util.convertStringToBytes(text));

  return aesjs.util.convertBytesToString(decryptedBuffer);
}

function generateMasterKey() {
  chrome.storage.sync.get('master', (data) => {
    if (data && data.master) {
      return false;
    }

    const masterKey = generateRandomBits(256);
    const secondaryKey = generatePassword(masterPassword, 'Crypto?!');
		console.log('plaintextMasterkey', masterKey);
    const encryptedMasterKey = encrypt(masterKey, secondaryKey);
    chrome.storage.sync.set({ 'master': encryptedMasterKey });
  });
}

function storePassword([element, site]) {
  chrome.storage.sync.get([site, 'master'], (data) => {
    const secondaryKey = generatePassword(masterPassword, 'Crypto?!');
    const decryptedMasterKey = aesjs.util.convertStringToBytes(decrypt(data.master, secondaryKey.slice(0, 32)));

    if (data && data[site]) {
      insertPassword([element, site]);
    } else {
      const passwordSeed = generateRandomBits(128);
      const plaintextPassword = generatePassword(passwordSeed, site);
      const encryptedPassword = encrypt(plaintextPassword, decryptedMasterKey);

      const store = {};
      store[site] = encryptedPassword;
      chrome.storage.sync.set(store);
      insertPassword([element, site]);
    }
  });
}

function loadPassword(site, callback) {
  chrome.storage.sync.get([site, 'master'], (data) => {
		callback(data[site], data.master)
	});
  // chrome.storage.sync.get(site, (data) => callback(decrypt(data)));
}

// document.body.addEventListener('keyup', debounce((e) => {
//   if (e.target.type === 'password') {
//     storePassword(e.target, window.location.hostname);
//   }
// }, 1000));

function insertPassword([element, site]) {
  loadPassword(site, (password, masterKey) => {
    const secondaryKey = generatePassword(masterPassword, 'Crypto?!');
    const decryptedMasterKey = decrypt(masterKey, secondaryKey);
		console.log('insert', masterKey, secondaryKey, secondaryKey.length, decryptedMasterKey, decryptedMasterKey.length);

    if (!password) {
      return [element, site];
    }

    element.type = 'text';
    element.autocomplete = 'new-password';
    element.value = decrypt(password, aesjs.util.convertStringToBytes(decryptedMasterKey));
    element.type = 'password';
    console.log(password);
  });

  return [element, site];
}

generateMasterKey();
setTimeout(() => {
	[]
	  .slice
	  .apply(document.querySelectorAll('input[type=password]'))
	  .map((element) => [element, window.location.hostname])
	  .map(storePassword);
}, 500);
