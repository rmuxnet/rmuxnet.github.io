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

/* --- GUESTBOOK LOGIC --- */
const workerUrl = "https://rmux-guestbook.xkq.workers.dev"; 
const gbContainer = document.getElementById('guestbook-log');
const gbTemplate = document.getElementById('guestbook-template');
const gbForm = document.getElementById('gb-form');

async function fetchGuestbook() {
    try {
        const res = await fetch(`${workerUrl}/api/entries`);
        if (!res.ok) throw new Error("DB Error");
        const entries = await res.json();

        gbContainer.innerHTML = ''; 

        if (entries.length === 0) {
            gbContainer.innerHTML = '<span class="text-dim">No signatures yet. Be the first.</span>';
            return;
        }

        entries.forEach(entry => {
            const clone = gbTemplate.content.cloneNode(true);
            
            // Format Date: YYYY-MM-DD
            const dateStr = new Date(entry.created_at).toISOString().slice(0, 10);

            // XSS Prevention
            const safeName = entry.name.replace(/</g, "&lt;");
            const safeMsg = entry.message.replace(/</g, "&lt;");

            clone.querySelector('.gb-date').textContent = dateStr;
            clone.querySelector('.gb-name').textContent = safeName;
            clone.querySelector('.gb-msg').innerHTML = `> ${safeMsg}`;

            gbContainer.appendChild(clone);
        });

    } catch (e) {
        console.error(e);
        gbContainer.innerHTML = `<span class="text-dim border-l-2 border-red-900 pl-2">System Error: Database unreachable.</span>`;
    }
}

// Handle Submit
if (gbForm) {
    gbForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = gbForm.querySelector('button');
        const originalText = btn.innerHTML;
        
        // Loading State
        btn.disabled = true;
        btn.innerHTML = `<span class="animate-pulse">UPLOADING...</span>`;

        const name = document.getElementById('gb-name').value;
        const message = document.getElementById('gb-msg').value;

        try {
            await fetch(`${workerUrl}/api/sign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, message })
            });
            
            // Clear and Reload
            document.getElementById('gb-msg').value = '';
            fetchGuestbook();
        } catch (err) {
            alert("Failed to commit message.");
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    });
}

// Init
fetchGuestbook();
