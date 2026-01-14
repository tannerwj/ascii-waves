/**
 * Export & Save
 * Functionality for exporting, saving, and sharing configurations
 */

class ExportManager {
  constructor(controls, renderer) {
    this.controls = controls;
    this.renderer = renderer;
    this.setupEventListeners();
  }

  /**
   * Setup export button event listeners
   */
  setupEventListeners() {
    const saveJsonBtn = document.getElementById('saveJSON');
    if (saveJsonBtn) {
      saveJsonBtn.addEventListener('click', () => this.saveJSON());
    }

    const loadJsonBtn = document.getElementById('loadJSON');
    const loadJsonInput = document.getElementById('loadJSONInput');
    if (loadJsonBtn && loadJsonInput) {
      loadJsonBtn.addEventListener('click', () => loadJsonInput.click());
      loadJsonInput.addEventListener('change', (e) => this.loadJSON(e.target.files[0]));
    }

    const screenshotBtn = document.getElementById('screenshot');
    if (screenshotBtn) {
      screenshotBtn.addEventListener('click', () => this.captureScreenshot());
    }

    const shareUrlBtn = document.getElementById('shareURL');
    if (shareUrlBtn) {
      shareUrlBtn.addEventListener('click', () => this.generateShareURL());
    }

    const copyFrameBtn = document.getElementById('copyFrame');
    if (copyFrameBtn) {
      copyFrameBtn.addEventListener('click', () => this.copyFrameToClipboard());
    }
  }

  /**
   * Save current configuration as JSON file
   */
  saveJSON() {
    const config = this.controls.getConfig();
    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const filename = `ascii-waves-config-${Date.now()}.json`;
    Utils.downloadBlob(blob, filename);
    this.showNotification('Configuration saved!');
  }

  /**
   * Load configuration from JSON file
   * @param {File} file - JSON file
   */
  async loadJSON(file) {
    if (!file) return;

    try {
      const text = await file.text();
      const config = JSON.parse(text);

      if (config.wave) {
        this.controls.waveEngine.updateConfig(config.wave);
      }
      if (config.visual) {
        this.renderer.updateConfig(config.visual);
      }
      if (config.characterSet) {
        this.controls.waveEngine.setCharacterSet(config.characterSet);
      }

      this.controls.updateUI();
      this.controls.saveToStorage();
      this.showNotification('Configuration loaded!');
    } catch (e) {
      console.error('Failed to load configuration:', e);
      this.showNotification('Failed to load configuration', 'error');
    }
  }

  /**
   * Capture current frame as PNG
   */
  async captureScreenshot() {
    try {
      const blob = await this.renderer.exportFrame();
      const filename = `ascii-waves-${Date.now()}.png`;
      Utils.downloadBlob(blob, filename);
      this.showNotification('Screenshot saved!');
    } catch (e) {
      console.error('Failed to capture screenshot:', e);
      this.showNotification('Failed to capture screenshot', 'error');
    }
  }

  /**
   * Generate and copy shareable URL
   */
  generateShareURL() {
    try {
      const config = this.controls.getConfig();
      const encoded = btoa(JSON.stringify(config));
      const url = `${window.location.origin}${window.location.pathname}#${encoded}`;

      // Copy to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          this.showNotification('Share URL copied to clipboard!');
        }).catch(() => {
          this.fallbackCopyText(url);
        });
      } else {
        this.fallbackCopyText(url);
      }
    } catch (e) {
      console.error('Failed to generate share URL:', e);
      this.showNotification('Failed to generate share URL', 'error');
    }
  }

  /**
   * Copy current frame to clipboard as image
   */
  async copyFrameToClipboard() {
    try {
      const blob = await this.renderer.exportFrame();

      if (navigator.clipboard && navigator.clipboard.write) {
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        this.showNotification('Frame copied to clipboard!');
      } else {
        this.showNotification('Clipboard API not supported', 'error');
      }
    } catch (e) {
      console.error('Failed to copy frame:', e);
      this.showNotification('Failed to copy frame', 'error');
    }
  }

  /**
   * Fallback copy method using textarea
   * @param {string} text - Text to copy
   */
  fallbackCopyText(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand('copy');
      this.showNotification('Share URL copied to clipboard!');
    } catch (e) {
      console.error('Failed to copy:', e);
      this.showNotification('Failed to copy URL', 'error');
    }

    document.body.removeChild(textarea);
  }

  /**
   * Show a temporary notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type ('success' or 'error')
   */
  showNotification(message, type = 'success') {
    // Check if notification element exists
    let notification = document.getElementById('notification');

    if (!notification) {
      // Create notification element
      notification = document.createElement('div');
      notification.id = 'notification';
      notification.className = 'notification';
      document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.className = `notification ${type} show`;

    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }
}

// Export for use in other modules
window.ExportManager = ExportManager;
