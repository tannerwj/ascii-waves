# ASCII Waves

Beautiful animated ocean waves rendered entirely in ASCII art with full customization and export capabilities.

[![Live Demo](https://img.shields.io/badge/demo-live-blue)](https://ascii-waves.pages.dev)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## Features

- **Multi-layer Ocean Waves**: Sophisticated wave algorithm with parallax depth effect
- **Full Customization**: 15+ adjustable parameters for wave physics and visual appearance
- **6 Preset Themes**: Ocean, Sunset, Storm, Calm Night, Tropical, Terminal
- **Export Options**: Save/load configurations, capture screenshots, share via URL, copy to clipboard
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile devices
- **Keyboard Shortcuts**: Quick access to common functions
- **Persistent Settings**: Automatically saves your preferences
- **Pure Vanilla JS**: No frameworks, fast loading, easy to understand

## Live Demo

Visit [ascii-waves.pages.dev](https://ascii-waves.pages.dev) to see it in action!

## How It Works

ASCII Waves uses a multi-layer wave generation algorithm that combines:
- **Sine wave synthesis**: Multiple sine waves at different frequencies create realistic ocean motion
- **Simplex noise**: Adds organic variation and prevents repetitive patterns
- **Character mapping**: Wave intensity determines which ASCII character to display
- **Depth simulation**: Multiple layers render with parallax effect for 3D illusion
- **Foam detection**: Wave peaks above threshold show foam characters

## Wave Parameters

### Wave Physics
- **Amplitude** (0.0-2.0): Controls wave height
- **Speed** (0.0-3.0): Animation speed
- **Frequency** (0.1-5.0): Wave density (peaks/troughs)
- **Layers** (1-5): Number of depth layers
- **Choppiness** (0.0-1.0): Noise-based wave irregularity
- **Foam Threshold** (0.0-1.0): When foam appears at peaks
- **Depth Effect** (0.0-1.0): Parallax strength between layers
- **Time Speed** (0.1-3.0): Global time multiplier

### Visual Appearance
- **Cell Size** (8-32px): Character size
- **Hue** (0-360°): Base color
- **Saturation** (0.0-1.0): Color intensity
- **Brightness** (-0.5 to 0.5): Overall lightness
- **Contrast** (0.5-2.0): Light/dark difference
- **Character Set**: Classic, Minimal, Dense, Unicode Extended

### Effects
- **Vignette Intensity** (0.0-1.0): Edge darkening amount
- **Vignette Radius** (0.0-1.0): Vignette spread

## Preset Themes

1. **Ocean**: Classic blue ocean waves with medium motion
2. **Sunset Waves**: Warm orange/red hues at dusk
3. **Storm**: Violent seas with high amplitude and speed
4. **Calm Night**: Peaceful deep blue nighttime ocean
5. **Tropical**: Bright turquoise tropical waters
6. **Terminal**: Retro green monochrome aesthetic

## Keyboard Shortcuts

- **1-6**: Load preset themes
- **Ctrl+S**: Capture screenshot
- **Ctrl+R**: Regenerate noise seed
- **Ctrl+Shift+C**: Copy share URL to clipboard

## Export & Share

- **Save Configuration**: Export settings as JSON file
- **Load Configuration**: Import previously saved JSON
- **Screenshot**: Export current frame as PNG
- **Share URL**: Generate shareable URL with embedded configuration
- **Copy Frame**: Copy current frame to clipboard

## Project Structure

```
ascii-waves/
├── public/
│   ├── index.html              # Main HTML page
│   ├── style.css               # Responsive styles
│   └── js/
│       ├── main.js             # Application entry point
│       ├── wave-engine.js      # Wave generation algorithm
│       ├── renderer.js         # Canvas rendering
│       ├── controls.js         # UI control management
│       ├── presets.js          # Preset definitions
│       ├── export.js           # Export/save functionality
│       ├── noise.js            # Simplex noise implementation
│       └── utils.js            # Utility functions
├── package.json                # Project metadata
├── LICENSE                     # MIT License
└── README.md                   # This file
```

## Development

### Local Development

```bash
# Clone the repository
git clone https://github.com/tannerwj/ascii-waves.git
cd ascii-waves

# Install dependencies (optional, only for deployment)
npm install

# Start local development server
npm run dev

# Or use any static file server, e.g.:
python -m http.server 8000 -d public
# Then visit http://localhost:8000
```

### Deployment

Deploy to Cloudflare Pages:

```bash
npm run deploy
```

Or deploy the `public/` directory to any static hosting service (Netlify, Vercel, GitHub Pages, etc.)

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support with touch-optimized controls

## Performance

- 60 FPS on desktop (1920x1080)
- 30+ FPS on mobile devices
- < 2 second initial load time
- < 100ms control response time
- No external dependencies except optional Cloudflare deployment tools

## Technical Details

### Wave Generation Algorithm

```javascript
wave = Σ(amplitude[i] * sin(frequency * x + time * speed * phase[i]))
     + noise(x, y, time) * choppiness
     + vertical_swell
```

### Character Sets

Characters are selected based on wave intensity:
- **Sky**: ` ` `.` `·` `˙` (above water)
- **Surface**: `~` `≈` `∼` `≋` (water surface)
- **Shallow**: `-` `=` `≡` (shallow depth)
- **Medium**: `░` `▒` `▓` (medium depth)
- **Deep**: `█` `■` `▮` (deep water)
- **Foam**: `*` `※` `✦` `✱` `⁂` (wave crests)

### Rendering Pipeline

1. Clear canvas with background color
2. For each layer (back to front):
   - Calculate wave values for entire grid
   - Select appropriate characters
   - Calculate colors with depth modulation
   - Render characters to canvas
3. Apply vignette post-processing effect

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- Wave algorithm inspired by ocean simulation techniques
- Simplex noise implementation based on Stefan Gustavson's work
- Design inspired by [ASCII Clouds by Caidan](https://caidan.dev/portfolio/ascii_clouds/)

## Author

Created by Tanner with Claude Sonnet 4.5

## Links

- **Live Demo**: [ascii-waves.pages.dev](https://ascii-waves.pages.dev)
- **GitHub**: [github.com/tannerwj/ascii-waves](https://github.com/tannerwj/ascii-waves)
- **Issues**: [Report bugs or request features](https://github.com/tannerwj/ascii-waves/issues)

---

Made with ❤️ and ASCII art
