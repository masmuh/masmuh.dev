# Personal Portfolio Website

A professional portfolio website built using **Astro**. This project showcases projects, work experience, and technical details of various systems developed.

## 🚀 Directory Structure

Here is the folder structure in this project:

```text
/
├── src/
│   ├── assets/             # Image and media assets
│   ├── components/         # Reusable Astro UI components
│   ├── content/            # Markdown/MDX based content
│   │   ├── projects/       # Project data (Case Studies)
│   │   └── gallery/        # Gallery data
│   ├── layouts/            # Main page layout templates
│   ├── pages/              # Website routes/pages (index, portfolio, etc.)
│   │   └── projects/       # Dynamic pages for project details
│   └── styles/             # CSS/Styling files
├── public/                 # Unprocessed static assets (favicon, etc.)
├── update-metadata.cjs     # Utility script to update project metadata
├── cleanup-markdown.cjs    # Script to clean up markdown files
├── astro.config.mjs        # Main Astro configuration
└── package.json            # List of dependencies and NPM scripts
```

## 🛠️ Technologies Used

- **Framework:** [Astro](https://astro.build/)
- **Content Management:** Markdown & Astro Content Collections
- **Styling:** Vanilla CSS / Custom Styles
- **Runtime:** Node.js

## 💻 How to Run the Project

Ensure you have [Node.js](https://nodejs.org/) installed.

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:4321` in your browser.

3. **Build for Production:**
   ```bash
   npm run build
   ```

## 📝 Additional Notes

This project includes several custom scripts (`.cjs`) to help automate content maintenance:
- `update-metadata.cjs`: Used to synchronize metadata from project files.
- `cleanup-markdown.cjs`: Helps tidy up markdown file formatting in the content folder.

---
*Built with ❤️ using Astro.*
