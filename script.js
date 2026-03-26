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
       GITHUB STATS COMPONENT
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

                this.repos = profiles.reduce((s, p) => s + (p.public_repos || 0), 0);
                this.followers = profiles.reduce((s, p) => s + (p.followers || 0), 0);
                this.stars = repoLists.flat().reduce((s, r) => s + (r.stargazers_count || 0), 0);
            } catch (e) {
                console.error('githubStats:', e);
            }
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
       Fetches the latest GitHub release for each
       key project repo.
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

});

/* ============================================
   🍓 STRAWBERRY CURSOR TRAIL
   Pure vanilla — spawns tiny strawberry emojis
   that drift upward and fade out.
   ============================================ */
(function () {
    let lastSpawn = 0;
    const THROTTLE = 38; // ms — tuned for smooth but not spammy

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastSpawn < THROTTLE) return;
        lastSpawn = now;

        const el = document.createElement('span');
        el.className = 'cursor-trail';
        el.textContent = '🍓';

        // Slight random horizontal spread
        const spread = (Math.random() - 0.5) * 16;
        el.style.left = (e.clientX + spread) + 'px';
        el.style.top = e.clientY + 'px';

        // Randomise size a little
        const size = 9 + Math.random() * 6;
        el.style.fontSize = size + 'px';

        document.body.appendChild(el);

        // Trigger the CSS animation on next frame
        requestAnimationFrame(() => el.classList.add('cursor-trail--fade'));

        setTimeout(() => el.remove(), 700);
    });
})();

