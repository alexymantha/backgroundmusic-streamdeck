import { runAppleScript } from "run-applescript";

class BackgroundMusic {
  async getVolume(identifier: string): Promise<number> {
    const qualifier = this.detectApplication(identifier);
    const result = await runAppleScript(`
            tell application "Background Music"
                set appVol to (vol of (a reference to (the first audio application whose ${qualifier} is equal to "${identifier}")))
            end tell
        `);
    return parseInt(result);
  }

  async setVolume(identifier: string, volume: number): Promise<void> {
    const qualifier = this.detectApplication(identifier);
    await runAppleScript(`
            tell application "Background Music"
                set vol of (a reference to (the first audio application whose ${qualifier} is equal to "${identifier}")) to ${volume}
            end tell
        `);
  }

  /**
   * Detects if the provided application is a name or a bundle ID.
   * Initializes a new instance of the {@see Action} class.
   * @param Application field value from {@see VolumeSettings}
   * @returns {@see ApplicationType}
   */
  private detectApplication(identifier: string): ApplicationType {
    if (identifier.includes(".")) {
      return "bundleID";
    }

    return "name";
  }
}

type ApplicationType = "name" | "bundleID";

export default new BackgroundMusic();
