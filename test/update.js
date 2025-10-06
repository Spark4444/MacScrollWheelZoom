import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();
const filePath = path.join(__dirname, '../MacScrollWheelZoom/js/cssStyles.js');
const cssStylesPath = path.join(__dirname, 'css/style.css');

const cssContent = fs.readFileSync(cssStylesPath, 'utf-8');

const updatedCssStyles = `const cssStyles = \`\n${cssContent}\`;`;

fs.writeFileSync(filePath, updatedCssStyles, 'utf-8');