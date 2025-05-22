export class AudioManager {
  constructor(assetLoader = null) {
    this.sounds = {};

    try {
      if (assetLoader) {
        this.sounds = {
          click: assetLoader.getAudio('click') || this.createAudio('./sfx/click.ogg'),
          kick: assetLoader.getAudio('kick') || this.createAudio('./sfx/kick.mp3'),
          goal: assetLoader.getAudio('goal') || this.createAudio('./sfx/goal.ogg')
        };
      } else {
        this.sounds = {
          click: this.createAudio('./sfx/click.ogg'),
          kick: this.createAudio('./sfx/kick.mp3'),
          goal: this.createAudio('./sfx/goal.ogg')
        };
      }
    } catch (error) {
      console.warn('Error initializing audio:', error);
    }

    this.volume = 0.7;
    this.muted = false;

    this.setVolume(this.volume);

    this.setupGlobalControls();
  }

  playSound(soundName) {
    if (this.muted || !this.sounds[soundName]) return;

    try {
      const sound = this.sounds[soundName].cloneNode();
      if (!sound) return;

      sound.volume = this.volume;

      setTimeout(() => {
        sound.play().catch(err => {
          console.warn('Audio playback was prevented:', err);
        });
      }, 0);
    } catch (error) {
      console.warn(`Failed to play sound: ${soundName}`, error);
    }
  }

  createAudio(path) {
    try {
      const audio = new Audio(path);
      audio.volume = this.volume || 0.7;
      return audio;
    } catch (error) {
      console.warn(`Failed to load audio: ${path}`, error);
      return null;
    }
  }

  setVolume(level) {
    if (level < 0) level = 0;
    if (level > 1) level = 1;

    this.volume = level;

    Object.values(this.sounds).forEach(sound => {
      if (sound && typeof sound.volume !== 'undefined') {
        try {
          sound.volume = this.volume;
        } catch (error) {
          console.warn('Error setting volume:', error);
        }
      }
    });
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  setupGlobalControls() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'm' || e.key === 'M') {
        this.toggleMute();

        const muteStatus = document.createElement('div');
        muteStatus.className = 'mute-status';
        muteStatus.textContent = this.muted ? 'Sound Off' : 'Sound On';
        document.body.appendChild(muteStatus);

        setTimeout(() => {
          if (muteStatus.parentNode) {
            muteStatus.parentNode.removeChild(muteStatus);
          }
        }, 1500);
      }
    });
  }
}
