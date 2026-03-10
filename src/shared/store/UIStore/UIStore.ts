import { makeAutoObservable, reaction, runInAction } from "mobx";

export default class UIStore {
    theme = 'light';

    constructor() {
        makeAutoObservable(this);

        if (typeof window !== 'undefined') {
            reaction(
                () => this.theme,
                (theme) => {
                    localStorage.setItem('app-theme', theme);
                    document.body.setAttribute('data-theme', theme);
                }
            );
        }
    }

    initTheme = () => {
        const savedTheme = localStorage.getItem('app-theme');
        if (savedTheme && savedTheme !== this.theme) {
            runInAction(() => {
                this.theme = savedTheme;
            });
            document.body.setAttribute('data-theme', savedTheme);
        }
    }

    toggleTheme = () => {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
    }

    get isDark() {
        return this.theme === 'dark';
    }
}