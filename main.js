
class LotteryBall extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const number = this.getAttribute('number');
        const hue = (parseInt(number, 10) * 360 / 45);

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: grid;
                    place-content: center;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: radial-gradient(
                        circle at 35% 35%,
                        oklch(95% 0.1 ${hue}),
                        oklch(60% 0.2 ${hue})
                    );
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: oklch(20% 0.05 240);
                    box-shadow:
                        0 2px 2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 9%)),
                        0 4px 4px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 9%)),
                        0 8px 8px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 9%));
                    transform-style: preserve-3d;
                    animation: pop-in 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
                    opacity: 0;
                    transform: scale(0.5);
                }

                @keyframes pop-in {
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            </style>
            <span>${number}</span>
        `;

        const animationDelay = this.getAttribute('delay') || '0s';
        this.style.animationDelay = animationDelay;
    }
}

customElements.define('lottery-ball', LotteryBall);

const generateBtn = document.getElementById('generate-btn');
const themeToggleBtn = document.getElementById('theme-toggle');
const lotteryNumbersContainer = document.getElementById('lottery-numbers');
const themeStorageKey = 'theme-preference';

function getPreferredTheme() {
    const storedTheme = localStorage.getItem(themeStorageKey);
    if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function updateThemeLabel(theme) {
    themeToggleBtn.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
}

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    updateThemeLabel(theme);
}

applyTheme(getPreferredTheme());

themeToggleBtn.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(themeStorageKey, nextTheme);
    applyTheme(nextTheme);
});

generateBtn.addEventListener('click', () => {
    lotteryNumbersContainer.innerHTML = '';
    const numbers = new Set();
    while(numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    [...numbers].sort((a, b) => a - b).forEach((number, index) => {
        const ball = document.createElement('lottery-ball');
        ball.setAttribute('number', number);
        ball.setAttribute('delay', `${index * 0.1}s`);
        lotteryNumbersContainer.appendChild(ball);
    });
});
