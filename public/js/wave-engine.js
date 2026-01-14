/**
 * Wave Engine
 * Core wave generation algorithm with multi-layer synthesis
 */

class WaveEngine {
  constructor(config = {}) {
    this.config = {
      amplitude: 0.8,
      speed: 1.0,
      frequency: 1.5,
      layers: 3,
      choppiness: 0.3,
      foamThreshold: 0.7,
      depthEffect: 0.5,
      noiseSeed: Math.floor(Math.random() * 999999),
      timeSpeed: 1.5,
      ...config
    };

    this.time = 0;
    this.noise = new SimplexNoise(this.config.noiseSeed);

    // Character sets for different intensities
    this.characterSets = {
      classic: {
        sky: [' ', '.', '·', '˙'],
        surface: ['~', '≈', '∼', '≋'],
        shallow: ['-', '=', '≡'],
        medium: ['░', '▒', '▓'],
        deep: ['█', '■', '▮'],
        foam: ['*', '※', '✦', '✱', '⁂']
      },
      minimal: {
        sky: [' ', ' ', '.', '.'],
        surface: ['~', '~', '-', '-'],
        shallow: ['-', '-', '=', '='],
        medium: ['=', '=', '#', '#'],
        deep: ['#', '#', '@', '@'],
        foam: ['*', '*', '+', '+', 'o']
      },
      dense: {
        sky: [' ', '·', '˙', '⋅'],
        surface: ['≈', '∽', '∼', '≋', '≃'],
        shallow: ['▁', '▂', '▃', '▄'],
        medium: ['▅', '▆', '▇', '█'],
        deep: ['█', '▓', '▒', '░'],
        foam: ['✦', '✧', '✶', '✷', '✸', '✹']
      },
      unicode: {
        sky: [' ', '∙', '·', '⋅', '•'],
        surface: ['〜', '～', '∿', '≈', '≋'],
        shallow: ['⎯', '⎼', '▬', '═'],
        medium: ['░', '▒', '▓', '█'],
        deep: ['█', '▉', '▊', '▋', '▌'],
        foam: ['⁕', '※', '✢', '✣', '✤', '✥']
      }
    };

    this.currentCharacterSet = 'classic';
  }

  /**
   * Update configuration
   * @param {Object} newConfig - New configuration values
   */
  updateConfig(newConfig) {
    Object.assign(this.config, newConfig);

    // Regenerate noise if seed changed
    if (newConfig.noiseSeed !== undefined) {
      this.noise = new SimplexNoise(this.config.noiseSeed);
    }
  }

  /**
   * Set character set
   * @param {string} setName - Name of character set
   */
  setCharacterSet(setName) {
    if (this.characterSets[setName]) {
      this.currentCharacterSet = setName;
    }
  }

  /**
   * Calculate wave value at a specific position and layer
   * @param {number} x - X coordinate (0-1 normalized)
   * @param {number} y - Y coordinate (0-1 normalized)
   * @param {number} layer - Layer index (0 = front, layers-1 = back)
   * @returns {number} Wave value (approximately -amplitude to +amplitude)
   */
  calculateWave(x, y, layer) {
    const layerDepth = layer / Math.max(this.config.layers, 1);
    const layerSpeed = this.config.speed * (1 - layerDepth * this.config.depthEffect);
    const layerAmplitude = this.config.amplitude * (1 - layerDepth * 0.3);

    // Base wave - combination of multiple sine waves
    let wave = 0;

    // Primary wave
    wave += Math.sin(x * this.config.frequency * Math.PI * 2 + this.time * layerSpeed) * layerAmplitude;

    // Secondary wave (different frequency and phase)
    wave += Math.sin(x * this.config.frequency * 1.5 * Math.PI * 2 + this.time * layerSpeed * 1.3) * layerAmplitude * 0.5;

    // Tertiary wave (higher frequency detail)
    wave += Math.sin(x * this.config.frequency * 2.5 * Math.PI * 2 + this.time * layerSpeed * 0.7) * layerAmplitude * 0.3;

    // Add noise for organic variation
    const noiseValue = this.noise.noise3D(
      x * this.config.frequency * 2,
      y * this.config.frequency * 2 + this.time * layerSpeed * 0.1,
      layer * 0.5
    );
    wave += noiseValue * this.config.choppiness * layerAmplitude;

    // Add vertical component (swell effect)
    wave += Math.sin(y * Math.PI + this.time * layerSpeed * 0.5) * layerAmplitude * 0.3;

    return wave;
  }

  /**
   * Select appropriate character based on wave value
   * @param {number} waveValue - Wave value from calculateWave
   * @param {number} layer - Layer index
   * @returns {string} Selected character
   */
  selectCharacter(waveValue, layer) {
    const charSet = this.characterSets[this.currentCharacterSet];

    // Normalize wave value to 0-1 range
    const normalized = Utils.clamp((waveValue / this.config.amplitude + 1) / 2, 0, 1);

    // Check for foam (wave peaks)
    if (normalized > this.config.foamThreshold && waveValue > 0) {
      const foamChars = charSet.foam;
      // Add some randomness to foam
      const index = Math.floor((Math.random() * 0.3 + normalized * 0.7) * foamChars.length);
      return foamChars[Math.min(index, foamChars.length - 1)];
    }

    // Select character based on intensity
    if (normalized > 0.75) {
      const chars = charSet.surface;
      const index = Math.floor((normalized - 0.75) * 4 * chars.length);
      return chars[Math.min(index, chars.length - 1)];
    } else if (normalized > 0.55) {
      const chars = charSet.shallow;
      const index = Math.floor((normalized - 0.55) * 5 * chars.length);
      return chars[Math.min(index, chars.length - 1)];
    } else if (normalized > 0.35) {
      const chars = charSet.medium;
      const index = Math.floor((normalized - 0.35) * 5 * chars.length);
      return chars[Math.min(index, chars.length - 1)];
    } else if (normalized > 0.15) {
      const chars = charSet.deep;
      const index = Math.floor((normalized - 0.15) * 5 * chars.length);
      return chars[Math.min(index, chars.length - 1)];
    } else {
      const chars = charSet.sky;
      const index = Math.floor(normalized * 6.67 * chars.length);
      return chars[Math.min(index, chars.length - 1)];
    }
  }

  /**
   * Update time for animation
   * @param {number} deltaTime - Time elapsed since last update (seconds)
   */
  update(deltaTime) {
    this.time += deltaTime * this.config.timeSpeed;
  }

  /**
   * Reset time to zero
   */
  resetTime() {
    this.time = 0;
  }

  /**
   * Get current configuration
   * @returns {Object} Current configuration
   */
  getConfig() {
    return { ...this.config };
  }
}

// Export for use in other modules
window.WaveEngine = WaveEngine;
