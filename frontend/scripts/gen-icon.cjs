const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '..', 'src', 'assets', 'devtools-icon.svg');
const pngPath = path.join(__dirname, '..', 'src', 'assets', 'devtools-icon.png');
const appIconFrontend = path.join(__dirname, '..', 'build', 'appicon.png'); // frontend/build
const appIconRoot = path.join(__dirname, '..', '..', 'build', 'appicon.png'); // repo root build/

const svg = fs.readFileSync(svgPath);
const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 512 },
  background: 'rgba(0,0,0,0)',
});
const pngData = resvg.render().asPng();
fs.writeFileSync(pngPath, pngData);
fs.mkdirSync(path.dirname(appIconFrontend), { recursive: true });
fs.copyFileSync(pngPath, appIconFrontend);
fs.mkdirSync(path.dirname(appIconRoot), { recursive: true });
fs.copyFileSync(pngPath, appIconRoot);
console.log('Generated PNG:', pngPath);
console.log('Copied to frontend/build:', appIconFrontend);
console.log('Copied to root build:', appIconRoot);
