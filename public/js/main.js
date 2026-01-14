/**
 * Main Application
 * Entry point that initializes and coordinates all modules
 */

class App {
  constructor() {
    this.canvas = document.getElementById('canvas');
    if (!this.canvas) {
      console.error('Canvas element not found');
      return;
    }

    // Initialize wave engine
    this.waveEngine = new WaveEngine();

    // Initialize renderer
    this.renderer = new Renderer(this.canvas, this.waveEngine);

    // Initialize controls
    this.controls = new Controls(this.waveEngine, this.renderer);

    // Initialize export manager
    this.exportManager = new ExportManager(this.controls, this.renderer);

    // Start rendering
    this.renderer.start();

    // Setup keyboard shortcuts
    this.setupKeyboardShortcuts();

    console.log('ASCII Waves initialized');
  }

  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Space: Pause/Resume (if we add this feature)
      // S: Screenshot
      if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.exportManager.captureScreenshot();
      }

      // C: Copy share URL
      if (e.key === 'c' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        this.exportManager.generateShareURL();
      }

      // R: Regenerate seed
      if (e.key === 'r' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const newSeed = Utils.randomInt(0, 999999);
        this.waveEngine.updateConfig({ noiseSeed: newSeed });
        this.controls.updateUI();
        this.controls.saveToStorage();
      }

      // Number keys 1-6: Load presets
      const presetKeys = ['ocean', 'sunset', 'storm', 'night', 'tropical', 'terminal'];
      const num = parseInt(e.key);
      if (num >= 1 && num <= 6 && !e.ctrlKey && !e.metaKey) {
        this.controls.applyPreset(presetKeys[num - 1]);
      }
    });
  }

  /**
   * Stop the application
   */
  stop() {
    this.renderer.stop();
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
  });
} else {
  window.app = new App();
}
