import freeton from "freeton";
import semver from "semver";

export default {
  async isExtensionAvailableWithMinimalVersion() {
    return new Promise(resolve => {
      if (typeof window.freeton === 'undefined') {
        resolve(false);
      }
      const provider = new freeton.providers.ExtensionProvider(window.freeton);
      provider.getVersion().then(data => {
        const currentVersion = data.version || '0.0.0';
        resolve(semver.satisfies(currentVersion, '>=0.5.0'));
      }).catch(() => {
        resolve(false);
      });
    });
  }
}
