#!/usr/bin/env node

/**
 * Generate a professional app icon for Nouvelle
 * Simple, modern design with rounded square and "N" letter
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createIconSVG(size) {
  const cornerRadius = size * 0.225;

  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#5856D6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#6366F1;stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Rounded square background -->
      <rect width="${size}" height="${size}" rx="${cornerRadius}" fill="url(#grad)" />
    </svg>
  `;
}

async function generateIcon(size, outputPath) {
  const svg = createIconSVG(size);
  const buffer = Buffer.from(svg);

  await sharp(buffer).resize(size, size).png().toFile(outputPath);
}

async function main() {
  console.log("🎨 Generating icon for Nouvelle...\n");

  const scriptDir = __dirname;
  const iconsDir = path.join(scriptDir, "src-tauri", "icons");

  // Generate all required sizes
  const sizes = {
    "icon.png": 1024,
    "32x32.png": 32,
    "64x64.png": 64,
    "128x128.png": 128,
    "128x128@2x.png": 256,
    "256x256.png": 256,
    "512x512.png": 512,
  };

  for (const [filename, size] of Object.entries(sizes)) {
    await generateIcon(size, path.join(iconsDir, filename));
    console.log(`✓ Created ${filename}`);
  }

  // Generate Windows icons
  const windowsSizes = {
    "Square30x30Logo.png": 30,
    "Square44x44Logo.png": 44,
    "Square71x71Logo.png": 71,
    "Square89x89Logo.png": 89,
    "Square107x107Logo.png": 107,
    "Square142x142Logo.png": 142,
    "Square150x150Logo.png": 150,
    "Square284x284Logo.png": 284,
    "Square310x310Logo.png": 310,
    "StoreLogo.png": 50,
  };

  for (const [filename, size] of Object.entries(windowsSizes)) {
    await generateIcon(size, path.join(iconsDir, filename));
    console.log(`✓ Created ${filename}`);
  }

  // Generate mobile icons for Android
  const androidSizes = {
    "android/mipmap-mdpi": 48,
    "android/mipmap-hdpi": 72,
    "android/mipmap-xhdpi": 96,
    "android/mipmap-xxhdpi": 144,
    "android/mipmap-xxxhdpi": 192,
  };

  for (const [folder, size] of Object.entries(androidSizes)) {
    const folderPath = path.join(iconsDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    await generateIcon(size, path.join(folderPath, "ic_launcher.png"));
    await generateIcon(
      size,
      path.join(folderPath, "ic_launcher_foreground.png")
    );
    await generateIcon(size, path.join(folderPath, "ic_launcher_round.png"));
  }
  console.log("✓ Created all Android icons");

  // Generate iOS icons
  const iosSizes = [
    { name: "AppIcon-20x20@1x.png", size: 20 },
    { name: "AppIcon-20x20@2x.png", size: 40 },
    { name: "AppIcon-20x20@2x-1.png", size: 40 },
    { name: "AppIcon-20x20@3x.png", size: 60 },
    { name: "AppIcon-29x29@1x.png", size: 29 },
    { name: "AppIcon-29x29@2x.png", size: 58 },
    { name: "AppIcon-29x29@2x-1.png", size: 58 },
    { name: "AppIcon-29x29@3x.png", size: 87 },
    { name: "AppIcon-40x40@1x.png", size: 40 },
    { name: "AppIcon-40x40@2x.png", size: 80 },
    { name: "AppIcon-40x40@2x-1.png", size: 80 },
    { name: "AppIcon-40x40@3x.png", size: 120 },
    { name: "AppIcon-60x60@2x.png", size: 120 },
    { name: "AppIcon-60x60@3x.png", size: 180 },
    { name: "AppIcon-76x76@1x.png", size: 76 },
    { name: "AppIcon-76x76@2x.png", size: 152 },
    { name: "AppIcon-83.5x83.5@2x.png", size: 167 },
    { name: "AppIcon-512@2x.png", size: 1024 },
  ];

  const iosDir = path.join(iconsDir, "ios");
  if (!fs.existsSync(iosDir)) {
    fs.mkdirSync(iosDir, { recursive: true });
  }

  for (const { name, size } of iosSizes) {
    await generateIcon(size, path.join(iosDir, name));
  }
  console.log("✓ Created all iOS icons");

  // Save app-icon.png
  await generateIcon(1024, path.join(scriptDir, "app-icon.png"));
  console.log("✓ Created app-icon.png");

  // Generate .ico file for Windows (using 256x256 as base)
  const icoSvg = createIconSVG(256);
  const icoBuffer = Buffer.from(icoSvg);
  await sharp(icoBuffer)
    .resize(256, 256)
    .toFile(path.join(iconsDir, "icon.ico"));
  console.log("✓ Created icon.ico");

  console.log("\n✨ Icon generation complete!");
  console.log("\nNext steps:");
  console.log("1. Generate .icns: run the macOS iconutil commands");
  console.log("2. Restart your Tauri app");
}

main().catch(console.error);
