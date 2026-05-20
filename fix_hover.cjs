const fs = require('fs');
const path = require('path');

let changedFiles = 0;

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace whileHover={{ ... }} to inject transition if not present
      // Matches whileHover={{ followed by any whitespace, and ensures 'transition:' doesn't come immediately after.
      // Wait, what if transition is lower down inside the object?
      // A better regex: find `whileHover={{` and the closing `}}`.
      // Actually, just replacing `whileHover={{` with `whileHover={{ transition: { duration: 0.1, delay: 0 },` 
      // is safe if we simply clean up existing `transition:` inside whileHover first, or we just rely on regex.
      // Let's use a simple Regex that matches `whileHover={{` and injects the transition if the next text is NOT `transition`.
      
      let newContent = content.replace(/whileHover=\{\{\s*(?!transition)/g, 'whileHover={{ transition: { duration: 0.1, delay: 0 }, ');

      // Some files might have `whileHover={{transition: ...` (no space). `\s*` handles 0 or more spaces.
      // What if it has `whileHover={ {`?
      newContent = newContent.replace(/whileHover=\{\s*\{\s*(?!transition)/g, 'whileHover={{ transition: { duration: 0.1, delay: 0 }, ');

      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        changedFiles++;
        console.log("Updated:", fullPath);
      }
    }
  }
}

processDir('src');
console.log("Done fixing AST delays. Changed:", changedFiles);
