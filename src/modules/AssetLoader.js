export class AssetLoader {
  constructor() {
    this.totalAssets = 0;
    this.loadedAssets = 0;
    this.isLoading = false;
    this.imageAssets = [
      './img/attackBlack.jpg',
      './img/attackBlue.jpg',
      './img/attackBrown.jpg',
      './img/attackRed.jpg',
      './img/attackGolden.jpg',
      './img/goalBlack.jpg',
      './img/goalBlue.jpg',
      './img/goalBrown.jpg',
      './img/goalRed.jpg',
      './img/goalGolden.jpg',
      './img/cardBack.jpg',
      './img/soccer-bg.jpg'
    ];

    this.audioAssets = [
      './sfx/click.ogg',
      './sfx/goal.ogg',
      './sfx/kick.mp3'
    ];

    this.images = {};
    this.audio = {};
  }

  preloadAssets(progressCallback, completeCallback) {
    if (this.isLoading) return;

    this.isLoading = true;
    this.loadedAssets = 0;
    this.totalAssets = this.imageAssets.length + this.audioAssets.length;
    this.progressCallback = progressCallback;
    this.completeCallback = completeCallback;

    this.createLoadingScreen();
    this.loadAllImages();
    this.loadAllAudio();
  }

  loadAllImages() {
    this.imageAssets.forEach(path => {
      const img = new Image();
      img.onload = () => this.onAssetLoaded();
      img.onerror = () => this.onAssetLoaded();

      const key = path.split('/').pop().split('.')[0];
      this.images[key] = img;

      img.src = path;
    });
  }

  loadAllAudio() {
    this.audioAssets.forEach(path => {
      const audio = new Audio();
      audio.oncanplaythrough = () => this.onAssetLoaded();
      audio.onerror = () => this.onAssetLoaded();

      const key = path.split('/').pop().split('.')[0];
      this.audio[key] = audio;

      audio.src = path;
    });
  }

  onAssetLoaded() {
    this.loadedAssets++;

    const progress = Math.floor((this.loadedAssets / this.totalAssets) * 100);

    this.updateLoadingScreen(progress);

    if (this.progressCallback && typeof this.progressCallback === 'function') {
      this.progressCallback(progress);
    }

    if (this.loadedAssets >= this.totalAssets) {
      this.isLoading = false;
      setTimeout(() => {
        this.removeLoadingScreen();
        if (this.completeCallback && typeof this.completeCallback === 'function') {
          this.completeCallback();
        }
      }, 500);
    }
  }

  createLoadingScreen() {
    if (document.getElementById('loading-screen')) return;

    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'loading-screen';
    loadingScreen.style.position = 'fixed';
    loadingScreen.style.top = '0';
    loadingScreen.style.left = '0';
    loadingScreen.style.width = '100%';
    loadingScreen.style.height = '100%';
    loadingScreen.style.background = 'rgba(0, 0, 0, 0.8)';
    loadingScreen.style.display = 'flex';
    loadingScreen.style.flexDirection = 'column';
    loadingScreen.style.justifyContent = 'center';
    loadingScreen.style.alignItems = 'center';
    loadingScreen.style.zIndex = '9999';

    const title = document.createElement('h1');
    title.textContent = 'Soccer Card Game';
    title.style.color = 'white';
    title.style.fontSize = '3rem';
    title.style.marginBottom = '2rem';

    const loadingText = document.createElement('div');
    loadingText.id = 'loading-text';
    loadingText.textContent = 'Loading assets...';
    loadingText.style.color = 'white';
    loadingText.style.fontSize = '1.5rem';
    loadingText.style.marginBottom = '1rem';

    const progressContainer = document.createElement('div');
    progressContainer.style.width = '300px';
    progressContainer.style.height = '20px';
    progressContainer.style.border = '2px solid white';
    progressContainer.style.borderRadius = '10px';
    progressContainer.style.overflow = 'hidden';

    const progressBar = document.createElement('div');
    progressBar.id = 'loading-progress';
    progressBar.style.width = '0%';
    progressBar.style.height = '100%';
    progressBar.style.background = 'linear-gradient(to right, #4CAF50, #8BC34A)';
    progressBar.style.transition = 'width 0.3s ease-in-out';

    progressContainer.appendChild(progressBar);
    loadingScreen.appendChild(title);
    loadingScreen.appendChild(loadingText);
    loadingScreen.appendChild(progressContainer);

    document.body.appendChild(loadingScreen);
    document.body.appendChild(loadingScreen);
  }

  updateLoadingScreen(progress) {
    const progressBar = document.getElementById('loading-progress');
    const loadingText = document.getElementById('loading-text');

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (loadingText) {
      loadingText.textContent = `Loading assets... ${progress}%`;
    }
  }

  removeLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');

    if (loadingScreen) {
      loadingScreen.style.transition = 'opacity 0.5s ease-in-out';
      loadingScreen.style.opacity = '0';

      setTimeout(() => {
        if (loadingScreen.parentNode) {
          loadingScreen.parentNode.removeChild(loadingScreen);
        }
      }, 500);
    }
  }

  getImage(key) {
    return this.images[key] || null;
  }

  getAudio(key) {
    return this.audio[key] ? this.audio[key].cloneNode() : null;
  }
}
