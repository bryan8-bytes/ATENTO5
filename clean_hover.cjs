const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Clean up multiple occurrences of transition: { duration: 0.1, delay: 0 }, 
      // where it was inserted multiple times consecutively.
      let newContent = content;
      
      // First, let's normalize multiple spaces
      newContent = newContent.replace(/transition:\s*\{\s*duration:\s*0\.1,\s*delay:\s*0\s*\},\s*transition:\s*\{\s*duration:\s*0\.1,\s*delay:\s*0\s*\}/g, 'transition: { duration: 0.1, delay: 0 }');
      newContent = newContent.replace(/transition:\s*\{\s*duration:\s*0\.1,\s*delay:\s*0\s*\},\s*transition:\s*\{/g, 'transition: {');
      newContent = newContent.replace(/transition:\s*\{\s*duration:\s*0\.1,\s*delay:\s*0\s*\}\s*,\s*transition:\s*\{/g, 'transition: {');
      
      // Keep replacing until it stabilizes, just in case there are 3+ duplicates
      let prevContent;
      do {
        prevContent = newContent;
        newContent = newContent.replace(/transition:\s*\{\s*duration:\s*0\.1,\s*delay:\s*0\s*\}\s*,\s*transition:\s*/g, 'transition: ');
      } while (newContent !== prevContent);

      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log("Cleaned up duplicate transitions in:", fullPath);
      }
    }
  }
}

processDir('src');
