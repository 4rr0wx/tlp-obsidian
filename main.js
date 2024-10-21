const { Plugin } = require('obsidian');

class CustomTLPPlugin extends Plugin {
  onload() {
    console.log('Loading Custom TLP Plugin');

    // Event-Listener für Datei-Öffnung
    this.registerEvent(this.app.workspace.on('file-open', this.updateTLPBanner.bind(this)));

    // Event-Listener für Änderungen im Cache
    this.registerEvent(this.app.metadataCache.on('changed', this.updateTLPBanner.bind(this)));

    // Event-Listener für Wechsel des aktiven Blatts
    this.registerEvent(this.app.workspace.on('active-leaf-change', this.updateTLPBanner.bind(this)));

    // Initialer Aufruf bei Plugin-Start
    this.updateTLPBanner();
  }

  onunload() {
    console.log('Unloading Custom TLP Plugin');
    this.clearTLPBanner();
  }

  updateTLPBanner() {
    const activeLeaf = this.app.workspace.activeLeaf;
    if (!activeLeaf || !activeLeaf.view || !activeLeaf.view.containerEl) {
      this.clearTLPBanner();
      return;
    }

    // Check if the container is an editor
    if (!activeLeaf.view.containerEl.classList.contains('workspace-leaf-content')) {
      this.clearTLPBanner();
      return;
    }

    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) {
      this.clearTLPBanner();
      return;
    }

    const frontMatter = this.app.metadataCache.getFileCache(activeFile)?.frontmatter;
    if (frontMatter && frontMatter.TLP) {
      const tlp = frontMatter.TLP.toUpperCase();
      document.body.setAttribute('data-tlp', tlp);
      document.body.classList.add('tlp-active');

      this.clearTLPBanner();
      const banner = document.createElement('div');
      banner.classList.add('tlp-banner', `tlp-${tlp.toLowerCase().replace('+', '-')}`);
      banner.innerText = `TLP: ${tlp}`;
      activeLeaf.view.containerEl.prepend(banner); // Banner in das Editor-Fenster einfügen
    } else {
      this.clearTLPBanner();
    }
  }

  clearTLPBanner() {
    document.body.classList.remove('tlp-active');
    document.querySelectorAll('.workspace-leaf-content .tlp-banner').forEach(el => el.remove());
  }
}

module.exports = CustomTLPPlugin;
