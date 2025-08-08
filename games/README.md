# Games Section Structure

This directory contains all the games for the website, organized for easy expansion and maintenance.

## Directory Structure

```
games/
├── index.html                 # Main games landing page
├── shared/                    # Shared resources for all games
│   ├── css/
│   │   └── games-main.css    # Main games page styles
│   └── js/
│       └── games-main.js     # Main games page functionality
└── game-21/                  # Game 21 (21 Card Game)
    ├── index.html            # Game 21 selection page
    ├── game-21.html          # The actual game
    ├── home.html             # Game 21 home page
    └── assets/               # Game-specific assets
        ├── css/              # Game 21 styles
        ├── js/               # Game 21 scripts
        └── images/           # Game 21 images
```

## Navigation Flow

1. **Main Website** → `/games/` (Games landing page)
2. **Games Landing** → `/games/game-21/` (Game 21 section)
3. **Game 21 Section** → `/games/game-21/game-21.html` (Play the game)

## Adding New Games

To add a new game:

1. Create a new folder in `/games/` (e.g., `/games/my-new-game/`)
2. Follow the same structure as `game-21/`
3. Update `/games/index.html` to include the new game card
4. Add the game to the shared navigation if needed

## Updated Navigation Links

All website navigation now points to `/games/` which shows the games landing page with:
- Game 21 (functional)
- Placeholder for future games
- Category filtering
- Responsive design

The games section is now properly organized and ready for future expansion!
