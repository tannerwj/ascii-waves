/**
 * Canvas Renderer
 * Handles all canvas rendering, color calculations, and visual effects
 */

class Renderer {
  constructor(canvas, waveEngine) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.waveEngine = waveEngine;

    this.config = {
      cellSize: 16,
      hue: 200,
      saturation: 0.6,
      brightness: 0.0,
      contrast: 1.0,
      vignetteIntensity: 0.4,
      vignetteRadius: 0.6
    };

    this.gridWidth = 0;
    this.gridHeight = 0;
    this.lastTime = 0;

    this.resizeCanvas();
    window.addEventListener('resize', Utils.debounce(() => this.resizeCanvas(), 250));
  }

  /**
   * Resize canvas to fill window
   */
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.gridWidth = Math.ceil(this.canvas.width / this.config.cellSize);
    this.gridHeight = Math.ceil(this.canvas.height / this.config.cellSize);

    // Setup text rendering
    this.ctx.font = `${this.config.cellSize}px monospace`;
    this.ctx.textBaseline = 'top';
  }

  /**
   * Update configuration
   * @param {Object} newConfig - New configuration values
   */
  updateConfig(newConfig) {
    const oldCellSize = this.config.cellSize;
    Object.assign(this.config, newConfig);

    // Recalculate grid if cell size changed
    if (newConfig.cellSize !== undefined && newConfig.cellSize !== oldCellSize) {
      this.gridWidth = Math.ceil(this.canvas.width / this.config.cellSize);
      this.gridHeight = Math.ceil(this.canvas.height / this.config.cellSize);
      this.ctx.font = `${this.config.cellSize}px monospace`;
    }
  }

  /**
   * Calculate color for a given wave value and layer
   * @param {number} waveValue - Wave value
   * @param {number} layerDepth - Layer depth (0-1, 0 = front)
   * @returns {string} RGB color string
   */
  calculateColor(waveValue, layerDepth) {
    const waveConfig = this.waveEngine.config;

    // Normalize wave value to 0-1
    const normalized = Utils.clamp((waveValue / waveConfig.amplitude + 1) / 2, 0, 1);

    // Base lightness from config
    let lightness = 0.5 + this.config.brightness;

    // Modulate lightness based on wave value (peaks brighter, troughs darker)
    lightness *= (0.5 + normalized * 0.5) * this.config.contrast;

    // Darken based on layer depth (back layers darker for depth effect)
    lightness *= 1 - layerDepth * waveConfig.depthEffect * 0.5;

    // Clamp lightness
    lightness = Utils.clamp(lightness, 0, 1);

    // Convert HSL to RGB
    const [r, g, b] = Utils.hslToRgb(this.config.hue, this.config.saturation, lightness);

    return `rgb(${r}, ${g}, ${b})`;
  }

  /**
   * Apply vignette effect
   */
  applyVignette() {
    if (this.config.vignetteIntensity <= 0) return;

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);
    const vignetteRadius = maxRadius * this.config.vignetteRadius;

    const gradient = this.ctx.createRadialGradient(
      centerX, centerY, vignetteRadius,
      centerX, centerY, maxRadius
    );

    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, `rgba(0, 0, 0, ${this.config.vignetteIntensity})`);

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Render a single frame
   * @param {number} timestamp - Current timestamp in milliseconds
   */
  render(timestamp) {
    // Calculate delta time
    const deltaTime = this.lastTime ? (timestamp - this.lastTime) / 1000 : 0;
    this.lastTime = timestamp;

    // Update wave engine
    this.waveEngine.update(deltaTime);

    // Clear canvas with background color
    const bgColor = this.calculateColor(-this.waveEngine.config.amplitude, 1);
    this.ctx.fillStyle = bgColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Render layers (back to front)
    for (let layer = this.waveEngine.config.layers - 1; layer >= 0; layer--) {
      const layerDepth = layer / Math.max(this.waveEngine.config.layers, 1);

      // Render grid for this layer
      for (let gridY = 0; gridY < this.gridHeight; gridY++) {
        for (let gridX = 0; gridX < this.gridWidth; gridX++) {
          // Normalize coordinates to 0-1
          const x = gridX / this.gridWidth;
          const y = gridY / this.gridHeight;

          // Calculate wave value
          const waveValue = this.waveEngine.calculateWave(x, y, layer);

          // Select character
          const char = this.waveEngine.selectCharacter(waveValue, layer);

          // Skip rendering space characters (optimization)
          if (char === ' ') continue;

          // Calculate color
          const color = this.calculateColor(waveValue, layerDepth);

          // Draw character
          this.ctx.fillStyle = color;
          this.ctx.fillText(
            char,
            gridX * this.config.cellSize,
            gridY * this.config.cellSize
          );
        }
      }
    }

    // Apply vignette effect
    this.applyVignette();
  }

  /**
   * Start rendering loop
   */
  start() {
    const animate = (timestamp) => {
      this.render(timestamp);
      this.animationId = requestAnimationFrame(animate);
    };
    this.animationId = requestAnimationFrame(animate);
  }

  /**
   * Stop rendering loop
   */
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Get current configuration
   * @returns {Object} Current configuration
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Export current frame as PNG
   * @returns {Promise<Blob>} PNG blob
   */
  async exportFrame() {
    return new Promise((resolve) => {
      this.canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
  }

  /**
   * Get canvas data URL
   * @returns {string} Data URL
   */
  getDataURL() {
    return this.canvas.toDataURL('image/png');
  }
}

// Export for use in other modules
window.Renderer = Renderer;
