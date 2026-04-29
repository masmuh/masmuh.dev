const fs = require('fs');
const path = require('path');

const projectsDir = 'src/projects';

if (!fs.existsSync(projectsDir)) {
    console.error('Projects directory not found');
    process.exit(1);
}

const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.md'));

files.forEach(file => {
    const filePath = path.join(projectsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove Section 5 / Senior Retrospective and everything after it
    // Using a more robust regex that catches with or without numbers, and with or without parens
    const patterns = [
        /## \d+\. Senior Retrospective/i,
        /## Senior Retrospective/i,
        /\*\*Senior Architect Perspective\*\*/i
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

    // Also remove "Architectural Consultant" or "Document Status" signatures at the bottom
    content = content.replace(/\*\*Architectural Consultant\*\*/i, '');
    content = content.replace(/\*\*Document Status\*\*/i, '');
    content = content.replace(/Date: April 2026/i, '');

    // Final cleanup of horizontal rules and whitespace at the end
    content = content.replace(/---\s*$/m, '').trim();

    fs.writeFileSync(filePath, content);
    console.log(`Cleaned up ${file}`);
});
