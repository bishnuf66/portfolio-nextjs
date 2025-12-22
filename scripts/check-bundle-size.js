const fs = require("fs");
const path = require("path");

function getDirectorySize(dirPath) {
  let totalSize = 0;

  if (!fs.existsSync(dirPath)) {
    return 0;
  }

  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      totalSize += getDirectorySize(filePath);
    } else {
      totalSize += stats.size;
    }
  }

  return totalSize;
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function analyzeBuildSize() {
  const buildDir = path.join(process.cwd(), ".next");

  if (!fs.existsSync(buildDir)) {
    console.log('❌ Build directory not found. Run "npm run build" first.');
    return;
  }

  const staticDir = path.join(buildDir, "static");
  const serverDir = path.join(buildDir, "server");

  const staticSize = getDirectorySize(staticDir);
  const serverSize = getDirectorySize(serverDir);
  const totalSize = staticSize + serverSize;

  console.log("\n📊 Bundle Size Analysis");
  console.log("========================");
  console.log(`📁 Static files: ${formatBytes(staticSize)}`);
  console.log(`🖥️  Server files: ${formatBytes(serverSize)}`);
  console.log(`📦 Total build size: ${formatBytes(totalSize)}`);

  // Check for large files
  console.log("\n🔍 Large Files (>500KB):");
  console.log("========================");

  function findLargeFiles(dirPath, threshold = 500 * 1024) {
    if (!fs.existsSync(dirPath)) return;

    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        findLargeFiles(filePath, threshold);
      } else if (stats.size > threshold) {
        const relativePath = path.relative(buildDir, filePath);
        console.log(`📄 ${relativePath}: ${formatBytes(stats.size)}`);
      }
    }
  }

  findLargeFiles(buildDir);

  // Performance recommendations
  console.log("\n💡 Performance Recommendations:");
  console.log("================================");

  if (totalSize > 10 * 1024 * 1024) {
    // 10MB
    console.log("⚠️  Large bundle size detected. Consider:");
    console.log("   • Code splitting with dynamic imports");
    console.log("   • Removing unused dependencies");
    console.log("   • Using tree shaking");
  } else if (totalSize > 5 * 1024 * 1024) {
    // 5MB
    console.log("⚡ Bundle size is moderate. Consider:");
    console.log("   • Lazy loading heavy components");
    console.log("   • Optimizing images and assets");
  } else {
    console.log("✅ Bundle size looks good!");
  }

  console.log("\n🔗 View detailed analysis:");
  console.log("   • Bundle analyzer: .next/bundle-analyzer-report.html");
  console.log("   • Run: npm run analyze");
  console.log("");
}

analyzeBuildSize();
