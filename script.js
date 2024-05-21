document.getElementById('region').addEventListener('change', function() {
    const region = document.getElementById('region').value;
    fetchRealms(region);
});

document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();
    const character = document.getElementById('character').value;
    const realm = document.getElementById('realm').value;
    const region = document.getElementById('region').value;
    getMounts(character, realm, region);
});

async function fetchRealms(region) {
    const clientId = 'VOTRE_CLIENT_ID';
    const clientSecret = 'VOTRE_CLIENT_SECRET';

    const tokenUrl = `https://${region}.battle.net/oauth/token`;
    const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });
    const tokenData = await tokenResponse.json();
    const token = tokenData.access_token;

    const apiUrl = `https://${region}.api.blizzard.com/data/wow/realm/index?namespace=dynamic-${region}&locale=en_US&access_token=${token}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    const realmSelect = document.getElementById('realm');
    realmSelect.innerHTML = '<option value="" disabled selected>Select Realm</option>';

    data.realms.forEach(realm => {
        const option = document.createElement('option');
        option.value = realm.slug;
        option.textContent = realm.name;
        realmSelect.appendChild(option);
    });
}

async function getMounts(character, realm, region) {
    const clientId = 'VOTRE_CLIENT_ID';
    const clientSecret = 'VOTRE_CLIENT_SECRET';

    const tokenUrl = `https://${region}.battle.net/oauth/token`;
    const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });
    const tokenData = await tokenResponse.json();
    const token = tokenData.access_token;

    const apiUrl = `https://${region}.api.blizzard.com/profile/wow/character/${realm}/${character}/collections/mounts?namespace=profile-${region}&locale=en_US&access_token=${token}`;
    const response = await fetch(apiUrl);
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
