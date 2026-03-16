
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
const setsToGenerate = 5;
const numbersPerSet = 6;
const maxLotteryNumber = 45;

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

function createNumberSet() {
    const numbers = new Set();

    while (numbers.size < numbersPerSet) {
        numbers.add(Math.floor(Math.random() * maxLotteryNumber) + 1);
    }

    return [...numbers].sort((a, b) => a - b);
}

function renderTickets() {
    lotteryNumbersContainer.innerHTML = '';

    for (let setIndex = 0; setIndex < setsToGenerate; setIndex += 1) {
        const ticket = document.createElement('article');
        ticket.className = 'ticket';

        const header = document.createElement('div');
        header.className = 'ticket-header';

        const titleGroup = document.createElement('div');
        const title = document.createElement('h2');
        title.className = 'ticket-title';
        title.textContent = `Quick Pick ${setIndex + 1}`;

        const subtitle = document.createElement('p');
        subtitle.className = 'ticket-subtitle';
        subtitle.textContent = '6 numbers from 1 to 45';

        titleGroup.append(title, subtitle);

        const badge = document.createElement('span');
        badge.className = 'ticket-badge';
        badge.textContent = 'Ready';

        header.append(titleGroup, badge);

        const ballRow = document.createElement('div');
        ballRow.className = 'ball-row';

        createNumberSet().forEach((number, numberIndex) => {
            const ball = document.createElement('lottery-ball');
            ball.setAttribute('number', number);
            ball.setAttribute('delay', `${setIndex * 0.08 + numberIndex * 0.06}s`);
            ballRow.appendChild(ball);
        });

        ticket.append(header, ballRow);
        lotteryNumbersContainer.appendChild(ticket);
    }
}

generateBtn.addEventListener('click', () => {
    renderTickets();
});

renderTickets();
