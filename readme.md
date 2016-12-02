# Password manager

After you clone the git repo and cd into the password-manager directory:

    npm install --global yo gulp-cli bower
    bower update
    gulp babel
    gulp build

Then go to chrome://extensions and load unpacked extension, then select the app folder

## Updating

Create a new file under app/scripts.babel for each algorithm you implement. We'll combine them eventually, but this will help us keep things organized for the time being. Make sure you create tests for your algorithm. Add them to tests/spec/test.js. View them at test/index.html.

## Todo list

* Generate a random 256-bit key (https://en.wikipedia.org/wiki/Pseudorandom_number_generator)
* ~~Take the master password and run it through PBKDF2 along with a 64-bit salt and get a 128-bit key. This is your secondary encryption key.~~
* Use the secondary encryption key to encrypt the master encryption key using AES in the EAX mode and store it somewhere.
For the database, use any format you want. As I'm not sure which one to choose, I'll say XML. Encrypt the database using the master encryption key.
* When the user wants to access database you load the encrypted file in the memory, take the master password and run it through PBKDF2 with salt and get the secondary key, use the secondary key to decrypt the master key, and finally use the master key to decrypt the database.
* After the user finishes accessing; adding; modifying; or deleting entries from the database, you simply encrypt it again and discard everything from the memory.
* When the user wants to change the password, you decrypt derive the secondary key from the old password, decrypt the master key, derive a new secondary key from the new password, use that key to encrypt the master key. By doing this, you don't have to decrypt and re-encrypt the database when the password is changed as the master key is kept the same.
