// API ကနေ ဒေတာယူဖို့
async function fetchMatchData() {
    try {
        const response = await fetch('https://football.redsport.live/api/test');
        const data = await response.json();
        console.log('API Data:', data); // ဒေတာကို ရိုက်ထုတ်ကြည့်မယ်
        return Array.isArray(data) ? data : [data];
    } catch (error) {
        console.error('API ဒေတာယူရာမှာ အမှားဖြစ်သည်:', error);
        document.getElementById('matches') && (document.getElementById('matches').innerHTML = '<p>ပွဲစဉ်များ မရရှိပါ။</p>');
        return [];
    }
}

// Live ဖြစ်မဖြစ် စစ်ဆေးဖို့
function isLive(matchDate) {
    try {
        const matchTime = new Date(matchDate);
        const currentTime = new Date();
        return matchTime <= currentTime;
    } catch (error) {
        console.error('Date စစ်ဆေးရာမှာ အမှားဖြစ်သည်:', error);
        return false; // ရက်စွဲမမှန်ရင် Live မဟုတ်ဘူးလို့ ယူဆမယ်
    }
}

// ပင်မစာမျက်နှာမှာ ပွဲစဉ်တွေပြဖို့
async function displayMatchList() {
    const matchesDiv = document.getElementById('matches');
    if (!matchesDiv) return;

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
            <img src="${match.home?.logo || 'https://via.placeholder.com/40'}" alt="${match.home?.name || 'Unknown'}">
            <div class="match-info">
                <p><strong>${match.home?.name || 'Unknown'}</strong> vs <strong>${match.away?.name || 'Unknown'}</strong></p>
                <p>ရမှတ်: ${match.home?.score || '0'} - ${match.away?.score || '0'}</p>
                <p>လိဂ်: ${match.league || 'Unknown'}</p>
                <p>ရက်စွဲ: ${match.date || 'Unknown'}</p>
            </div>
            <img src="${match.away?.logo || 'https://via.placeholder.com/40'}" alt="${match.away?.name || 'Unknown'}">
            <a href="${isLiveMatch && match.video_links?.length > 0 ? `video.html?match=${index}` : '#'}" class="match-status ${isLiveMatch ? 'live' : 'vs'}">
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
    const matchDetails = document.getElementById('match-details');

    if (!matchDetails) return;

    // matchIndex မမှန်ရင် ဒါမှမဟုတ် matches ထဲမှာ မရှိရင်
    if (!matchIndex || !matches[matchIndex]) {
        matchDetails.innerHTML = '<p>ပွဲစဉ်မရှိပါ။</p>';
        return;
    }

    const match = matches[matchIndex];

    // video_links မရှိရင် ဒါမှမဟုတ် ဗလာဖြစ်နေရင်
    if (!match.video_links || match.video_links.length === 0) {
        matchDetails.innerHTML = '<p>ဗီဒီယိုလင့်မရှိပါ။</p>';
        return;
    }

    const videoUrl = match.video_links[0].url;

    // ဗီဒီယိုပလေယာကို စဖွင့်ပါ
    const videoSource = document.getElementById('video-source');
    if (videoSource) {
        videoSource.setAttribute('src', videoUrl);
        const player = videojs('my-video', {
            controls: true,
            autoplay: false,
            preload: 'auto',
            fluid: true
        });
    }

    // ပွဲစဉ်အချက်အလက်တွေပြပါ
    matchDetails.innerHTML = `
        <p><strong>လိဂ်</strong>: ${match.league || 'Unknown'}</p>
        <p><strong>ရက်စွဲ</strong>: ${match.date || 'Unknown'}</p>
        <div class="team">
            <img src="${match.home?.logo || 'https://via.placeholder.com/50'}" alt="${match.home?.name || 'Unknown'}">
            <span>${match.home?.name || 'Unknown'}</span>
            <span class="score">${match.home?.score || '0'} - ${match.away?.score || '0'}</span>
            <span>${match.away?.name || 'Unknown'}</span>
            <img src="${match.away?.logo || 'https://via.placeholder.com/50'}" alt="${match.away?.name || 'Unknown'}">
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
