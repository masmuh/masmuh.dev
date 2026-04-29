const fs = require('fs');
const path = require('path');

const metadata = {
  anr: { client: "Bank Mandiri", date: "2024 - 2026" },
  biogen: { client: "Biogen", date: "2023 - 2024" },
  bsci: { client: "Boston Scientific", date: "2023" },
  cra: { client: "Enterprise CRM", date: "2022" },
  cxoreport: { client: "CXO Software", date: "2022" },
  ems: { client: "Kano Solution", date: "2021" },
  "isms-download-generator": { client: "ISMS Logistics", date: "2021" },
  "isms-easehub": { client: "ISMS Logistics", date: "2021" },
  "isms-echomail": { client: "ISMS Logistics", date: "2022" },
  "isms-hawkeye": { client: "ISMS Logistics", date: "2022" },
  "isms-nextgen": { client: "ISMS Logistics", date: "2023" },
  kanitax: { client: "Corporate Compliance", date: "2023" },
  logdis: { client: "Logdis", date: "2022" },
  weis: { client: "WEIS Engineering", date: "2021" },
};

const projectsDir = 'src/projects';
const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.md'));

files.forEach(file => {
    const slug = file.replace('.md', '');
    const data = metadata[slug] || { client: "Confidential", date: "TBD" };
    const filePath = path.join(projectsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Update frontmatter
    // If it already has frontmatter, we add the fields
    if (content.startsWith('---')) {
        content = content.replace(/---\s*title: "(.+)"\s*---/i, (match, title) => {
            return `---\ntitle: "${title}"\nclient: "${data.client}"\ndate: "${data.date}"\n---`;
        });
    }

    fs.writeFileSync(filePath, content);
    console.log(`Updated metadata for ${file}`);
});
