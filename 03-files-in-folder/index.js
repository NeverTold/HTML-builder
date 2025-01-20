const fs = require('fs/promises'); 
const path = require('path'); 

async function displayFileInfo() {
  try {
    const secretFolderPath = path.join(__dirname, 'secret-folder');
    const files = await fs.readdir(secretFolderPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) { 
        const filePath = path.join(secretFolderPath, file.name); 
        const stats = await fs.stat(filePath); 
        const fileSize = (stats.size / 1024).toFixed(3); 
        const fileExtension = path.extname(file.name).slice(1); 
        const fileName = path.basename(file.name, path.extname(file.name)); 
        console.log(`${fileName} - ${fileExtension} - ${fileSize}kb`);
      }
    }
  } catch (error) {
    console.error('Error reading files:', error);
  }
}

displayFileInfo();