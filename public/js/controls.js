/**
 * Controls
 * UI control panel management, event handlers, and state persistence
 */

class Controls {
  constructor(waveEngine, renderer) {
    this.waveEngine = waveEngine;
    this.renderer = renderer;
    this.isUpdating = false;

    this.setupEventListeners();
    this.loadFromStorage();
    this.loadFromURL();
    this.updateUI();
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Wave physics controls
    this.addSliderListener('amplitude', (value) => {
      this.waveEngine.updateConfig({ amplitude: parseFloat(value) });
    });

    this.addSliderListener('speed', (value) => {
      this.waveEngine.updateConfig({ speed: parseFloat(value) });
    });

    this.addSliderListener('frequency', (value) => {
      this.waveEngine.updateConfig({ frequency: parseFloat(value) });
    });

    this.addSliderListener('layers', (value) => {
      this.waveEngine.updateConfig({ layers: parseInt(value) });
    });

    this.addSliderListener('choppiness', (value) => {
      this.waveEngine.updateConfig({ choppiness: parseFloat(value) });
    });

    this.addSliderListener('foamThreshold', (value) => {
      this.waveEngine.updateConfig({ foamThreshold: parseFloat(value) });
    });

    this.addSliderListener('depthEffect', (value) => {
      this.waveEngine.updateConfig({ depthEffect: parseFloat(value) });
    });

    this.addSliderListener('timeSpeed', (value) => {
      this.waveEngine.updateConfig({ timeSpeed: parseFloat(value) });
    });

    // Visual appearance controls
    this.addSliderListener('cellSize', (value) => {
      this.renderer.updateConfig({ cellSize: parseInt(value) });
    });

    this.addSliderListener('hue', (value) => {
      this.renderer.updateConfig({ hue: parseFloat(value) });
    });

    this.addSliderListener('saturation', (value) => {
      this.renderer.updateConfig({ saturation: parseFloat(value) });
    });

    this.addSliderListener('brightness', (value) => {
      this.renderer.updateConfig({ brightness: parseFloat(value) });
    });

    this.addSliderListener('contrast', (value) => {
      this.renderer.updateConfig({ contrast: parseFloat(value) });
    });

    this.addSliderListener('vignetteIntensity', (value) => {
      this.renderer.updateConfig({ vignetteIntensity: parseFloat(value) });
    });

    this.addSliderListener('vignetteRadius', (value) => {
      this.renderer.updateConfig({ vignetteRadius: parseFloat(value) });
    });

    // Character set selector
    const charSetSelect = document.getElementById('characterSet');
    if (charSetSelect) {
      charSetSelect.addEventListener('change', (e) => {
        this.waveEngine.setCharacterSet(e.target.value);
        this.saveToStorage();
      });
    }

    // Seed regeneration
    const seedBtn = document.getElementById('regenerateSeed');
    if (seedBtn) {
      seedBtn.addEventListener('click', () => {
        const newSeed = Utils.randomInt(0, 999999);
        this.waveEngine.updateConfig({ noiseSeed: newSeed });
        this.updateUI();
        this.saveToStorage();
      });
    }

    // Preset buttons
    document.querySelectorAll('[data-preset]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const presetKey = e.target.dataset.preset;
        this.applyPreset(presetKey);
      });
    });

    // Collapsible sections
    document.querySelectorAll('.section-header').forEach(header => {
      header.addEventListener('click', () => {
        const section = header.parentElement;
        section.classList.toggle('collapsed');
      });
    });

    // Mobile panel toggle
    const toggleBtn = document.getElementById('togglePanel');
    const controlPanel = document.getElementById('controlPanel');
    if (toggleBtn && controlPanel) {
      toggleBtn.addEventListener('click', () => {
        controlPanel.classList.toggle('expanded');
      });
    }

    // Save changes to localStorage when any control changes
    document.querySelectorAll('input[type="range"], select').forEach(input => {
      input.addEventListener('change', () => {
        if (!this.isUpdating) {
          this.saveToStorage();
        }
      });
    });
  }

  /**
   * Add slider listener with value display update
   * @param {string} id - Element ID
   * @param {Function} callback - Callback function
   */
  addSliderListener(id, callback) {
    const slider = document.getElementById(id);
    const display = document.getElementById(id + 'Value');

    if (slider) {
      slider.addEventListener('input', (e) => {
        const value = e.target.value;
        callback(value);
        if (display) {
          display.textContent = value;
        }
      });
    }
  }

  /**
   * Update UI to reflect current state
   */
  updateUI() {
    this.isUpdating = true;

    const waveConfig = this.waveEngine.getConfig();
    const renderConfig = this.renderer.getConfig();

    // Update wave controls
    this.updateSlider('amplitude', waveConfig.amplitude);
    this.updateSlider('speed', waveConfig.speed);
    this.updateSlider('frequency', waveConfig.frequency);
    this.updateSlider('layers', waveConfig.layers);
    this.updateSlider('choppiness', waveConfig.choppiness);
    this.updateSlider('foamThreshold', waveConfig.foamThreshold);
    this.updateSlider('depthEffect', waveConfig.depthEffect);
    this.updateSlider('timeSpeed', waveConfig.timeSpeed);

    // Update visual controls
    this.updateSlider('cellSize', renderConfig.cellSize);
    this.updateSlider('hue', renderConfig.hue);
    this.updateSlider('saturation', renderConfig.saturation);
    this.updateSlider('brightness', renderConfig.brightness);
    this.updateSlider('contrast', renderConfig.contrast);
    this.updateSlider('vignetteIntensity', renderConfig.vignetteIntensity);
    this.updateSlider('vignetteRadius', renderConfig.vignetteRadius);

    // Update character set
    const charSetSelect = document.getElementById('characterSet');
    if (charSetSelect) {
      charSetSelect.value = this.waveEngine.currentCharacterSet;
    }

    this.isUpdating = false;
  }

  /**
   * Update a slider and its display value
   * @param {string} id - Element ID
   * @param {number} value - New value
   */
  updateSlider(id, value) {
    const slider = document.getElementById(id);
    const display = document.getElementById(id + 'Value');

    if (slider) {
      slider.value = value;
      if (display) {
        display.textContent = value;
      }
    }
  }

  /**
   * Apply a preset
   * @param {string} presetKey - Preset key
   */
  applyPreset(presetKey) {
    const success = Presets.apply(presetKey, this.waveEngine, this.renderer);
    if (success) {
      this.updateUI();
      this.saveToStorage();
    }
  }

  /**
   * Save current configuration to localStorage
   */
  saveToStorage() {
    const config = {
      wave: this.waveEngine.getConfig(),
      visual: this.renderer.getConfig(),
      characterSet: this.waveEngine.currentCharacterSet
    };
    Utils.storage.set('asciiWavesConfig', config);
  }

  /**
   * Load configuration from localStorage
   */
  loadFromStorage() {
    const config = Utils.storage.get('asciiWavesConfig');
    if (config) {
      if (config.wave) {
        this.waveEngine.updateConfig(config.wave);
      }
      if (config.visual) {
        this.renderer.updateConfig(config.visual);
      }
      if (config.characterSet) {
        this.waveEngine.setCharacterSet(config.characterSet);
      }
    }
  }

  /**
   * Load configuration from URL hash
   */
  loadFromURL() {
    const hash = window.location.hash.substring(1);
    if (!hash) return;

    try {
      const config = JSON.parse(atob(hash));
      if (config.wave) {
        this.waveEngine.updateConfig(config.wave);
      }
      if (config.visual) {
        this.renderer.updateConfig(config.visual);
      }
      if (config.characterSet) {
        this.waveEngine.setCharacterSet(config.characterSet);
      }
    } catch (e) {
      console.error('Failed to load configuration from URL:', e);
    }
  }

  /**
   * Get current configuration
   * @returns {Object} Current configuration
   */
  getConfig() {
    return {
      wave: this.waveEngine.getConfig(),
      visual: this.renderer.getConfig(),
      characterSet: this.waveEngine.currentCharacterSet
    };
  }
}

// Export for use in other modules
window.Controls = Controls;
