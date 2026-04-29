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

    // 1. Extract and remove the first header
    let title = '';
    const titleMatch = content.match(/^# (?:Project Overview: )?(.+)$/m);
    if (titleMatch) {
        title = titleMatch[1].trim();
        content = content.replace(/^# .+$/m, '').trim();
    }

    // 2. Remove Section 5 (Senior Retrospective) and everything after it
    const section5Index = content.indexOf('## 5. Senior Retrospective');
    if (section5Index !== -1) {
        content = content.substring(0, section5Index).trim();
    }

    // 3. Remove "Senior Architect Perspective"
    content = content.replace(/\*\*Senior Architect Perspective\*\*/i, '');
    
    // 4. Clean up any trailing horizontal rules or extra whitespace
    content = content.replace(/---\s*$/m, '').trim();

    // 5. Add frontmatter
    const frontmatter = `---\ntitle: "${title}"\n---\n\n`;
    content = frontmatter + content;

    fs.writeFileSync(filePath, content);
    console.log(`Cleaned up ${file} and added frontmatter`);
});
