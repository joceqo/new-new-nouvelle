#!/usr/bin/env python3
"""
Generate professional macOS-style app icons for Nouvelle
Following Apple Human Interface Guidelines
"""

from PIL import Image, ImageDraw, ImageFilter
import os

def create_icon(size=1024, variant="light"):
    """
    Create a polished macOS-style icon:
    - Smooth gradient background inside the safe area
    - Balanced "N" logo centred
    - Soft drop shadow for depth
    - No transparency in final output (opaque)

    Args:
        size: Icon size in pixels
        variant: "light" or "dark" for different color schemes
    """

    # Set up
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Colours (light mode variant)
    if variant == "light":
        bg_color_light = (99, 102, 241)     # #6366F1
        bg_color_dark  = (88,  86,  214)    # #5856D6
        logo_color = (255, 255, 255, 255)   # White logo
    else:  # dark mode variant
        bg_color_light = (124, 58, 237)     # #7C3AED - deeper purple
        bg_color_dark  = (109, 40, 217)     # #6D28D9
        logo_color = (255, 255, 255, 255)   # White logo

    # Define safe margin / corner radius (macOS icon uses "squircle" style)
    margin = int(size * 0.10)
    corner_radius = int(size * 0.20)

    # Draw smooth vertical gradient background
    for y in range(size):
        # linear interpolation between dark → light
        t = y / float(size - 1)
        r = int(bg_color_dark[0] + (bg_color_light[0] - bg_color_dark[0]) * t)
        g = int(bg_color_dark[1] + (bg_color_light[1] - bg_color_dark[1]) * t)
        b = int(bg_color_dark[2] + (bg_color_light[2] - bg_color_dark[2]) * t)
        draw.line([(0, y), (size, y)], fill=(r, g, b, 255))

    # Mask the background into a rounded square (squircle-approx)
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle(
        [margin, margin, size - margin, size - margin],
        radius=corner_radius,
        fill=255
    )
    bg = img.copy()
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    img.paste(bg, mask=mask)

    # Draw soft drop shadow underneath the logo
    # Create an off-screen layer for shadow
    shadow = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    # Shadow geometry (slightly offset)
    logo_margin = int(size * 0.30)
    logo_width = int(size * 0.08)
    left_x = logo_margin
    right_x = size - logo_margin - logo_width
    top_y = logo_margin
    bottom_y = size - logo_margin
    shadow_offset = int(size * 0.015)  # e.g., ~15px at 1024 size
    shadow_draw.rounded_rectangle(
        [left_x + shadow_offset, top_y + shadow_offset,
         right_x + logo_width + shadow_offset, bottom_y + shadow_offset],
        radius=int(logo_width * 0.4),
        fill=(0, 0, 0, 80)
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=int(size * 0.012)))
    img = Image.alpha_composite(img, shadow)

    # Draw the "N" logo in white
    draw = ImageDraw.Draw(img)
    # Left vertical bar
    draw.rounded_rectangle(
        [left_x, top_y, left_x + logo_width, bottom_y],
        radius=int(logo_width * 0.4),
        fill=logo_color
    )
    # Right vertical bar
    draw.rounded_rectangle(
        [size - logo_margin - logo_width, top_y,
         size - logo_margin, bottom_y],
        radius=int(logo_width * 0.4),
        fill=logo_color
    )
    # Diagonal bar
    # Use polygon for the diagonal, ensuring symmetry
    top_left  = (left_x + logo_width*0.3, top_y)
    top_right = (size - logo_margin - logo_width*0.3, bottom_y - logo_width*0.3)
    bottom_right = (size - logo_margin, bottom_y)
    bottom_left  = (left_x + logo_width*1.3, top_y + logo_width*0.3)
    draw.polygon(
        [top_left, bottom_left, top_right, bottom_right],
        fill=logo_color
    )

    # Final composite: Ensure opaque background
    # Create new opaque background matching the perimeter of rounded rect
    final = Image.new('RGB', (size, size), bg_color_light)
    final.paste(img, mask=img.split()[3])

    return final

def main():
    print("🎨 Generating professional macOS-style icons for Nouvelle...")
    print()

    # Create the master icon at high resolution
    master_icon = create_icon(1024, variant="light")

    # Save the main icon
    output_dir = "apps/desktop/src-tauri/icons"

    # Save master icon
    master_icon.save(os.path.join(output_dir, "icon.png"))
    print("✓ Created icon.png (1024x1024)")

    # Generate all required sizes for desktop
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

    # Android icons
    print()
    print("📱 Generating mobile icons...")
    android_sizes = {
        "android/mipmap-mdpi": 48,
        "android/mipmap-hdpi": 72,
        "android/mipmap-xhdpi": 96,
        "android/mipmap-xxhdpi": 144,
        "android/mipmap-xxxhdpi": 192,
    }

    for folder, size in android_sizes.items():
        resized = master_icon.resize((size, size), Image.Resampling.LANCZOS)
        # Regular launcher icon
        resized.save(os.path.join(output_dir, folder, "ic_launcher.png"))
        # Round launcher icon
        resized.save(os.path.join(output_dir, folder, "ic_launcher_round.png"))
        # Foreground icon
        resized.save(os.path.join(output_dir, folder, "ic_launcher_foreground.png"))
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
        resized.save(os.path.join(output_dir, filename))

    print("✓ Created all iOS icons")

    # Save app-icon.png in desktop folder
    master_icon.save("apps/desktop/app-icon.png")
    print()
    print("✓ Created apps/desktop/app-icon.png")

    print()
    print("✨ Icon generation complete!")
    print()
    print("Next steps:")
    print("1. Convert to .icns for macOS:")
    print("   cd apps/desktop/src-tauri/icons")
    print("   convert icon.png -resize 1024x1024 icon.icns")
    print()
    print("2. Convert to .ico for Windows:")
    print("   cd apps/desktop/src-tauri/icons")
    print("   convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico")
    print()
    print("3. Rebuild your Tauri app to see the new icon!")

if __name__ == "__main__":
    main()
