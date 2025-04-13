// API ကနေ ဒေတာယူဖို့
async function fetchMatchData() {
    try {
        const response = await fetch('https://football.redsport.live/api/test');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API ဒေတာယူရာမှာ အမှားဖြစ်သည်:', error);
        document.getElementById('match-details').innerHTML = '<p>ပွဲစဉ်ဒေတာများ မရရှိပါ။</p>';
        return null;
    }
}

// ဗီဒီယိုပလေယာကို စဖွင့်ပါ
function initVideoPlayer(videoUrl) {
    const videoSource = document.getElementById('video-source');
    videoSource.setAttribute('src', videoUrl);
    
    // Video.js ကို စတင်ပါ
    const player = videojs('my-video', {
        controls: true,
        autoplay: false,
        preload: 'auto',
        fluid: true
    });
}

// ပွဲစဉ်အချက်အလက်တွေကို ပြပါ
function displayMatchDetails(data) {
    const matchDetails = document.getElementById('match-details');
    matchDetails.innerHTML = `
        <p><strong>လိဂ်</strong>: ${data.league}</p>
        <p><strong>ရက်စွဲ</strong>: ${data.date}</p>
        <div class="team">
            <img src="${data.home.logo}" alt="${data.home.name}">
            <span>${data.home.name}</span>
            <span class="score">${data.home.score} - ${data.away.score}</span>
            <span>${data.away.name}</span>
            <img src="${data.away.logo}" alt="${data.away.name}">
        </div>
    `;
}

// အားလုံးကို စဖွင့်ပါ
document.addEventListener('DOMContentLoaded', async () => {
    const matchData = await fetchMatchData();
    if (matchData) {
        // ဗီဒီယိုလင့်ကို ယူပါ
        const videoUrl = matchData.video_links[0].url;
        initVideoPlayer(videoUrl);
        displayMatchDetails(matchData);
    }
});
