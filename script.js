/* ============================================
   CINEMATIC BOOT SEQUENCE
   Plays a terminal-style initialization on first
   visit (per session). Press any key to skip.
   ============================================ */
(function () {
    const bootScreen = document.getElementById('boot-screen');
    const bootLines = document.getElementById('boot-lines');
    const mainContent = document.getElementById('main-content');

    if (!bootScreen || !bootLines || !mainContent) return;

    // Only play once per session
    if (sessionStorage.getItem('rmux-booted')) {
        bootScreen.classList.add('hidden');
        mainContent.classList.remove('main-content-hidden');
        mainContent.classList.add('main-content-visible');
        return;
    }

    const lines = [
        { text: 'RMUX BIOS v2.0 — POST', cls: 'bright', delay: 200 },
        { text: '', cls: '', delay: 100 },
        { text: '[MEM]  Checking memory ............ 16384 MB OK', cls: 'info', delay: 120 },
        { text: '[CPU]  AMD Ryzen 7 — 8 cores ............. OK', cls: 'info', delay: 100 },
        { text: '[GPU]  NVIDIA RTX 4060 ................... OK', cls: 'info', delay: 90 },
        { text: '[USB]  3 devices detected ................ OK', cls: 'info', delay: 80 },
        { text: '', cls: '', delay: 60 },
        { text: '[NET]  Resolving rmux.me ................. OK', cls: 'ok', delay: 150 },
        { text: '[TLS]  Certificate valid ................. OK', cls: 'ok', delay: 80 },
        { text: '', cls: '', delay: 50 },
        { text: '[SYS]  Mounting filesystems .............. OK', cls: 'ok', delay: 100 },
        { text: '[SVC]  Starting Alpine.js ................ OK', cls: 'ok', delay: 80 },
        { text: '[SVC]  Starting aurora renderer .......... OK', cls: 'ok', delay: 70 },
        { text: '[SVC]  Starting particle system .......... OK', cls: 'ok', delay: 70 },
        { text: '', cls: '', delay: 60 },
        { text: '🍓 Strawberry kernel — Linux 6.18.20', cls: 'accent', delay: 180 },
        { text: '', cls: '', delay: 100 },
        { text: 'System ready. Welcome, monkey.', cls: 'bright', delay: 300 },
    ];

    let currentLine = 0;
    let skipped = false;

    function addLine(text, cls) {
        const div = document.createElement('div');
        div.className = 'boot-line ' + cls;
        div.textContent = text;
        bootLines.appendChild(div);
        // Auto-scroll
        bootLines.scrollTop = bootLines.scrollHeight;
    }

    function finishBoot() {
        if (skipped) return;
        skipped = true;
        sessionStorage.setItem('rmux-booted', '1');

        // CRT flash
        const flash = document.createElement('div');
        flash.className = 'boot-flash';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 700);

        // Fade out boot screen
        bootScreen.classList.add('fade-out');
        setTimeout(() => {
            bootScreen.classList.add('hidden');
            mainContent.classList.remove('main-content-hidden');
            mainContent.classList.add('main-content-visible');
        }, 800);
    }

    function typeNextLine() {
        if (skipped) return;
        if (currentLine >= lines.length) {
            setTimeout(finishBoot, 400);
            return;
        }

        const line = lines[currentLine];
        addLine(line.text, line.cls);
        currentLine++;
        setTimeout(typeNextLine, line.delay);
    }

    // Start boot sequence
    setTimeout(typeNextLine, 300);

    // Skip on any key or click
    function skipHandler() {
        finishBoot();
        document.removeEventListener('keydown', skipHandler);
        document.removeEventListener('click', skipHandler);
    }
    document.addEventListener('keydown', skipHandler);
    document.addEventListener('click', skipHandler);
})();

/* ============================================
   PERIODIC GLITCH EFFECT ON TITLE
   ============================================ */
(function () {
    function triggerGlitch() {
        const el = document.querySelector('.glitch-text');
        if (!el) return;
        el.classList.add('glitching');
        setTimeout(() => el.classList.remove('glitching'), 300);
    }

    function scheduleNext() {
        const delay = 4000 + Math.random() * 6000; // 4-10 seconds
        setTimeout(() => {
            triggerGlitch();
            scheduleNext();
        }, delay);
    }

    // Start after boot finishes
    setTimeout(scheduleNext, 5000);
})();

document.addEventListener('alpine:init', () => {

    /* ============================================
       CLOCK COMPONENT
       ============================================ */
    Alpine.data('clock', () => ({
        time: '',
        init() {
            const tick = () => {
                const now = new Date();
                this.time = [
                    String(now.getHours()).padStart(2, '0'),
                    String(now.getMinutes()).padStart(2, '0'),
                    String(now.getSeconds()).padStart(2, '0'),
                ].join(':');
            };
            tick();
            setInterval(tick, 1000);
        },
    }));

    /* ============================================
       THEME TOGGLE COMPONENT
       Switches between mono (default) and
       strawberry (deep berry) theme.
       ============================================ */
    Alpine.data('themeToggle', () => ({
        isStrawberry: document.documentElement.getAttribute('data-theme') === 'strawberry',

        init() {
            // Sync tab title on mount in case anti-flash script already set data-theme
            this._applyTitle(this.isStrawberry);
        },

        toggle() {
            this.isStrawberry = !this.isStrawberry;
            if (this.isStrawberry) {
                document.documentElement.setAttribute('data-theme', 'strawberry');
                localStorage.setItem('rmux-theme', 'strawberry');
            } else {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('rmux-theme', 'mono');
            }
            this._applyTitle(this.isStrawberry);
            // Brief pop animation on the button
            this.$el.classList.add('theme-toggle--pop');
            setTimeout(() => this.$el.classList.remove('theme-toggle--pop'), 350);
        },

        _applyTitle(isBerry) {
            const base = 'rmux.me \u2014 device maintainer & developer';
            document.title = isBerry ? '\uD83C\uDF53 ' + base : base;
        },
    }));

    /* ============================================
       GITHUB STATS COMPONENT — with animated counter
       ============================================ */
    Alpine.data('githubStats', () => ({
        repos: '—',
        stars: '—',
        followers: '—',

        async init() {
            try {
                const accounts = ['rmuxnet', 'rmuxv2'];

                const [profiles, repoLists] = await Promise.all([
                    Promise.all(accounts.map(u =>
                        fetch(`https://api.github.com/users/${u}`).then(r => r.json())
                    )),
                    Promise.all(accounts.map(u =>
                        fetch(`https://api.github.com/users/${u}/repos?per_page=100`).then(r => r.json())
                    )),
                ]);

                const repoCount = profiles.reduce((s, p) => s + (p.public_repos || 0), 0);
                const followerCount = profiles.reduce((s, p) => s + (p.followers || 0), 0);
                const starCount = repoLists.flat().reduce((s, r) => s + (r.stargazers_count || 0), 0);

                // Animate the counters
                this._animateCounter('repos', repoCount);
                this._animateCounter('followers', followerCount);
                this._animateCounter('stars', starCount);
            } catch (e) {
                console.error('githubStats:', e);
            }
        },

        _animateCounter(prop, target) {
            const duration = 1200;
            const start = performance.now();
            const tick = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                this[prop] = Math.round(eased * target);
                if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        },
    }));

    /* ============================================
       BUILD STATUS COMPONENT
       ============================================ */
    Alpine.data('buildStatus', (owner, repo) => ({
        status: null,

        get dotColor() {
            return {
                passing: 'bg-green-500',
                failing: 'bg-red-500',
                running: 'bg-yellow-400',
            }[this.status] ?? 'bg-dim';
        },

        get textColor() {
            return {
                passing: 'text-green-500',
                failing: 'text-red-500',
                running: 'text-yellow-400',
            }[this.status] ?? 'text-dim';
        },

        async init() {
            try {
                const r = await fetch(
                    `https://api.github.com/repos/${owner}/${repo}/actions/runs?per_page=1`
                );
                if (!r.ok) return;
                const data = await r.json();
                const run = data.workflow_runs?.[0];
                if (!run) return;

                if (run.status === 'in_progress' || run.status === 'queued') {
                    this.status = 'running';
                } else if (run.conclusion === 'success') {
                    this.status = 'passing';
                } else if (run.conclusion === 'failure') {
                    this.status = 'failing';
                }
            } catch (e) {
                // silently fail
            }
        },
    }));

    /* ============================================
       GITHUB ACTIVITY COMPONENT
       ============================================ */
    Alpine.data('githubActivity', () => ({
        events: [],
        loading: true,
        error: false,

        async init() {
            const TYPE_MAP = {
                PushEvent: { action: 'pushed to', icon: '+' },
                WatchEvent: { action: 'starred', icon: '*' },
                CreateEvent: { action: 'created repo', icon: 'C' },
                PullRequestEvent: { action: 'opened PR in', icon: 'R' },
                ForkEvent: { action: 'forked', icon: 'F' },
            };

            try {
                const responses = await Promise.all(
                    ['rmuxv2', 'rmuxnet'].map(u =>
                        fetch(`https://api.github.com/users/${u}/events/public`)
                            .then(r => { if (!r.ok) throw new Error(u); return r.json(); })
                    )
                );

                const all = responses
                    .flat()
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                let count = 0;
                for (const ev of all) {
                    if (count >= 6) break;
                    const meta = TYPE_MAP[ev.type];
                    if (!meta) continue;
                    this.events.push({
                        date: new Date(ev.created_at).toISOString().slice(0, 10),
                        user: ev.actor.login,
                        icon: meta.icon,
                        action: meta.action,
                        name: ev.repo.name,
                        url: `https://github.com/${ev.repo.name}`,
                    });
                    count++;
                }
            } catch (e) {
                console.error(e);
                this.error = true;
            } finally {
                this.loading = false;
            }
        },
    }));

    /* ============================================
       LATEST RELEASES COMPONENT
       ============================================ */
    Alpine.data('releaseTracker', () => ({
        releases: [],
        loading: true,

        async init() {
            const repos = [
                { owner: 'rmuxnet', repo: 'Braska', label: 'Braska', isStrawberry: false },
                { owner: 'rmuxnet', repo: 'ps4-linux-12xx', label: '🍓 Strawberry', isStrawberry: true },
                { owner: 'rmuxnet', repo: 'Axion-PIPA', label: 'AxionAOSP', isStrawberry: false },
                { owner: 'rmuxnet', repo: 'SynCinema', label: 'SynCinema', isStrawberry: false },
            ];

            const results = await Promise.allSettled(
                repos.map(({ owner, repo, label, isStrawberry }) =>
                    fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`)
                        .then(r => r.ok ? r.json() : Promise.reject())
                        .then(data => ({
                            label,
                            repo,
                            isStrawberry,
                            tag: data.tag_name,
                            url: data.html_url,
                            date: new Date(data.published_at).toISOString().slice(0, 10),
                        }))
                        .catch(() => null)
                )
            );

            this.releases = results
                .filter(r => r.status === 'fulfilled' && r.value)
                .map(r => r.value);

            this.loading = false;
        },
    }));

    /* ============================================
       CARD REVEAL COMPONENT — individual card animation
       ============================================ */
    Alpine.data('cardReveal', () => ({
        shown: false,
    }));

});

/* ============================================
   🍓 STRAWBERRY CURSOR TRAIL — enhanced
   ============================================ */
(function () {
    let lastSpawn = 0;
    const THROTTLE = 35;
    const emojis = ['🍓', '🌸', '✿', '❀'];

    document.addEventListener('mousemove', (e) => {
        if (document.documentElement.getAttribute('data-theme') !== 'strawberry') return;

        const now = Date.now();
        if (now - lastSpawn < THROTTLE) return;
        lastSpawn = now;

        const el = document.createElement('span');
        el.className = 'cursor-trail';
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        const spread = (Math.random() - 0.5) * 20;
        el.style.left = (e.clientX + spread) + 'px';
        el.style.top = e.clientY + 'px';

        const size = 8 + Math.random() * 7;
        el.style.fontSize = size + 'px';

        document.body.appendChild(el);

        requestAnimationFrame(() => el.classList.add('cursor-trail--fade'));

        setTimeout(() => el.remove(), 750);
    });
})();

/* ============================================
   INTERACTIVE CONSTELLATION — canvas particle network
   Nodes float, connect with lines, react to mouse
   ============================================ */
(function () {
    // Skip on mobile
    if (window.innerWidth < 768) return;

    const canvas = document.getElementById('constellation');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H;
    let mouseX = -9999, mouseY = -9999;
    const MOUSE_RADIUS = 150;
    const CONNECT_DIST = 130;
    const PARTICLE_COUNT = 70;
    const particles = [];

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    // Track mouse position (use document-level since canvas has pointer-events: none)
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
        mouseX = -9999;
        mouseY = -9999;
    });

    // Particle class
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            // Persistent gentle drift so particles always float
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.15 + Math.random() * 0.25;
            this.driftX = Math.cos(angle) * speed;
            this.driftY = Math.sin(angle) * speed;
            this.radius = 1 + Math.random() * 1.5;
            this.baseAlpha = 0.3 + Math.random() * 0.4;
            this.alpha = this.baseAlpha;
        }

        update() {
            // Mouse repulsion
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < MOUSE_RADIUS && dist > 0) {
                const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                const angle = Math.atan2(dy, dx);
                this.vx += Math.cos(angle) * force * 0.8;
                this.vy += Math.sin(angle) * force * 0.8;
                // Glow when near mouse
                this.alpha = Math.min(1, this.baseAlpha + force * 0.6);
            } else {
                this.alpha += (this.baseAlpha - this.alpha) * 0.05;
            }

            // Apply persistent drift
            this.vx += this.driftX * 0.02;
            this.vy += this.driftY * 0.02;

            // Damping (keeps drift alive)
            this.vx *= 0.99;
            this.vy *= 0.99;

            // Clamp max speed
            const maxV = 1.5;
            this.vx = Math.max(-maxV, Math.min(maxV, this.vx));
            this.vy = Math.max(-maxV, Math.min(maxV, this.vy));

            this.x += this.vx;
            this.y += this.vy;

            // Wrap edges
            if (this.x < -20) this.x = W + 20;
            if (this.x > W + 20) this.x = -20;
            if (this.y < -20) this.y = H + 20;
            if (this.y > H + 20) this.y = -20;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(232, 84, 122, ${this.alpha})`;
            ctx.fill();

            // Subtle glow
            if (this.alpha > 0.5) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(232, 84, 122, ${(this.alpha - 0.3) * 0.15})`;
                ctx.fill();
            }
        }
    }

    // Create particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECT_DIST) {
                    const alpha = (1 - dist / CONNECT_DIST) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(232, 84, 122, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        // Draw lines from mouse to nearby particles
        for (const p of particles) {
            const dx = p.x - mouseX;
            const dy = p.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_RADIUS * 1.2) {
                const alpha = (1 - dist / (MOUSE_RADIUS * 1.2)) * 0.2;
                ctx.beginPath();
                ctx.moveTo(mouseX, mouseY);
                ctx.lineTo(p.x, p.y);
                ctx.strokeStyle = `rgba(255, 77, 120, ${alpha})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, W, H);

        for (const p of particles) {
            p.update();
            p.draw();
        }

        drawLines();
        requestAnimationFrame(animate);
    }

    // Start after a brief delay (let boot sequence play)
    setTimeout(() => {
        animate();
    }, 500);
})();

/* ============================================
   MAGNETIC TILT ON PROJECT CARDS
   Subtle 3D perspective tilt on hover
   ============================================ */
(function () {
    const cards = () => document.querySelectorAll('a[href^="https://github"].block, a[href^="https://github.com/pipaDB"], a[href^="https://github.com/PipaDB"]');

    function initTilt() {
        cards().forEach(card => {
            if (card._tiltInit) return;
            card._tiltInit = true;
            card.style.transformStyle = 'preserve-3d';
            card.style.perspective = '800px';

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                const tiltX = y * -4; // degrees
                const tiltY = x * 4;

                card.style.transform = `translateY(-3px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
                setTimeout(() => {
                    card.style.transition = '';
                }, 400);
            });
        });
    }

    // Init after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initTilt, 500));
    } else {
        setTimeout(initTilt, 500);
    }
})();

/* ============================================
   DYNAMIC GREETING based on time of day
   ============================================ */
(function () {
    function setGreeting() {
        const el = document.getElementById('greeting-text');
        if (!el) return;

        const hour = new Date().getHours();
        let greeting;
        if (hour >= 5 && hour < 12) greeting = 'good morning monkey';
        else if (hour >= 12 && hour < 17) greeting = 'good afternoon monkey';
        else if (hour >= 17 && hour < 21) greeting = 'good evening monkey';
        else greeting = 'late night coding monkey';

        el.textContent = 'online — ' + greeting;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setGreeting);
    } else {
        setGreeting();
    }
})();

/* ============================================
   SCROLL PROGRESS BAR
   ============================================ */
(function () {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    function update() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = progress + '%';
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
})();

/* ============================================
   CURSOR SPOTLIGHT — radial glow follows mouse
   ============================================ */
(function () {
    if (window.matchMedia('(max-width: 640px)').matches) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'cursor-spotlight';
    document.body.appendChild(spotlight);

    let mouseX = -500, mouseY = -500;
    let curX = -500, curY = -500;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function lerp(a, b, t) { return a + (b - a) * t; }

    function animate() {
        curX = lerp(curX, mouseX, 0.08);
        curY = lerp(curY, mouseY, 0.08);
        spotlight.style.left = curX + 'px';
        spotlight.style.top = curY + 'px';
        requestAnimationFrame(animate);
    }

    animate();
})();

/* ============================================
   CARD HOVER SPOTLIGHT — inner glow at cursor
   ============================================ */
(function () {
    function initCardSpotlights() {
        const cards = document.querySelectorAll('a[href^="https://github"].block, a[href^="https://github.com/pipaDB"], a[href^="https://github.com/PipaDB"]');
        cards.forEach(card => {
            if (card._spotlightInit) return;
            card._spotlightInit = true;

            // Create spotlight div inside card
            const spot = document.createElement('div');
            spot.className = 'card-spotlight';
            card.style.position = 'relative';
            card.appendChild(spot);

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', x + 'px');
                card.style.setProperty('--mouse-y', y + 'px');
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initCardSpotlights, 600));
    } else {
        setTimeout(initCardSpotlights, 600);
    }
})();

/* ============================================
   SESSION UPTIME COUNTER
   ============================================ */
(function () {
    const startTime = Date.now();

    function update() {
        const el = document.getElementById('session-uptime');
        if (!el) return;

        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const mins = Math.floor(elapsed / 60);
        const secs = elapsed % 60;
        const hrs = Math.floor(mins / 60);
        const m = mins % 60;

        if (hrs > 0) {
            el.textContent = `session ${hrs}h ${String(m).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
        } else if (mins > 0) {
            el.textContent = `session ${m}m ${String(secs).padStart(2, '0')}s`;
        } else {
            el.textContent = `session ${secs}s`;
        }
    }

    setInterval(update, 1000);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', update);
    } else {
        update();
    }
})();

/* ============================================
   MINI TERMINAL — interactive easter egg
   ============================================ */
(function () {
    function initTerminal() {
        const trigger = document.getElementById('terminal-trigger');
        const terminal = document.getElementById('mini-terminal');
        const input = document.getElementById('terminal-input');
        const body = document.getElementById('terminal-body');
        if (!trigger || !terminal || !input || !body) return;

        const commands = {
            help: () => `available commands:
  help        — show this message
  whoami      — about rmux
  projects    — list projects
  neofetch    — system info
  uptime      — session duration
  theme       — toggle theme
  clear       — clear terminal
  exit        — close terminal
  echo [msg]  — echo a message
  date        — current date/time
  cowsay      — 🐄`,

            whoami: () => `rmux — device maintainer & developer
focused on AOSP, Fedora, kernel, and web
maintaining alioth (POCO F3) & pipa (Xiaomi Pad 6)`,

            projects: () => `📱 Braska      — PS4 remote management (Flutter)
🍓 Strawberry  — Linux 6.18 kernel for PS4
🎬 SynCinema   — synchronized movie platform
📟 AxionAOSP   — Android 15 ROM for pipa`,

            neofetch: () => {
                const ua = navigator.userAgent;
                const isMobile = /Mobile|Android/.test(ua);
                return `  ╭─────────────╮
  │  rmux@me    │
  ╰─────────────╯
  OS: rmux.me v2.0
  Shell: JetBrains Mono
  Theme: ${document.documentElement.getAttribute('data-theme') === 'strawberry' ? '🍓 strawberry' : '◼ mono'}
  Device: ${isMobile ? 'mobile' : 'desktop'}
  Resolution: ${window.innerWidth}x${window.innerHeight}
  Uptime: ${document.getElementById('session-uptime')?.textContent || '—'}`;
            },

            uptime: () => document.getElementById('session-uptime')?.textContent || 'unknown',

            theme: () => {
                const btn = document.querySelector('.theme-toggle');
                if (btn) btn.click();
                return 'theme toggled 🎨';
            },

            date: () => new Date().toString(),

            cowsay: () => ` _______
< moo 🍓 >
 -------
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`,

            clear: () => '__CLEAR__',
            exit: () => '__EXIT__',
        };

        let isOpen = false;

        trigger.addEventListener('click', () => {
            isOpen = !isOpen;
            if (isOpen) {
                terminal.classList.add('open');
                addOutput('type "help" for available commands', false);
                setTimeout(() => input.focus(), 100);
            } else {
                terminal.classList.remove('open');
            }
        });

        function addOutput(text, isCmd) {
            const line = document.createElement('div');
            line.className = 'output-line' + (isCmd ? ' cmd' : '');
            line.textContent = isCmd ? '$ ' + text : text;
            body.appendChild(line);
            body.scrollTop = body.scrollHeight;
        }

        input.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter') return;
            const val = input.value.trim();
            input.value = '';
            if (!val) return;

            addOutput(val, true);

            // Parse command
            const parts = val.split(' ');
            const cmd = parts[0].toLowerCase();
            const args = parts.slice(1).join(' ');

            if (cmd === 'echo') {
                addOutput(args || '', false);
            } else if (cmd === 'clear') {
                body.innerHTML = '';
            } else if (cmd === 'exit') {
                terminal.classList.remove('open');
                isOpen = false;
            } else if (commands[cmd]) {
                const result = commands[cmd]();
                if (result !== '__CLEAR__' && result !== '__EXIT__') {
                    addOutput(result, false);
                }
            } else {
                addOutput(`command not found: ${cmd}. try "help"`, false);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initTerminal, 300));
    } else {
        setTimeout(initTerminal, 300);
    }
})();

/* ============================================
   CINEMATIC HERO TEXT REVEAL
   Each letter of "rmux.me" cascades in with
   scale, blur, and glow. Then a light sweep
   passes across like a Hollywood title card.
   ============================================ */
(function () {
    function initHeroReveal() {
        const h1 = document.querySelector('.glitch-text');
        if (!h1 || h1.dataset.heroRevealed) return;
        h1.dataset.heroRevealed = '1';

        const text = h1.textContent.trim();
        // Clear original text but keep pseudo-elements working
        h1.textContent = '';
        h1.classList.remove('typed-cursor'); // remove cursor during animation

        // Create letter spans
        const letters = [];
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i];
            span.className = 'hero-letter';
            span.style.animationDelay = (i * 80) + 'ms';
            h1.appendChild(span);
            letters.push(span);
        }

        // After all letters have appeared, add the light sweep
        const totalLetterTime = text.length * 80 + 600;
        setTimeout(() => {
            // Add sweep element
            const sweep = document.createElement('span');
            sweep.className = 'hero-sweep';
            h1.appendChild(sweep);

            // After sweep, restore cursor
            setTimeout(() => {
                h1.classList.add('typed-cursor');
            }, 800);
        }, totalLetterTime);
    }

    // Watch for when main content becomes visible (after boot)
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.target.classList && m.target.classList.contains('main-content-visible')) {
                setTimeout(initHeroReveal, 200);
                observer.disconnect();
                return;
            }
        }
    });

    const main = document.getElementById('main-content');
    if (main) {
        if (main.classList.contains('main-content-visible')) {
            // Already visible (boot was skipped via sessionStorage)
            setTimeout(initHeroReveal, 400);
        } else {
            observer.observe(main, { attributes: true, attributeFilter: ['class'] });
        }
    }
})();
