type LoadingListener = (isLoading: boolean, text: string) => void;

class LoadingManager {
  private listeners: Set<LoadingListener> = new Set();
  private _isLoading = false;
  private _loadingText = "Loading...";

  subscribe(listener: LoadingListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      listener(this._isLoading, this._loadingText);
    });
  }

  show(text = "Loading...") {
    this._isLoading = true;
    this._loadingText = text;
    this.notify();
  }

  hide() {
    this._isLoading = false;
    this.notify();
  }

  async withLoading<T>(fn: () => Promise<T>, text = "Loading..."): Promise<T> {
    this.show(text);
    try {
      return await fn();
    } finally {
      this.hide();
    }
  }

  get isLoading() {
    return this._isLoading;
  }

  get loadingText() {
    return this._loadingText;
  }
}

export const loadingManager = new LoadingManager();
