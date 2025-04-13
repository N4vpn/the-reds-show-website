// API ကနေ ဒေတာယူဖို့
async function fetchMatchData() {
    try {
        const response = await fetch('https://football.redsport.live/api/test');
        const data = await response.json();
        return Array.isArray(data) ? data : [data]; // Array မဟုတ်ရင် Array အဖြစ်ပြောင်းမယ်
    } catch (error) {
        console.error('API ဒေတာယူရာမှာ အမှားဖြစ်သည်:', error);
        document.getElementById('matches').innerHTML = '<p>ပွဲစဉ်များ မရရှိပါ။</p>';
        return [];
    }
}

// Live ဖြစ်မဖြစ် စစ်ဆေးဖို့
function isLive(matchDate) {
    const matchTime = new Date(matchDate);
    const currentTime = new Date();
    return matchTime <= currentTime; // date <= current date ဆိုရင် Live
}

// ပင်မစာမျက်နှာမှာ ပွဲစဉ်တွေပြဖို့
async function displayMatchList() {
    const matchesDiv = document.getElementById('matches');
    const matches = await fetchMatchData();
    
    if (matches.length === 0) {
        matchesDiv.innerHTML = '<p>လက်ရှိ ပွဲစဉ်များ မရှိပါ။</p>';
        return;
    }

    matchesDiv.innerHTML = '';
    matches.forEach((match, index) => {
        const isLiveMatch = isLive(match.date);
        const matchDiv = document.createElement('div');
        matchDiv.className = 'match';
        matchDiv.innerHTML = `
            <img src="${match.home.logo}" alt="${match.home.name}">
            <div class="match-info">
                <p><strong>${match.home.name}</strong> vs <strong>${match.away.name}</strong></p>
                <p>ရမှတ်: ${match.home.score} - ${match.away.score}</p>
                <p>လိဂ်: ${match.league}</p>
                <p>ရက်စွဲ: ${match.date}</p>
            </div>
            <img src="${match.away.logo}" alt="${match.away.name}">
            <a href="${isLiveMatch ? `video.html?match=${index}` : '#'}" class="match-status ${isLiveMatch ? 'live' : 'vs'}">
                ${isLiveMatch ? 'Live' : 'VS'}
            </a>
        `;
        matchesDiv.appendChild(matchDiv);
    });
}

// ဗီဒီယိုစာမျက်နှာမှာ ပွဲစဉ်အချက်အလက်ပြဖို့
async function displayVideoPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const matchIndex = urlParams.get('match');
    const matches = await fetchMatchData();
    
    if (!matches[matchIndex]) {
        document.getElementById('match-details').innerHTML = '<p>ပွဲစဉ်မရှိပါ။</p>';
        return;
    }

    const match = matches[matchIndex];
    const videoUrl = match.video_links[0].url;

    // ဗီဒီယိုပလေယာကို စဖွင့်ပါ
    const videoSource = document.getElementById('video-source');
    videoSource.setAttribute('src', videoUrl);
    const player = videojs('my-video', {
        controls: true,
        autoplay: false,
        preload: 'auto',
        fluid: true
    });

    // ပွဲစဉ်အချက်အလက်တွေပြပါ
    const matchDetails = document.getElementById('match-details');
    matchDetails.innerHTML = `
        <p><strong>လိဂ်</strong>: ${match.league}</p>
        <p><strong>ရက်စွဲ</strong>: ${match.date}</p>
        <div class="team">
            <img src="${match.home.logo}" alt="${match.home.name}">
            <span>${match.home.name}</span>
            <span class="score">${match.home.score} - ${match.away.score}</span>
            <span>${match.away.name}</span>
            <img src="${match.away.logo}" alt="${match.away.name}">
        </div>
    `;
}

// စာမျက်နှာဖွင့်တာနဲ့ လုပ်ဆောင်မှုများ
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        displayMatchList();
    } else if (window.location.pathname.includes('video.html')) {
        displayVideoPage();
    }
});
