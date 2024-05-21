import CONFIG from './config.js';

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

document.getElementById('reset').addEventListener('click', function() {
    resetForm();
});

document.getElementById('status-filter').addEventListener('change', function() {
    const status = document.getElementById('status-filter').value;
    filterMounts(status);
});

async function fetchRealms(region) {
    const clientId = CONFIG.CLIENT_ID;
    const clientSecret = CONFIG.CLIENT_SECRET;

    const tokenUrl = `https://${region}.battle.net/oauth/token`;
    const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });

    if (!tokenResponse.ok) {
        console.error('Failed to obtain access token');
        return;
    }

    const tokenData = await tokenResponse.json();
    const token = tokenData.access_token;

    const apiUrl = `https://${region}.api.blizzard.com/data/wow/realm/index?namespace=dynamic-${region}&locale=fr_FR&access_token=${token}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        console.error('Failed to fetch realms');
        return;
    }

    const data = await response.json();
    const realmSelect = document.getElementById('realm');
    realmSelect.innerHTML = '<option value="" disabled selected>Sélectionner le Royaume</option>';

    // Trier les serveurs par ordre alphabétique
    const sortedRealms = data.realms.sort((a, b) => a.name.localeCompare(b.name));

    sortedRealms.forEach(realm => {
        const option = document.createElement('option');
        option.value = realm.slug;
        option.textContent = realm.name;
        realmSelect.appendChild(option);
    });
}

async function getMounts(character, realm, region) {
    const clientId = CONFIG.CLIENT_ID;
    const clientSecret = CONFIG.CLIENT_SECRET;

    const tokenUrl = `https://${region}.battle.net/oauth/token`;
    const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
            'Content-Type': 'application/x
