#!/usr/bin/env python3
"""
Generate a professional app icon for Nouvelle
Inspired by Notion, Obsidian, and modern app design
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size=1024):
    """Create a modern, professional icon for Nouvelle"""

    # Create a new image with transparency
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Modern color palette - deep indigo/purple gradient
    bg_color1 = (88, 86, 214)      # #5856D6 - vibrant indigo
    bg_color2 = (99, 102, 241)     # #6366F1 - lighter indigo

    # Create rounded square background with gradient effect
    margin = size * 0.12
    corner_radius = size * 0.22

    # Draw background with subtle gradient layers
    for i in range(10):
        offset = i * 2
        alpha = 255 - (i * 10)
        layer_margin = margin + offset

        # Interpolate between colors
        r = int(bg_color1[0] + (bg_color2[0] - bg_color1[0]) * (i / 10))
        g = int(bg_color1[1] + (bg_color2[1] - bg_color1[1]) * (i / 10))
        b = int(bg_color1[2] + (bg_color2[2] - bg_color1[2]) * (i / 10))

        draw.rounded_rectangle(
            [layer_margin, layer_margin, size - layer_margin, size - layer_margin],
            radius=corner_radius,
            fill=(r, g, b, alpha)
        )

    # Draw the stylized "N" logo
    # Using geometric shapes to create a modern "N"
    logo_margin = size * 0.30
    logo_width = size * 0.08

    # Left vertical bar
    draw.rounded_rectangle(
        [logo_margin, logo_margin, logo_margin + logo_width, size - logo_margin],
        radius=logo_width * 0.4,
        fill=(255, 255, 255, 255)
    )

    # Right vertical bar
    draw.rounded_rectangle(
        [size - logo_margin - logo_width, logo_margin, size - logo_margin, size - logo_margin],
        radius=logo_width * 0.4,
        fill=(255, 255, 255, 255)
    )

    # Diagonal bar (creating the N)
    # Calculate points for a rotated rectangle
    top_left = (logo_margin + logo_width * 0.3, logo_margin)
    top_right = (size - logo_margin - logo_width * 0.3, size - logo_margin - logo_width)
    bottom_right = (size - logo_margin, size - logo_margin)
    bottom_left = (logo_margin + logo_width * 1.3, logo_margin + logo_width)

    draw.polygon(
        [top_left, bottom_left, top_right, bottom_right],
        fill=(255, 255, 255, 255)
    )

    return img

def main():
    print("🎨 Generating professional icon for Nouvelle...")

    # Create the master icon at high resolution
    master_icon = create_icon(1024)

    # Save the main icon
    output_dir = "/home/user/new-new-nouvelle/apps/desktop/src-tauri/icons"

    # Save master icon
    master_icon.save(os.path.join(output_dir, "icon.png"))
    print("✓ Created icon.png (1024x1024)")

    # Generate all required sizes
    sizes = {
        "32x32.png": 32,
        "64x64.png": 64,
        "128x128.png": 128,
        "128x128@2x.png": 256,
        "256x256.png": 256,
        "512x512.png": 512,
    }

    for filename, size in sizes.items():
        resized = master_icon.resize((size, size), Image.Resampling.LANCZOS)
        resized.save(os.path.join(output_dir, filename))
        print(f"✓ Created {filename}")

    # Generate Windows icons
    windows_sizes = {
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
    }

    for filename, size in windows_sizes.items():
        resized = master_icon.resize((size, size), Image.Resampling.LANCZOS)
        resized.save(os.path.join(output_dir, filename))
        print(f"✓ Created {filename}")

    # Save app-icon.png in desktop folder
    master_icon.save("/home/user/new-new-nouvelle/apps/desktop/app-icon.png")
    print("✓ Created app-icon.png")

    print("\n✨ Icon generation complete!")
    print("\nNext steps:")
    print("1. Convert to .icns for macOS: Use 'iconutil' or online converter")
    print("2. Convert to .ico for Windows: Use ImageMagick or online converter")
    print("3. Rebuild your Tauri app to see the new icon!")

if __name__ == "__main__":
    main()
