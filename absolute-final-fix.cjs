const fs = require('fs');
const path = require('path');

const projectsDir = 'src/projects';
const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.md'));

files.forEach(file => {
    const filePath = path.join(projectsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Remove any existing frontmatter dashes to start fresh
    content = content.replace(/^---\s*[\s\S]*?---\s*/, '');

    // 2. Extract title if possible, otherwise use a default
    // (Previous scripts might have already put title at the top)
    let title = '';
    const titleMatch = content.match(/title:\s*"(.+)"/i);
    if (titleMatch) {
        title = titleMatch[1];
        content = content.replace(/title:\s*".+"/i, '');
    }

    // 3. Remove "Senior Retrospective" sections (even without ##)
    const patterns = [
        /## \d+\. Senior Retrospective/i,
        /## Senior Retrospective/i,
        /Senior Retrospective/i
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

    // 4. Clean up signatures and other unwanted strings
    content = content.replace(/\*\*Architectural Consultant\*\*/i, '');
    content = content.replace(/\*\*Document Status\*\*/i, '');
    content = content.replace(/Date: April 2026/i, '');
    content = content.replace(/\*\*Senior Architect Perspective\*\*/i, '');
    content = content.replace(/# Project Overview:/i, ''); // Remove if left over
    content = content.replace(/# Case Study:/i, ''); // Remove if left over

    content = content.trim();

    // 5. Build final content with proper frontmatter
    const finalContent = `---\ntitle: "${title}"\n---\n\n${content}\n`;

    fs.writeFileSync(filePath, finalContent);
    console.log(`Final fix for ${file}`);
});
