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
       GITHUB STATS COMPONENT
       Aggregates repos, stars, followers across
       both rmuxnet + rmuxv2 accounts.
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
       Fetches the latest GitHub Actions run for
       a given repo and exposes a status string.
       ============================================ */
    Alpine.data('buildStatus', (owner, repo) => ({
        status: null,   // 'passing' | 'failing' | 'running' | null

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
                // cancelled / skipped → leave null (no badge)
            } catch (e) {
                // silently fail — badge just won't appear
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

});
