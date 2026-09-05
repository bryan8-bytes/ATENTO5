const fs = require('fs');
const path = require('path');

const dist = path.join(process.cwd(), 'dist', 'assets');
const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const scripts = [];
const regex = /src="([^"]+)"/g;
let m;
while ((m = regex.exec(html)) !== null) scripts.push(m[1]);

const styles = [];
const regexStyle = /href="([^"]+\.css[^"]*)"/g;
while ((m = regexStyle.exec(html)) !== null) styles.push(m[1]);

console.log('=== HTML Entry ===');
console.log('Scripts:');
scripts.forEach(s => console.log('  ' + s));
console.log('Styles:');
styles.forEach(s => console.log('  ' + s));
console.log('');
console.log('=== Chunk sizes >10KB ===');
const files = fs.readdirSync(dist);
files.forEach(f => {
  const stat = fs.statSync(path.join(dist, f));
  if (stat.size > 10000) {
    console.log(f + ' => ' + (stat.size / 1024).toFixed(1) + ' KB');
  }
});
