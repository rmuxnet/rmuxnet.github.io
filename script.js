(function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function triggerGlitch() {
        const el = document.querySelector('.glitch-text');
        if (!el) return;
        el.classList.add('glitching');
        setTimeout(() => el.classList.remove('glitching'), 300);
    }

    function scheduleNext() {
        const delay = 4000 + Math.random() * 6000;
        setTimeout(() => {
            triggerGlitch();
            scheduleNext();
        }, delay);
    }

    setTimeout(scheduleNext, 3000);
})();

(function () {
    const revealAnimations = new Set(['fadeInUp', 'cardSlideIn']);

    document.addEventListener('animationstart', (e) => {
        if (revealAnimations.has(e.animationName)) {
            e.target.style.willChange = 'transform, opacity, filter';
        }
    });

    document.addEventListener('animationend', (e) => {
        if (revealAnimations.has(e.animationName)) {
            e.target.style.willChange = 'auto';
        }
    });
})();

async function cachedFetchJSON(url, ttlMs = 600000) {
    const key = 'gh-cache:' + url;
    let cached = null;
    try {
        const raw = localStorage.getItem(key);
        if (raw) cached = JSON.parse(raw);
    } catch (e) {  }

    if (cached && (Date.now() - cached.ts) < ttlMs) {
        return cached.data;
    }

    try {
        const r = await fetch(url);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const data = await r.json();
        try {
            localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
        } catch (e) {  }
        return data;
    } catch (e) {

        if (cached) return cached.data;
        throw e;
    }
}

const LANG_COLORS = {
    C: '#7f7f7f', 'C++': '#f34b7d', 'C#': '#178600', Python: '#3572A5',
    Kotlin: '#A97BFF', Java: '#b07219', JavaScript: '#f1e05a', TypeScript: '#3178c6',
    Dart: '#00B4AB', Lua: '#5b8bd6', Shell: '#89e051', HTML: '#e34c26', CSS: '#563d7c',
    Makefile: '#6d8a3f', CMake: '#DA3434', Assembly: '#a8a032', Go: '#00ADD8',
    Rust: '#dea584', Ruby: '#701516', Vue: '#41b883', Dockerfile: '#7d96a8',
    'Objective-C': '#438eff', Swift: '#F05138', PHP: '#7884c4', Roff: '#ecdebe',
    Smarty: '#f0c040', Perl: '#0298c3', Batchfile: '#C1F12E', PowerShell: '#3a6fb0',
    SourcePawn: '#5c7611', Pawn: '#dbb284', Yacc: '#7c8a5e', Gnuplot: '#f0a9f0',
    'Inno Setup': '#264b99', Meson: '#007800', Nix: '#7e7eff',
};

document.addEventListener('alpine:init', () => {

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

    Alpine.data('githubStats', () => ({
        repos: '—',
        stars: '—',
        followers: '—',

        async init() {
            try {
                const accounts = ['rmuxnet', 'rmuxv2'];

                const [profiles, repoLists] = await Promise.all([
                    Promise.all(accounts.map(u =>
                        cachedFetchJSON(`https://api.github.com/users/${u}`)
                    )),
                    Promise.all(accounts.map(u =>
                        cachedFetchJSON(`https://api.github.com/users/${u}/repos?per_page=100`)
                    )),
                ]);

                const repoCount = profiles.reduce((s, p) => s + (p.public_repos || 0), 0);
                const followerCount = profiles.reduce((s, p) => s + (p.followers || 0), 0);
                const starCount = repoLists.flat().reduce((s, r) => s + (r.stargazers_count || 0), 0);

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

                const eased = 1 - Math.pow(1 - progress, 3);
                this[prop] = Math.round(eased * target);
                if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        },
    }));

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
                const data = await cachedFetchJSON(
                    `https://api.github.com/repos/${owner}/${repo}/actions/runs?per_page=1`,
                    300000
                );
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

            }
        },
    }));

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
                        cachedFetchJSON(`https://api.github.com/users/${u}/events/public`)
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

    Alpine.data('releaseTracker', () => ({
        releases: [],
        loading: true,

        async init() {
            const repos = [
                { owner: 'rmuxnet', repo: 'Braska', label: 'Braska', isStrawberry: false },
                { owner: 'rmuxnet', repo: 'ps4-linux-12xx', label: '🍓 Strawberry', isStrawberry: true },
                { owner: 'rmuxnet', repo: 'Axion-PIPA', label: 'AxionAOSP', isStrawberry: false },
            ];

            const results = await Promise.allSettled(
                repos.map(({ owner, repo, label, isStrawberry }) =>
                    cachedFetchJSON(`https://api.github.com/repos/${owner}/${repo}/releases/latest`)
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

    Alpine.data('discordWidget', () => ({
        online: '—',
        members: '—',
        icon: '',
        error: false,

        async init() {
            try {
                const r = await fetch(
                    'https://discord.com/api/v10/invites/TgATpPvNTt?with_counts=true'
                );
                if (!r.ok) throw new Error('invite ' + r.status);
                const data = await r.json();

                const g = data.guild || {};
                if (g.id && g.icon) {
                    this.icon = `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png?size=64`;
                }

                this._animateCounter('online', data.approximate_presence_count || 0);
                this._animateCounter('members', data.approximate_member_count || 0);
            } catch (e) {
                console.error('discordWidget:', e);
                this.error = true;
            }
        },

        _animateCounter(prop, target) {
            const duration = 1000;
            const start = performance.now();
            const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                this[prop] = Math.round(eased * target);
                if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        },
    }));

    Alpine.data('downloadCount', (owner, repo) => ({
        display: 0,
        ready: false,

        async init() {
            try {
                const releases = await cachedFetchJSON(
                    `https://api.github.com/repos/${owner}/${repo}/releases?per_page=100`
                );
                if (!Array.isArray(releases)) return;

                let total = 0;
                for (const rel of releases) {
                    for (const asset of (rel.assets || [])) {
                        total += asset.download_count || 0;
                    }
                }
                if (total <= 0) return;

                this.ready = true;
                this._animate(total);
            } catch (e) {

            }
        },

        get formatted() {
            return this.display.toLocaleString('en-US');
        },

        _animate(target) {
            const duration = 1200;
            const start = performance.now();
            const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                this.display = Math.round(eased * target);
                if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        },
    }));

    Alpine.data('repoMeta', (owner, repo) => ({
        stars: 0,
        updated: '',
        langs: [],
        loaded: false,

        async init() {
            try {
                const [info, languages] = await Promise.all([
                    cachedFetchJSON(`https://api.github.com/repos/${owner}/${repo}`),
                    cachedFetchJSON(`https://api.github.com/repos/${owner}/${repo}/languages`)
                        .catch(() => ({})),
                ]);
                this.stars = info.stargazers_count || 0;
                this.updated = this._relativeTime(info.pushed_at);
                this.langs = this._buildLangs(languages);
                this.loaded = true;
            } catch (e) {

            }
        },

        _relativeTime(iso) {
            if (!iso) return '';
            const diff = Date.now() - new Date(iso).getTime();
            const min = Math.floor(diff / 60000);
            const hr = Math.floor(min / 60);
            const day = Math.floor(hr / 24);
            const mo = Math.floor(day / 30);
            const yr = Math.floor(day / 365);
            if (yr >= 1) return yr + 'y ago';
            if (mo >= 1) return mo + 'mo ago';
            if (day >= 1) return day + 'd ago';
            if (hr >= 1) return hr + 'h ago';
            if (min >= 1) return min + 'm ago';
            return 'just now';
        },

        _buildLangs(map) {
            const entries = Object.entries(map || {});
            if (!entries.length) return [];
            const total = entries.reduce((s, [, v]) => s + v, 0);
            if (total <= 0) return [];
            return entries
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([name, bytes]) => ({
                    name,
                    pct: Math.round((bytes / total) * 1000) / 10,
                    color: LANG_COLORS[name] || '#8b8b8b',
                }));
        },
    }));

});

(function () {
    function setGreeting() {
        const el = document.getElementById('greeting-text');
        if (!el) return;

        const hour = new Date().getHours();
        let greeting;
        if (hour >= 5 && hour < 12) greeting = 'good morning';
        else if (hour >= 12 && hour < 17) greeting = 'good afternoon';
        else if (hour >= 17 && hour < 21) greeting = 'good evening';
        else greeting = 'late night coding';

        el.textContent = 'online, ' + greeting;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setGreeting);
    } else {
        setGreeting();
    }
})();

(function () {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    function update() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? scrollTop / docHeight : 0;
        bar.style.transform = `scaleX(${progress})`;
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
})();

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

(function () {
    function initHeroReveal() {
        const h1 = document.querySelector('.glitch-text');
        if (!h1 || h1.dataset.heroRevealed) return;
        h1.dataset.heroRevealed = '1';

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const text = h1.textContent.trim();

        h1.textContent = '';

        const letters = [];
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i];
            span.className = 'hero-letter';
            span.style.animationDelay = (i * 80) + 'ms';
            span.style.willChange = 'transform, opacity, filter';
            span.addEventListener('animationend', () => {
                span.style.willChange = 'auto';
            }, { once: true });
            h1.appendChild(span);
            letters.push(span);
        }

        const totalLetterTime = text.length * 80 + 600;
        setTimeout(() => {

            const sweep = document.createElement('span');
            sweep.className = 'hero-sweep';
            h1.appendChild(sweep);
        }, totalLetterTime);
    }

    const main = document.getElementById('main-content');
    if (main) {
        setTimeout(initHeroReveal, 400);
    }
})();

(function () {
    function initFilters() {
        const bar = document.getElementById('project-filters');
        const grid = document.getElementById('projects-grid');
        if (!bar || !grid) return;

        const chips = bar.querySelectorAll('.proj-chip');
        const items = grid.querySelectorAll('.project-item');

        bar.addEventListener('click', (e) => {
            const chip = e.target.closest('.proj-chip');
            if (!chip) return;
            const filter = chip.dataset.filter;

            chips.forEach(c => c.classList.toggle('is-active', c === chip));

            items.forEach(item => {
                const show = filter === 'all' || item.dataset.cat === filter;
                item.classList.toggle('proj-hidden', !show);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFilters);
    } else {
        initFilters();
    }
})();
