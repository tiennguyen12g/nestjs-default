const fs = require('fs');
const path = require('path');
/**
 * 
 * @Using
 * Change the name-module to your desired module
 * TODO: 
 * + 1. Open terminal in this folder
 * + 2. node createModuleDefaultFiles.js <name-module>
 */
const createFiles = (prefix) => {
  // Set the base directory where the new folders will be created
  const baseDir = path.join(__dirname, "..");
  console.log('baseDir', baseDir);
  
  // Set the output directory to be within the base directory
  const outputDir = path.join(baseDir, prefix);
  console.log('outputDir', outputDir);

  const files = [
    `${prefix}.module.ts`,
    `${prefix}.service.ts`,
    `${prefix}.controller.ts`,
    `${prefix}.model.ts`,
    `${prefix}.interface.ts`,
  ];

  const contents = [
    "Module Content",
    "Service Content",
    "Controller Content",
    "Model Content",
    "Interface Content",
  ];

  // Ensure the directory exists
  if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
  }

  files.forEach((file, i) => {
    const filePath = path.join(outputDir, file);
    const content = contents[i];
    fs.writeFileSync(filePath, content);
    console.log(`Created ${filePath}`);
  });
};

const prefix = process.argv[2];
if (!prefix) {
  console.log('Usage: node createFiles.js <prefix>');
  process.exit(1);
}

createFiles(prefix);
