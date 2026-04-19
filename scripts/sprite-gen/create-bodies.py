#!/usr/bin/env python3
"""
Create 12 body spritesheets from the base player sprite.
Each body spritesheet is a 512x512 PNG (4x4 grid of 128x128 frames)
with the head region erased (transparent) and clothing recolored.

Output: public/assets/sprites/player/bodies/<outfit-name>.png
"""

from PIL import Image
import os
import sys

PROJECT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC_SPRITE = os.path.join(PROJECT, 'public/assets/sprites/npcs/player.png')
OUT_DIR = os.path.join(PROJECT, 'public/assets/sprites/player/bodies')

# The 4x4 grid directions:
# Row 0 = down (front), Row 1 = left, Row 2 = right, Row 3 = up (back)
CELL = 128

# Head cutoff: pixels from the top of each cell below which we KEEP.
# Everything above this line is erased (head region).
# Based on analysis: head ends around y=40-44 in each cell.
HEAD_CUTOFF_Y = 44

# ---- Color Classification ----
# The original player.png uses these color ranges for clothing:
# - White/cream shirt: R>190, G>190, B>190
# - Red/gold vest accents: R>180, G<120, B<80
# - Teal shorts/cap: G>100, B>80, R<120
# - Brown belt/shoes: R=120-180, G=40-110, B<100
# - Gold buckle: R>200, G>170, B>100

# For skin detection (pixels we want to KEEP in body, not erase):
def is_skin_color(r, g, b):
    """Check if pixel is skin-colored."""
    return r > 170 and g > 110 and g < 200 and b > 50 and b < 160 and r > g

def is_head_region_pixel(x, y, r, g, b, a, frame_row, bbox_top):
    """Determine if a pixel belongs to the head region and should be erased."""
    if a < 10:
        return False
    # Use y position relative to cell: everything above HEAD_CUTOFF_Y is head
    if y < HEAD_CUTOFF_Y:
        return True
    # Some hair pixels may extend slightly below cutoff on sides
    # But we keep them — the head covering will hide them
    return False


# ---- Outfit Color Palettes ----
# Each outfit defines how to recolor the clothing.
# We identify clothing pixels by excluding skin, outline, and shadow pixels,
# then remap them to the outfit's color scheme.

# Original clothing colors (approximate center values from analysis):
# Main clothing (shirt/vest area): whites, reds, golds
# Pants area: teals
# Belts/shoes: browns

OUTFITS = {
    'simple-thobe': {
        'desc': 'Simple Thobe (white)',
        # White thobe — lighten everything, make uniform white/cream
        'main': (240, 235, 225),      # Off-white body
        'accent': (210, 200, 185),     # Slightly darker cream trim
        'dark': (180, 170, 155),       # Shadow/fold
        'pants': (235, 230, 220),      # Matching white lower
        'belt': (160, 140, 110),       # Simple brown rope belt
    },
    'simple-abaya': {
        'desc': 'Simple Abaya (black)',
        'main': (50, 45, 55),          # Near-black
        'accent': (70, 65, 75),        # Dark gray accent
        'dark': (35, 30, 40),          # Deep shadow
        'pants': (55, 50, 60),         # Matching dark lower
        'belt': (90, 80, 70),          # Dark brown belt
    },
    'travellers-cloak': {
        'desc': "Traveller's Cloak (brown)",
        'main': (140, 100, 65),        # Warm brown
        'accent': (170, 125, 80),      # Light brown
        'dark': (100, 70, 40),         # Dark brown shadow
        'pants': (120, 90, 55),        # Matching brown lower
        'belt': (85, 60, 35),          # Dark leather
    },
    'desert-thobe': {
        'desc': 'Desert Thobe (sand)',
        'main': (220, 200, 160),       # Sand/khaki
        'accent': (200, 180, 140),     # Darker sand
        'dark': (170, 150, 110),       # Sand shadow
        'pants': (210, 190, 150),      # Matching sand lower
        'belt': (150, 120, 80),        # Tan belt
    },
    'blue-thobe': {
        'desc': 'Blue Thobe',
        'main': (70, 120, 180),        # Medium blue
        'accent': (90, 140, 200),      # Light blue accent
        'dark': (45, 85, 140),         # Dark blue shadow
        'pants': (65, 110, 170),       # Blue lower
        'belt': (50, 75, 120),         # Navy belt
    },
    'green-abaya': {
        'desc': 'Green Abaya',
        'main': (50, 120, 70),         # Forest green
        'accent': (70, 145, 90),       # Lighter green
        'dark': (35, 85, 50),          # Dark green shadow
        'pants': (45, 110, 65),        # Green lower
        'belt': (60, 80, 50),          # Olive belt
    },
    'scholars-robe': {
        'desc': "Scholar's Robe (dark blue with trim)",
        'main': (40, 55, 100),         # Dark navy
        'accent': (180, 160, 100),     # Gold trim
        'dark': (25, 35, 70),          # Deep navy shadow
        'pants': (35, 50, 90),         # Navy lower
        'belt': (150, 130, 80),        # Gold belt/sash
    },
    'merchants-vest': {
        'desc': "Merchant's Vest (colorful)",
        'main': (180, 80, 50),         # Warm red-orange
        'accent': (220, 180, 60),      # Golden yellow
        'dark': (130, 55, 35),         # Dark red shadow
        'pants': (100, 75, 55),        # Brown pants
        'belt': (200, 170, 50),        # Gold belt
    },
    'bedouin-wrap': {
        'desc': 'Bedouin Wrap (red/white)',
        'main': (200, 55, 45),         # Red
        'accent': (240, 235, 225),     # White
        'dark': (150, 40, 35),         # Dark red
        'pants': (190, 50, 40),        # Red lower
        'belt': (120, 100, 70),        # Brown
    },
    'mountain-cloak': {
        'desc': 'Mountain Cloak (grey/brown)',
        'main': (130, 120, 110),       # Grey-brown
        'accent': (155, 145, 130),     # Lighter grey
        'dark': (90, 80, 70),          # Dark grey
        'pants': (110, 100, 90),       # Grey lower
        'belt': (80, 65, 50),          # Dark leather
    },
    'captains-coat': {
        'desc': "Captain's Coat (navy)",
        'main': (30, 45, 80),          # Deep navy
        'accent': (200, 180, 100),     # Gold trim/buttons
        'dark': (20, 30, 55),          # Very dark navy
        'pants': (25, 40, 70),         # Navy lower
        'belt': (180, 160, 80),        # Gold belt
    },
    'royal-garment': {
        'desc': 'Royal Garment (gold/purple)',
        'main': (100, 40, 120),        # Royal purple
        'accent': (220, 190, 60),      # Rich gold
        'dark': (65, 25, 80),          # Deep purple
        'pants': (90, 35, 110),        # Purple lower
        'belt': (210, 180, 50),        # Gold sash
    },
}


def classify_clothing_pixel(r, g, b, y_in_cell):
    """Classify a non-skin, non-outline pixel as main/accent/dark/pants/belt clothing."""
    # Very dark pixels are outlines — keep as-is
    if r < 60 and g < 60 and b < 60:
        return 'outline'

    # Skin pixels — keep as-is
    if is_skin_color(r, g, b):
        return 'skin'

    # Shadow/very dark clothing — remap as 'dark'
    if r < 100 and g < 100 and b < 100:
        return 'dark'

    # Teal/green pixels (pants region): y > 76 and greenish/tealish
    if y_in_cell > 76 and (g > 90 and b > 70 and r < 130):
        return 'pants'

    # Brown pixels (belt, shoes): warm with R dominant
    if r > 100 and r > g and g < 130 and b < 100 and r - b > 30:
        # Distinguish belt (mid-body) from shoes (bottom)
        if y_in_cell > 100:
            return 'belt'  # shoes use belt color
        return 'belt'

    # Gold/yellow: high R and G, lower B
    if r > 180 and g > 140 and b < 130:
        return 'accent'

    # Red: high R, low G, low B
    if r > 160 and g < 100 and b < 100:
        return 'accent'

    # White/cream/gray (main clothing)
    if r > 140 and g > 140 and b > 140:
        return 'main'

    # Light warm tones (lighter browns, tans)
    if r > 140 and g > 80:
        return 'main'

    # Teal that isn't in pants region
    if g > 80 and b > 60 and r < 140:
        return 'pants'

    # Default to main
    return 'main'


def remap_pixel(r, g, b, category, palette):
    """Remap a pixel color to the outfit palette based on its category."""
    if category == 'outline':
        return (r, g, b)  # Keep outlines as-is
    if category == 'skin':
        return (r, g, b)  # Keep skin as-is (tint handled at runtime)

    target = palette.get(category, palette['main'])
    tr, tg, tb = target

    # Preserve some of the original brightness variation
    orig_brightness = (r + g + b) / 3.0
    target_brightness = (tr + tg + tb) / 3.0

    if target_brightness > 0:
        factor = orig_brightness / max(target_brightness, 1)
        # Clamp factor to prevent extreme shifts
        factor = max(0.6, min(1.4, factor))
        return (
            min(255, max(0, int(tr * factor))),
            min(255, max(0, int(tg * factor))),
            min(255, max(0, int(tb * factor))),
        )
    return target


def create_body_sprite(src_img, outfit_name, palette):
    """Create a body spritesheet with head erased and clothing recolored."""
    result = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    src_pixels = src_img.load()
    dst_pixels = result.load()

    for row in range(4):
        for col in range(4):
            cx = col * CELL
            cy = row * CELL

            for y in range(CELL):
                for x in range(CELL):
                    r, g, b, a = src_pixels[cx + x, cy + y]
                    if a < 10:
                        continue

                    # Erase head region
                    if is_head_region_pixel(x, y, r, g, b, a, row, 0):
                        continue  # Leave transparent

                    # Classify and remap clothing pixels
                    cat = classify_clothing_pixel(r, g, b, y)
                    nr, ng, nb = remap_pixel(r, g, b, cat, palette)
                    dst_pixels[cx + x, cy + y] = (nr, ng, nb, a)

    return result


def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    print(f"Loading base sprite: {SRC_SPRITE}")
    src = Image.open(SRC_SPRITE).convert('RGBA')
    assert src.size == (512, 512), f"Expected 512x512, got {src.size}"

    for outfit_id, palette in OUTFITS.items():
        desc = palette.pop('desc', outfit_id)
        print(f"  Creating {outfit_id} ({desc})...")
        body = create_body_sprite(src, outfit_id, palette)
        out_path = os.path.join(OUT_DIR, f'{outfit_id}.png')
        body.save(out_path)
        print(f"    -> {out_path}")
        palette['desc'] = desc  # Restore

    print(f"\nDone! Created {len(OUTFITS)} body spritesheets in {OUT_DIR}")


if __name__ == '__main__':
    main()
