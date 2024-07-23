import {
  Action,
  action,
  DialDownEvent,
  DialRotateEvent,
  DidReceiveSettingsEvent,
  SingletonAction,
  WillAppearEvent,
} from "@elgato/streamdeck";
import bgm from "../backgroundmusic";

type VolumeDialState = {
  muted: boolean;
  volume: number;

  disabled?: boolean;
};

@action({ UUID: "dev.mantha.backgroundmusic-streamdeck.volume" })
export class VolumeDial extends SingletonAction<VolumeSettings> {
  private dials: { [key: string]: VolumeDialState } = {};

  async onWillAppear(ev: WillAppearEvent<VolumeSettings>): Promise<void> {
    await this.initializeDialState(ev.action, ev.payload.settings);
  }

  async onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<VolumeSettings>,
  ): Promise<void> {
    await this.initializeDialState(ev.action, ev.payload.settings);
  }

  async onDialRotate(ev: DialRotateEvent<VolumeSettings>): Promise<void> {
    const state = this.getDialState(ev.action.id);

    if (state.disabled || state.muted) {
      return;
    }

    const steps = ev.payload.settings.steps ?? 1;
    const newVolume = clamp(state.volume + ev.payload.ticks * steps, 0, 100);
    state.volume = newVolume;

    this.setDialState(ev.action.id, state);
    await ev.action.setFeedback({
      value: newVolume == 0 ? "Muted" : newVolume,
      indicator: newVolume,
    });
    await bgm.setVolume(ev.payload.settings.identifier, newVolume);
  }

  async onDialDown(ev: DialDownEvent<VolumeSettings>): Promise<void> {
    const state = this.getDialState(ev.action.id);
    if (state.disabled) {
      return;
    }
    const muted = !state.muted;

    const newVolume = muted ? 0 : state.volume;
    state.muted = muted;

    this.setDialState(ev.action.id, state);
    await ev.action.setFeedback({
      value: newVolume == 0 ? "Muted" : newVolume,
      indicator: newVolume,
    });
    await bgm.setVolume(ev.payload.settings.identifier, newVolume);
  }

  async initializeDialState(
    action: Action<VolumeSettings>,
    settings: VolumeSettings,
  ) {
    const state = this.getDialState(action.id);
    let volume: number;
    try {
      volume = await bgm.getVolume(settings.identifier);
    } catch (e) {
      action.showAlert();
      state.disabled = true;
      this.setDialState(action.id, state);
      await action.setFeedback({
        value: "Error",
        indicator: {
          value: 0,
        },
      });
      return;
    }

    state.volume = volume;
    state.disabled = false;
    this.setDialState(action.id, state);
    await action.setFeedback({
      value: volume,
      indicator: {
        value: volume,
      },
    });
    action.showOk();
  }

  getDialState(id: string): VolumeDialState {
    const state = this.dials[id];
    if (state == null) {
      const defaultState = {
        muted: false,
        volume: 50,
      };

      this.dials[id] = defaultState;
      return defaultState;
    }

    return state;
  }

  setDialState(id: string, state: VolumeDialState) {
    this.dials[id] = state;
  }
}

/**
 * Settings for {@link VolumeDial}.
 */
type VolumeSettings = {
  identifier: string;
  steps: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
