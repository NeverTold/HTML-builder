const fs = require('fs'); 
const path = require('path'); 
const readline = require('readline'); 

const filePath = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

console.log('Lets test your writing skills! Please enter your text. Type "exit" to quit or press ctrl + c.');

const readlineInt = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askForInput = () => {
    readlineInt.question('> ', (input) => {
    if (input.trim().toLowerCase() === 'exit') {
      console.log('Noooo, why you leave me!?'); 
      readlineInt.close(); 
      process.exit(0); 
    } else {
      writeStream.write(`${input}\n`); 
      askForInput(); 
    }
  });
};

const farewellAndExit = () => {
    console.log('Noooo, why you leave me!?'); 
    readlineInt.close(); 
    writeStream.end(); 
    process.exit(0); 
  };

askForInput();

readlineInt.on('SIGINT', () => {
    farewellAndExit();
});