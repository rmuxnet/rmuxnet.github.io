const usernames = ['rmuxv2', 'rmuxnet'];
const maxItems = 6;
const container = document.getElementById('activity-log');
const template = document.getElementById('activity-template');

async function fetchGitHubActivity() {
    try {
        const requests = usernames.map(user => 
            fetch(`https://api.github.com/users/${user}/events/public`)
                .then(res => {
                    if (!res.ok) throw new Error(`Failed to load ${user}`);
                    return res.json();
                })
        );

        const responses = await Promise.all(requests);
        let allEvents = responses.flat();

        // Sort by date (newest first)
        allEvents.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        container.innerHTML = '';

        if (allEvents.length === 0) {
            container.innerHTML = '<span class="text-dim">No recent public activity found.</span>';
            return;
        }

        let count = 0;
        for (const event of allEvents) {
            if (count >= maxItems) break;

            let action = '';
            let targetName = event.repo.name;
            let targetUrl = `https://github.com/${event.repo.name}`;
            let icon = '>';

            if (event.type === 'PushEvent') {
                action = `pushed to`;
                icon = '+';
            } else if (event.type === 'WatchEvent') {
                action = `starred`;
                icon = '*';
            } else if (event.type === 'CreateEvent') {
                action = `created repo`;
                icon = 'C';
            } else if (event.type === 'PullRequestEvent') {
                action = `opened PR in`;
                icon = 'R';
            } else if (event.type === 'ForkEvent') {
                action = `forked`;
                icon = 'F';
            } else {
                continue; 
            }

            const dateObj = new Date(event.created_at);
            const dateStr = dateObj.toISOString().slice(0, 10);
            const userHandle = event.actor.login;

            // Clone the template
            const clone = template.content.cloneNode(true);

            // Fill in the data
            clone.querySelector('.js-date').textContent = dateStr;
            clone.querySelector('.js-user').textContent = userHandle;
            clone.querySelector('.js-icon').textContent = icon;
            clone.querySelector('.js-action').textContent = action;
            
            const link = clone.querySelector('.js-target');
            link.textContent = targetName;
            link.href = targetUrl;

            // Append to DOM
            container.appendChild(clone);
            count++;
        }

    } catch (error) {
        container.innerHTML = `<span class="text-dim border-l-2 border-red-900 pl-2">Error connecting to GitHub nodes.</span>`;
        console.error(error);
    }
}

fetchGitHubActivity();
