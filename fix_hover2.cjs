const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
let changedFiles = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;
    
    // Step 1: Remove existing transition inside whileHover if it matches transition: { duration: X }
    content = content.replace(/whileHover=\{\{\s*transition:\s*\{\s*duration:\s*[\d.]+\s*\},?\s*/g, "whileHover={{ ");
    
    // Step 2: Inject the correct transition ensuring instantaneous hover with delay: 0
    content = content.replace(/whileHover=\{\{\s*(?!transition)/g, "whileHover={{ transition: { duration: 0.1, delay: 0 }, ");
    
    if (content !== originalContent) {
        fs.writeFileSync(file, content);
        changedFiles++;
        console.log("Fixed", file);
    }
});
console.log("Done. Changed files:", changedFiles);
