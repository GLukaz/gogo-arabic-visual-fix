#!/usr/bin/env python3
"""
Create faceless NPC spritesheets and silhouette portraits.

NPC sprites: Take existing monster-quest NPC spritesheets, erase head/face region,
             and draw head coverings directly (baked-in, not composited at runtime).

NPC portraits: 96x96 solid-colored silhouettes with distinctive outlines.

Output:
  public/assets/sprites/npcs/faceless/<npc-id>.png  (512x512 spritesheets)
  public/assets/portraits/<npc-id>.png               (96x96 silhouettes)
"""

from PIL import Image, ImageDraw
import os

PROJECT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
NPC_SPRITE_DIR = os.path.join(PROJECT, 'public/assets/sprites/npcs')
OUT_SPRITE_DIR = os.path.join(PROJECT, 'public/assets/sprites/npcs/faceless')
OUT_PORTRAIT_DIR = os.path.join(PROJECT, 'public/assets/portraits')
CELL = 128

# Head cutoff Y (same as body sprites — erase above this line)
HEAD_CUTOFF_Y = 44

# ---- NPC Definitions ----
# Each NPC has: source sprite, covering type, covering color, silhouette color, role items
NPCS = {
    # --- Oasis Village (Zone 1) ---
    'scholar-yusuf': {
        'src': 'young_guy.png',
        'covering': 'turban',
        'covering_color': (240, 235, 220),  # White turban
        'silhouette_color': (70, 90, 140),  # Deep blue
        'items': ['book'],
        'name': 'Scholar Yusuf',
    },
    'merchant-fatima': {
        'src': 'hat_girl.png',
        'covering': 'hijab',
        'covering_color': (140, 50, 60),    # Deep red hijab
        'silhouette_color': (140, 50, 60),  # Burgundy
        'items': ['basket'],
        'name': 'Merchant Fatima',
    },
    'student-khalid': {
        'src': 'straw.png',
        'covering': 'kufi',
        'covering_color': (230, 220, 200),  # Cream kufi
        'silhouette_color': (90, 130, 90),  # Forest green
        'items': [],
        'name': 'Student Khalid',
    },
    # --- Ancient Library (Zone 2) ---
    'librarian-ibrahim': {
        'src': 'purple_girl.png',
        'covering': 'turban',
        'covering_color': (200, 180, 140),  # Sand-colored turban
        'silhouette_color': (100, 75, 55),  # Warm brown
        'items': ['book'],
        'name': 'Librarian Ibrahim',
    },
    'scribe-amina': {
        'src': 'young_girl.png',
        'covering': 'hijab',
        'covering_color': (60, 80, 120),    # Navy hijab
        'silhouette_color': (60, 80, 120),  # Navy
        'items': ['quill'],
        'name': 'Scribe Amina',
    },
    # --- Desert Marketplace (Zone 3) ---
    'trader-hassan': {
        'src': 'blond.png',
        'covering': 'ghutra',
        'covering_color': (240, 235, 220),  # White ghutra
        'silhouette_color': (180, 140, 70),  # Sand gold
        'items': [],
        'name': 'Trader Hassan',
    },
    'spice-seller-layla': {
        'src': 'hat_girl.png',
        'covering': 'hijab',
        'covering_color': (160, 80, 40),    # Spice orange hijab
        'silhouette_color': (160, 80, 40),  # Terracotta
        'items': ['basket'],
        'name': 'Spice Seller Layla',
    },
    # --- Farmland (Zone 4) ---
    'farmer-omar': {
        'src': 'straw.png',
        'covering': 'kufi',
        'covering_color': (200, 190, 160),  # Straw-colored kufi
        'silhouette_color': (120, 150, 80),  # Olive green
        'items': ['staff'],
        'name': 'Farmer Omar',
    },
    'herbalist-maryam': {
        'src': 'young_girl.png',
        'covering': 'hijab',
        'covering_color': (70, 120, 70),    # Green hijab
        'silhouette_color': (70, 120, 70),  # Moss green
        'items': ['basket'],
        'name': 'Herbalist Maryam',
    },
    # --- Bedouin Camp (Zone 5) ---
    'elder-tariq': {
        'src': 'young_guy.png',
        'covering': 'ghutra',
        'covering_color': (200, 60, 50),    # Red ghutra
        'silhouette_color': (170, 60, 45),  # Deep red
        'items': ['staff'],
        'name': 'Elder Tariq',
    },
    'storyteller-noor': {
        'src': 'purple_girl.png',
        'covering': 'hijab',
        'covering_color': (130, 60, 100),   # Purple hijab
        'silhouette_color': (130, 60, 100), # Purple
        'items': [],
        'name': 'Storyteller Noor',
    },
    # --- Mountain Village (Zone 6) ---
    'guide-salim': {
        'src': 'blond.png',
        'covering': 'hood',
        'covering_color': (100, 85, 65),    # Brown hood
        'silhouette_color': (100, 85, 65),  # Mountain brown
        'items': ['staff'],
        'name': 'Guide Salim',
    },
    'weaver-zahra': {
        'src': 'hat_girl.png',
        'covering': 'hijab',
        'covering_color': (150, 100, 60),   # Amber hijab
        'silhouette_color': (150, 100, 60), # Amber
        'items': [],
        'name': 'Weaver Zahra',
    },
    # --- Coastal Port (Zone 7) ---
    'captain-rashid': {
        'src': 'young_guy.png',
        'covering': 'turban',
        'covering_color': (50, 65, 100),    # Navy turban
        'silhouette_color': (50, 65, 100),  # Navy blue
        'items': [],
        'name': 'Captain Rashid',
    },
    'fishmonger-hana': {
        'src': 'young_girl.png',
        'covering': 'hijab',
        'covering_color': (60, 130, 140),   # Teal hijab
        'silhouette_color': (60, 130, 140), # Teal
        'items': ['basket'],
        'name': 'Fishmonger Hana',
    },
    # --- Royal Palace (Zone 8) ---
    'vizier-abbas': {
        'src': 'purple_girl.png',
        'covering': 'turban',
        'covering_color': (100, 40, 120),   # Royal purple turban
        'silhouette_color': (100, 40, 120), # Purple
        'items': ['book'],
        'name': 'Vizier Abbas',
    },
    'princess-aisha': {
        'src': 'hat_girl.png',
        'covering': 'hijab',
        'covering_color': (180, 150, 50),   # Gold hijab
        'silhouette_color': (180, 150, 50), # Gold
        'items': [],
        'name': 'Princess Aisha',
    },
    'guard-hamza': {
        'src': 'straw.png',
        'covering': 'hood',
        'covering_color': (80, 70, 60),     # Dark hood
        'silhouette_color': (80, 70, 60),   # Dark gray
        'items': ['staff'],
        'name': 'Guard Hamza',
    },
    # --- Traveling / Special NPCs ---
    'wanderer-ali': {
        'src': 'blond.png',
        'covering': 'hood',
        'covering_color': (120, 110, 90),   # Desert hood
        'silhouette_color': (160, 140, 100),# Sandy
        'items': ['staff'],
        'name': 'Wanderer Ali',
    },
    'healer-khadija': {
        'src': 'young_girl.png',
        'covering': 'hijab',
        'covering_color': (230, 220, 200),  # White hijab
        'silhouette_color': (200, 190, 170),# Cream
        'items': ['basket'],
        'name': 'Healer Khadija',
    },
    'imam-muhammad': {
        'src': 'young_guy.png',
        'covering': 'turban',
        'covering_color': (245, 240, 230),  # White turban
        'silhouette_color': (240, 230, 210),# Off-white
        'items': ['book'],
        'name': 'Imam Muhammad',
    },
    'blacksmith-daud': {
        'src': 'straw.png',
        'covering': 'kufi',
        'covering_color': (60, 55, 50),     # Dark kufi
        'silhouette_color': (90, 80, 70),   # Charcoal
        'items': [],
        'name': 'Blacksmith Daud',
    },
    'poet-rumi': {
        'src': 'purple_girl.png',
        'covering': 'turban',
        'covering_color': (150, 120, 80),   # Sand turban
        'silhouette_color': (150, 120, 80), # Warm sand
        'items': ['book'],
        'name': 'Poet Rumi',
    },
}


def draw_pixel_block(draw, x, y, w, h, color):
    """Draw a filled rectangle."""
    if w <= 0 or h <= 0:
        return
    draw.rectangle([x, y, x + w - 1, y + h - 1], fill=color)


def darken(color, factor=0.7):
    """Darken a color."""
    return tuple(max(0, int(c * factor)) for c in color[:3]) + (color[3] if len(color) > 3 else 255,)


def lighten(color, factor=1.3):
    """Lighten a color."""
    return tuple(min(255, int(c * factor)) for c in color[:3]) + (color[3] if len(color) > 3 else 255,)


# Head positions per frame (same as create-heads.py)
HEAD_POS = {
    (0, 0): (66, 4), (0, 1): (66, 8), (0, 2): (66, 4), (0, 3): (66, 8),
    (1, 0): (62, 8), (1, 1): (62, 12), (1, 2): (62, 8), (1, 3): (62, 12),
    (2, 0): (66, 8), (2, 1): (66, 12), (2, 2): (66, 8), (2, 3): (66, 12),
    (3, 0): (66, 4), (3, 1): (66, 8), (3, 2): (66, 4), (3, 3): (66, 8),
}
DIR_NAMES = {0: 'down', 1: 'left', 2: 'right', 3: 'up'}


def draw_npc_covering(draw, cx, top_y, direction, covering_type, color):
    """Draw a head covering on an NPC sprite. Simpler than player coverings since they're baked-in."""
    outline = darken(color, 0.4)
    light = lighten(color, 1.2)
    shadow = darken(color, 0.7)
    skin = (210, 170, 130, 255)

    if covering_type == 'kufi':
        w, h = 26, 14
        x = cx - w // 2
        y = top_y + 2
        draw_pixel_block(draw, x, y, w, h, outline)
        draw_pixel_block(draw, x + 2, y + 2, w - 4, h - 4, color + (255,))
        draw_pixel_block(draw, x + 2, y + h - 4, w - 4, 2, shadow)
        # Neck
        draw_pixel_block(draw, cx - 10, y + h, 20, 22, skin)

    elif covering_type == 'ghutra':
        w, h = 36, 40
        x = cx - w // 2
        y = top_y
        draw_pixel_block(draw, x, y, w, h, outline)
        draw_pixel_block(draw, x + 2, y + 2, w - 4, h - 4, color + (255,))
        # Agal
        draw_pixel_block(draw, x + 4, y + 10, w - 8, 4, (40, 35, 30, 255))
        # Shadow
        draw_pixel_block(draw, x + 2, y + 2, 4, h - 4, shadow)
        draw_pixel_block(draw, x + w - 6, y + 2, 4, h - 4, shadow)
        if direction == 'down':
            draw_pixel_block(draw, cx - 6, y + 24, 12, 8, skin)

    elif covering_type == 'turban':
        w, h = 30, 30
        x = cx - w // 2
        y = top_y - 2
        draw_pixel_block(draw, x, y, w, h, outline)
        draw_pixel_block(draw, x + 2, y + 2, w - 4, h - 4, color + (255,))
        # Wrap lines
        for wy in range(y + 6, y + h - 2, 6):
            draw_pixel_block(draw, x + 2, wy, w - 4, 2, shadow)
        draw_pixel_block(draw, cx - 2, y + 2, 4, h - 4, light)
        # Neck
        neck_y = y + h
        draw_pixel_block(draw, cx - 8, neck_y, 16, 14, skin)

    elif covering_type == 'hijab':
        w, h = 34, 38
        x = cx - w // 2
        y = top_y
        draw_pixel_block(draw, x, y, w, h, outline)
        draw_pixel_block(draw, x + 2, y + 2, w - 4, h - 4, color + (255,))
        draw_pixel_block(draw, x + 4, y + 4, w - 12, 4, light)
        draw_pixel_block(draw, x + 2, y + h - 8, 4, 6, shadow)
        draw_pixel_block(draw, x + w - 6, y + h - 8, 4, 6, shadow)
        if direction == 'down':
            draw_pixel_block(draw, cx - 6, y + 16, 12, 12, skin)

    elif covering_type == 'hood':
        w, h = 32, 40
        x = cx - w // 2
        y = top_y - 2
        draw_pixel_block(draw, x + 4, y, w - 8, 4, outline)
        draw_pixel_block(draw, x, y + 4, w, h - 4, outline)
        draw_pixel_block(draw, x + 2, y + 2, w - 4, h - 4, color + (255,))
        # Point
        draw_pixel_block(draw, cx - 4, y, 8, 4, color + (255,))
        draw_pixel_block(draw, x + 2, y + h - 8, w - 4, 6, shadow)
        if direction == 'down':
            draw_pixel_block(draw, cx - 6, y + 18, 12, 12, skin)


def create_faceless_npc(npc_id, npc_data):
    """Create a faceless NPC spritesheet by erasing head and drawing covering."""
    src_path = os.path.join(NPC_SPRITE_DIR, npc_data['src'])
    if not os.path.exists(src_path):
        print(f"    WARNING: Source sprite not found: {src_path}")
        return None

    src = Image.open(src_path).convert('RGBA')
    if src.size != (512, 512):
        print(f"    WARNING: Unexpected size {src.size} for {src_path}, skipping")
        return None

    # Create copy and erase head region
    result = src.copy()
    pixels = result.load()

    for row in range(4):
        for col in range(4):
            cx = col * CELL
            cy = row * CELL
            for y in range(HEAD_CUTOFF_Y):
                for x in range(CELL):
                    pixels[cx + x, cy + y] = (0, 0, 0, 0)

    # Draw head covering
    draw = ImageDraw.Draw(result)
    for row in range(4):
        for col in range(4):
            head_cx, head_ty = HEAD_POS[(row, col)]
            abs_cx = col * CELL + head_cx
            abs_ty = row * CELL + head_ty
            direction = DIR_NAMES[row]
            draw_npc_covering(draw, abs_cx, abs_ty, direction,
                            npc_data['covering'], npc_data['covering_color'])

    return result


def create_portrait(npc_id, npc_data):
    """Create a 96x96 silhouette portrait."""
    size = 96
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    color = npc_data['silhouette_color']
    dark = darken(color + (255,), 0.6)
    light = lighten(color + (255,), 1.3)
    sil = color + (255,)

    covering = npc_data['covering']
    items = npc_data.get('items', [])

    # Base body silhouette (centered, roughly 60x80)
    body_x = 18
    body_w = 60

    # Shoulders/body
    draw_pixel_block(draw, body_x, 40, body_w, 52, sil)
    draw_pixel_block(draw, body_x + 4, 40, body_w - 8, 48, light)
    # Bottom rounded
    draw_pixel_block(draw, body_x + 8, 88, body_w - 16, 8, sil)

    # Neck
    draw_pixel_block(draw, 36, 32, 24, 12, sil)

    # Head shape depends on covering
    if covering == 'kufi':
        # Small cap on rounded head
        draw_pixel_block(draw, 28, 12, 40, 24, sil)
        draw_pixel_block(draw, 24, 20, 48, 16, sil)
        # Cap top
        draw_pixel_block(draw, 30, 6, 36, 10, dark)
        draw_pixel_block(draw, 32, 4, 32, 4, dark)

    elif covering == 'ghutra':
        # Draped headscarf — wider
        draw_pixel_block(draw, 20, 4, 56, 8, dark)
        draw_pixel_block(draw, 16, 12, 64, 24, sil)
        # Agal band
        draw_pixel_block(draw, 20, 16, 56, 4, dark)
        # Drape extensions on sides
        draw_pixel_block(draw, 10, 28, 16, 20, sil)
        draw_pixel_block(draw, 70, 28, 16, 20, sil)

    elif covering == 'turban':
        # Tall wrapped shape
        draw_pixel_block(draw, 26, 0, 44, 36, sil)
        draw_pixel_block(draw, 30, -2, 36, 4, sil)
        # Wrap texture lines
        for y in range(4, 32, 6):
            draw_pixel_block(draw, 28, y, 40, 2, dark)

    elif covering == 'hijab':
        # Smooth rounded covering
        draw_pixel_block(draw, 24, 6, 48, 30, sil)
        draw_pixel_block(draw, 20, 12, 56, 24, sil)
        # Drape over shoulders
        draw_pixel_block(draw, 14, 32, 68, 12, sil)
        draw_pixel_block(draw, 26, 8, 44, 8, light)

    elif covering == 'hood':
        # Pointed hood
        draw_pixel_block(draw, 42, 0, 12, 4, sil)
        draw_pixel_block(draw, 38, 4, 20, 4, sil)
        draw_pixel_block(draw, 32, 8, 32, 4, sil)
        draw_pixel_block(draw, 26, 12, 44, 24, sil)
        draw_pixel_block(draw, 22, 20, 52, 16, sil)

    # Draw items
    if 'book' in items:
        # Small book shape on right side
        draw_pixel_block(draw, 70, 52, 16, 20, dark)
        draw_pixel_block(draw, 72, 54, 12, 16, lighten(sil, 0.8))

    if 'staff' in items:
        # Vertical staff on left side
        draw_pixel_block(draw, 8, 10, 4, 76, dark)
        draw_pixel_block(draw, 6, 8, 8, 6, dark)

    if 'basket' in items:
        # Small basket shape
        draw_pixel_block(draw, 68, 58, 20, 14, dark)
        draw_pixel_block(draw, 70, 56, 16, 4, dark)

    if 'quill' in items:
        # Small quill
        draw_pixel_block(draw, 72, 44, 3, 20, dark)
        draw_pixel_block(draw, 70, 42, 7, 4, light)

    # Outline the entire silhouette
    # Simple approach: any pixel with an adjacent transparent pixel gets darkened
    pixels = img.load()
    outline_pixels = []
    for y in range(size):
        for x in range(size):
            r, g, b, a = pixels[x, y]
            if a > 0:
                # Check if any neighbor is transparent
                is_edge = False
                for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < size and 0 <= ny < size:
                        if pixels[nx, ny][3] == 0:
                            is_edge = True
                            break
                    else:
                        is_edge = True
                        break
                if is_edge:
                    outline_pixels.append((x, y))

    for x, y in outline_pixels:
        r, g, b, a = pixels[x, y]
        pixels[x, y] = (max(0, r - 40), max(0, g - 40), max(0, b - 40), 255)

    return img


def main():
    os.makedirs(OUT_SPRITE_DIR, exist_ok=True)
    os.makedirs(OUT_PORTRAIT_DIR, exist_ok=True)

    print("Creating faceless NPC spritesheets...")
    for npc_id, npc_data in NPCS.items():
        print(f"  {npc_id} ({npc_data['name']})...")
        sprite = create_faceless_npc(npc_id, npc_data)
        if sprite:
            out_path = os.path.join(OUT_SPRITE_DIR, f'{npc_id}.png')
            sprite.save(out_path)
            print(f"    -> sprite: {out_path}")

    print("\nCreating NPC silhouette portraits...")
    for npc_id, npc_data in NPCS.items():
        portrait = create_portrait(npc_id, npc_data)
        out_path = os.path.join(OUT_PORTRAIT_DIR, f'{npc_id}.png')
        portrait.save(out_path)
        print(f"    -> portrait: {out_path}")

    print(f"\nDone! Created {len(NPCS)} NPC sprites and portraits")


if __name__ == '__main__':
    main()
