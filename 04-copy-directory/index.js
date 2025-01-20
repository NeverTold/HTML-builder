const fs = require('fs/promises'); 
const path = require('path'); 

async function copyDir() {
  const sourceDir = path.join(__dirname, 'files'); 
  const destDir = path.join(__dirname, 'files-copy'); 

  try {
    await fs.mkdir(destDir, { recursive: true });

    const items = await fs.readdir(sourceDir, { withFileTypes: true });
    const sourceFiles = new Set();

    for (const item of items) {
      const srcPath = path.join(sourceDir, item.name); 
      const destPath = path.join(destDir, item.name); 
      sourceFiles.add(item.name); 

      if (item.isDirectory()) {
        await copyDirRecursive(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
    const destItems = await fs.readdir(destDir);
    for (const item of destItems) {
        if (!sourceFiles.has(item)) {
          const destPath = path.join(destDir, item);
          await fs.rm(destPath, { recursive: true, force: true }); 
        }
      }
  } catch (error) {
    console.error('Error copying directory:', error);
  }
}

async function copyDirRecursive(srcDir, destDir) {
  await fs.mkdir(destDir, { recursive: true }); 

  const items = await fs.readdir(srcDir, { withFileTypes: true });

  for (const item of items) {
    const srcPath = path.join(srcDir, item.name);
    const destPath = path.join(destDir, item.name);

    if (item.isDirectory()) {
      await copyDirRecursive(srcPath, destPath); 
    } else {
      await fs.copyFile(srcPath, destPath); 
    }
  }
}

copyDir();