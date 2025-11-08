#!/usr/bin/env python3
"""
Generate mobile app icons for Android and iOS
"""

from PIL import Image
import os

def main():
    print("📱 Generating mobile icons...")

    # Load the master icon
    master_icon = Image.open("/home/user/new-new-nouvelle/apps/desktop/src-tauri/icons/icon.png")

    # Android icons
    android_sizes = {
        "android/mipmap-mdpi": 48,
        "android/mipmap-hdpi": 72,
        "android/mipmap-xhdpi": 96,
        "android/mipmap-xxhdpi": 144,
        "android/mipmap-xxxhdpi": 192,
    }

    base_path = "/home/user/new-new-nouvelle/apps/desktop/src-tauri/icons"

    for folder, size in android_sizes.items():
        # Regular launcher icon
        resized = master_icon.resize((size, size), Image.Resampling.LANCZOS)
        resized.save(os.path.join(base_path, folder, "ic_launcher.png"))

        # Round launcher icon
        resized.save(os.path.join(base_path, folder, "ic_launcher_round.png"))

        # Foreground icon
        resized.save(os.path.join(base_path, folder, "ic_launcher_foreground.png"))

        print(f"✓ Created {folder} icons ({size}x{size})")

    # iOS icons
    ios_sizes = {
        "ios/AppIcon-20x20@1x.png": 20,
        "ios/AppIcon-20x20@2x.png": 40,
        "ios/AppIcon-20x20@2x-1.png": 40,
        "ios/AppIcon-20x20@3x.png": 60,
        "ios/AppIcon-29x29@1x.png": 29,
        "ios/AppIcon-29x29@2x.png": 58,
        "ios/AppIcon-29x29@2x-1.png": 58,
        "ios/AppIcon-29x29@3x.png": 87,
        "ios/AppIcon-40x40@1x.png": 40,
        "ios/AppIcon-40x40@2x.png": 80,
        "ios/AppIcon-40x40@2x-1.png": 80,
        "ios/AppIcon-40x40@3x.png": 120,
        "ios/AppIcon-60x60@2x.png": 120,
        "ios/AppIcon-60x60@3x.png": 180,
        "ios/AppIcon-76x76@1x.png": 76,
        "ios/AppIcon-76x76@2x.png": 152,
        "ios/AppIcon-83.5x83.5@2x.png": 167,
        "ios/AppIcon-512@2x.png": 1024,
    }

    for filename, size in ios_sizes.items():
        resized = master_icon.resize((size, size), Image.Resampling.LANCZOS)
        resized.save(os.path.join(base_path, filename))
        print(f"✓ Created {filename}")

    print("\n✨ Mobile icon generation complete!")

if __name__ == "__main__":
    main()
