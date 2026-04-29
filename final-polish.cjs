const fs = require('fs');
const path = require('path');

const projectsDir = 'src/projects';
const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.md'));

files.forEach(file => {
    const filePath = path.join(projectsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Fix titles and frontmatter
    // Match any title property in frontmatter or at the start
    content = content.replace(/title:\s*"(?:Case Study:\s*|Project Overview:\s*)?(.+)"/i, 'title: "$1"');
    
    // Ensure it has opening and closing dashes
    if (!content.trim().startsWith('---')) {
        content = '---\n' + content;
    }
    
    // 2. Double check for any missed "Senior Retrospective" sections
    const patterns = [
        /## \d+\. Senior Retrospective/i,
        /## Senior Retrospective/i,
        /## 5\./i // Some might just be ## 5.
    ];

    let foundIndex = -1;
    for (const pattern of patterns) {
        const match = content.match(pattern);
        if (match) {
            foundIndex = match.index;
            break;
        }
    }

    if (foundIndex !== -1) {
        content = content.substring(0, foundIndex).trim();
    }

    // 3. Clean up signatures and trailing rules
    content = content.replace(/\*\*Architectural Consultant\*\*/i, '');
    content = content.replace(/\*\*Document Status\*\*/i, '');
    content = content.replace(/Date: April 2026/i, '');
    content = content.replace(/\*\*Senior Architect Perspective\*\*/i, '');

    content = content.replace(/---\s*$/m, '').trim();
    if (!content.endsWith('---')) {
        // We don't necessarily want a horizontal rule at the very end unless it's part of the design
        // But let's make it consistent.
    }

    fs.writeFileSync(filePath, content);
    console.log(`Final polish for ${file}`);
});
