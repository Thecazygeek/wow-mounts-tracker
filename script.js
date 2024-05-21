document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();
    const character = document.getElementById('character').value;
    const realm = document.getElementById('realm').value;
    getMounts(character, realm);
});

async function getMounts(character, realm) {
    const clientId = '13668d26206948238dffde9b008d72e5';
    const clientSecret = 'PcHogXGJ1emRj08wT94RAUDE55CHsWwC';

    // Obtenir un token d'accès
    const tokenResponse = await fetch('https://us.battle.net/oauth/token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });
    const tokenData = await tokenResponse.json();
    const token = tokenData.access_token;

    // Obtenir les montures
    const response = await fetch(`https://us.api.blizzard.com/profile/wow/character/${realm}/${character}/collections/mounts?namespace=profile-us&locale=en_US&access_token=${token}`);
    const data = await response.json();

    displayMounts(data);
}

function displayMounts(data) {
    const results = document.getElementById('results');
    results.innerHTML = '';

    const mounts = data.mounts;
    const ownedMounts = mounts.filter(mount => mount.is_useable);
    const missingMounts = mounts.filter(mount => !mount.is_useable);

    results.innerHTML += `<h2>Owned Mounts (${ownedMounts.length})</h2>`;
    ownedMounts.forEach(mount => {
        results.innerHTML += `<p>${mount.mount.name}</p>`;
    });

    results.innerHTML += `<h2>Missing Mounts (${missingMounts.length})</h2>`;
    missingMounts.forEach(mount => {
        results.innerHTML += `<p>${mount.mount.name}</p>`;
    });
}
