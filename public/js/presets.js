/**
 * Preset Themes
 * Pre-configured theme definitions and management
 */

const Presets = {
  themes: {
    ocean: {
      name: 'Ocean',
      description: 'Classic blue ocean waves',
      wave: {
        amplitude: 0.8,
        speed: 1.0,
        frequency: 1.5,
        layers: 3,
        choppiness: 0.3,
        foamThreshold: 0.7,
        depthEffect: 0.5,
        timeSpeed: 1.5
      },
      visual: {
        cellSize: 16,
        hue: 200,
        saturation: 0.6,
        brightness: 0.0,
        contrast: 1.0,
        vignetteIntensity: 0.4,
        vignetteRadius: 0.6
      },
      characterSet: 'classic'
    },

    sunset: {
      name: 'Sunset Waves',
      description: 'Warm orange and red ocean at dusk',
      wave: {
        amplitude: 0.6,
        speed: 0.7,
        frequency: 1.2,
        layers: 4,
        choppiness: 0.2,
        foamThreshold: 0.8,
        depthEffect: 0.6,
        timeSpeed: 1.2
      },
      visual: {
        cellSize: 16,
        hue: 20,
        saturation: 0.8,
        brightness: 0.1,
        contrast: 1.3,
        vignetteIntensity: 0.6,
        vignetteRadius: 0.5
      },
      characterSet: 'minimal'
    },

    storm: {
      name: 'Storm',
      description: 'Violent stormy seas',
      wave: {
        amplitude: 1.5,
        speed: 2.0,
        frequency: 2.5,
        layers: 5,
        choppiness: 0.8,
        foamThreshold: 0.6,
        depthEffect: 0.7,
        timeSpeed: 2.0
      },
      visual: {
        cellSize: 14,
        hue: 200,
        saturation: 0.3,
        brightness: -0.2,
        contrast: 1.5,
        vignetteIntensity: 0.7,
        vignetteRadius: 0.4
      },
      characterSet: 'dense'
    },

    night: {
      name: 'Calm Night',
      description: 'Peaceful nighttime ocean',
      wave: {
        amplitude: 0.4,
        speed: 0.5,
        frequency: 0.8,
        layers: 2,
        choppiness: 0.1,
        foamThreshold: 0.9,
        depthEffect: 0.4,
        timeSpeed: 1.0
      },
      visual: {
        cellSize: 18,
        hue: 240,
        saturation: 0.4,
        brightness: -0.3,
        contrast: 1.2,
        vignetteIntensity: 0.8,
        vignetteRadius: 0.5
      },
      characterSet: 'minimal'
    },

    tropical: {
      name: 'Tropical',
      description: 'Bright turquoise tropical waters',
      wave: {
        amplitude: 0.7,
        speed: 0.8,
        frequency: 1.8,
        layers: 3,
        choppiness: 0.4,
        foamThreshold: 0.7,
        depthEffect: 0.5,
        timeSpeed: 1.3
      },
      visual: {
        cellSize: 16,
        hue: 180,
        saturation: 0.9,
        brightness: 0.2,
        contrast: 1.1,
        vignetteIntensity: 0.3,
        vignetteRadius: 0.7
      },
      characterSet: 'classic'
    },

    terminal: {
      name: 'Terminal',
      description: 'Retro monochrome terminal aesthetic',
      wave: {
        amplitude: 0.9,
        speed: 1.2,
        frequency: 1.5,
        layers: 3,
        choppiness: 0.5,
        foamThreshold: 0.75,
        depthEffect: 0.3,
        timeSpeed: 1.5
      },
      visual: {
        cellSize: 14,
        hue: 120,
        saturation: 1.0,
        brightness: 0.0,
        contrast: 2.0,
        vignetteIntensity: 0.2,
        vignetteRadius: 0.8
      },
      characterSet: 'minimal'
    }
  },

  /**
   * Get a preset by key
   * @param {string} key - Preset key
   * @returns {Object|null} Preset configuration or null if not found
   */
  get(key) {
    return this.themes[key] || null;
  },

  /**
   * Get all preset keys
   * @returns {Array<string>} Array of preset keys
   */
  getKeys() {
    return Object.keys(this.themes);
  },

  /**
   * Get all preset names
   * @returns {Array<Object>} Array of {key, name} objects
   */
  getList() {
    return Object.entries(this.themes).map(([key, preset]) => ({
      key,
      name: preset.name,
      description: preset.description
    }));
  },

  /**
   * Apply a preset to wave engine and renderer
   * @param {string} key - Preset key
   * @param {WaveEngine} waveEngine - Wave engine instance
   * @param {Renderer} renderer - Renderer instance
   * @returns {boolean} True if preset was applied
   */
  apply(key, waveEngine, renderer) {
    const preset = this.get(key);
    if (!preset) return false;

    // Apply wave configuration
    waveEngine.updateConfig(preset.wave);
    waveEngine.setCharacterSet(preset.characterSet);

    // Apply visual configuration
    renderer.updateConfig(preset.visual);

    return true;
  },

  /**
   * Create a custom preset from current configuration
   * @param {WaveEngine} waveEngine - Wave engine instance
   * @param {Renderer} renderer - Renderer instance
   * @returns {Object} Preset configuration
   */
  createFromCurrent(waveEngine, renderer) {
    return {
      name: 'Custom',
      description: 'User-defined configuration',
      wave: waveEngine.getConfig(),
      visual: renderer.getConfig(),
      characterSet: waveEngine.currentCharacterSet
    };
  }
};

// Export for use in other modules
window.Presets = Presets;
