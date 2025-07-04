const fs = require("fs");
const path = require("path");

const replacements = {
  "../Signup": "../features/Auth/Signup",
  "../Login": "../features/Auth/Login",
  "../contexts/AuthContext": "../auth/AuthContext",
  "../components/ClientSetupForm": "../features/ClientProfile/ClientSetupForm",
  "../components/ProtectedRoute": "../auth/ProtectedRoute"
};

const folder = path.join(__dirname, "..", "frontend", "src");

function scanDir(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith(".tsx")) {
      let content = fs.readFileSync(fullPath, "utf-8");
      let updated = false;

      for (const [oldPath, newPath] of Object.entries(replacements)) {
        if (content.includes(oldPath)) {
          content = content.replaceAll(oldPath, newPath);
          updated = true;
        }
      }

      if (updated) {
        fs.writeFileSync(fullPath, content, "utf-8");
        console.log(`✅ Modificat: ${fullPath}`);
      }
    }
  });
}

scanDir(folder);
