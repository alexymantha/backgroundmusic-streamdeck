import { runAppleScript } from "run-applescript";

class BackgroundMusic {
  /**
   * Gets the volume value of the specified application.
   * @param Identifier of the application. Either a name or a bundle ID.
   * @returns Volume value of the application.
   */
  async getVolume(identifier: string): Promise<number> {
    const qualifier = this.detectApplication(identifier);
    const result = await runAppleScript(`
            tell application "Background Music"
                set appVol to (vol of (a reference to (the first audio application whose ${qualifier} is equal to "${identifier}")))
            end tell
        `);
    return parseInt(result);
  }

  /**
   * Sets the volume of the specified application to the provided value.
   * @param Identifier of the application. Either a name or a bundle ID.
   * @param Volume value to set the application to.
   */
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
