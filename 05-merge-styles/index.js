const fs = require('fs/promises'); 
const path = require('path'); 

async function mergeStyles() {
  const stylesDir = path.join(__dirname, 'styles'); 
  const outputDir = path.join(__dirname, 'project-dist'); 
  const outputFile = path.join(outputDir, 'bundle.css'); 

  try {
    const files = await fs.readdir(stylesDir, { withFileTypes: true });
    const cssFiles = [];

    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        cssFiles.push(file.name); 
      }
    }

    const stylesContent = [];

    for (const cssFile of cssFiles) {
      const filePath = path.join(stylesDir, cssFile); 
      const content = await fs.readFile(filePath, 'utf-8'); 
      stylesContent.push(content); 
    }

    await fs.writeFile(outputFile, stylesContent.join('\n'), 'utf-8');

  } catch (error) {
    console.error('Error merging styles:', error);
  }
}

mergeStyles();