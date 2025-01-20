const fs = require('fs/promises');
const path = require('path');

async function createProjectDist() {
    const distPath = path.join(__dirname, 'project-dist');
    await fs.mkdir(distPath, { recursive: true });
    return distPath;
}

async function buildHtmlTemplate(distPath) {
    const templatePath = path.join(__dirname, 'template.html');
    const templateContent = await fs.readFile(templatePath, 'utf-8');

    const componentDir = path.join(__dirname, 'components');
    const componentFiles = await fs.readdir(componentDir);

    let resultContent = templateContent;

    for (const file of componentFiles) {
        if (path.extname(file) === '.html') {
            const componentName = path.basename(file, '.html');
            const componentPath = path.join(componentDir, file);
            const componentContent = await fs.readFile(componentPath, 'utf-8');
            const tag = `{{${componentName}}}`;
            resultContent = resultContent.replace(new RegExp(tag, 'g'), componentContent);
        }
    }

    const indexPath = path.join(distPath, 'index.html');
    await fs.writeFile(indexPath, resultContent);
}

async function compileStyles(distPath) {
    const stylesDir = path.join(__dirname, 'styles');
    const outputFilePath = path.join(distPath, 'style.css');

    const files = await fs.readdir(stylesDir);
    const cssFiles = files.filter(file => path.extname(file) === '.css');

    const stylesContent = [];

    for (const cssFile of cssFiles) {
        const filePath = path.join(stylesDir, cssFile);
        const content = await fs.readFile(filePath, 'utf-8');
        stylesContent.push(content);
    }

    await fs.writeFile(outputFilePath, stylesContent.join('\n'));
}


async function copyAssets(srcDir, destDir) {
    try{
       await fs.mkdir(destDir, { recursive: true });
        const assetsFiles = await fs.readdir(srcDir);

        for (const file of assetsFiles) {
            const srcFilePath = path.join(srcDir, file);
             const destFilePath = path.join(destDir, file);

            const stat = await fs.stat(srcFilePath);
                if (stat.isDirectory()) {
                  await copyAssets(srcFilePath, destFilePath); 
            } else {
                await fs.copyFile(srcFilePath, destFilePath);
            }
        }
     } catch(err) {
        console.error('Error during assets copy:', err);
    }
}



async function buildPage() {
    try {
        const distPath = await createProjectDist();
        await buildHtmlTemplate(distPath);
        await compileStyles(distPath);
         const assetsDir = path.join(__dirname, 'assets');
         const outputAssetsDir = path.join(distPath, 'assets');

        await copyAssets(assetsDir, outputAssetsDir);
        console.log('Site is compiled in project-dist folder!');
        process.exit(0);
    } catch (error) {
        console.error('Error building project:', error);
        process.exit(1);
    }
}

buildPage();