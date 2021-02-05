document.addEventListener('DOMContentLoaded', () => {
    const iframe = document.getElementById('leaderboard');
    const iframeSrc = iframe.src;

    const interval = setInterval(() => {
        console.log('refreshing iframe');
        iframe.src = '';
        iframe.src = iframeSrc;
    }, 60_000);
});
