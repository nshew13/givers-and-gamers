import { Qgiv } from 'qgiv/qgiv';

document.addEventListener('DOMContentLoaded', () => {
    const qgiv = new Qgiv();

    document.getElementById('btnStopPolling').addEventListener('click', () => {
        qgiv.stopPolling();
    });

    document.getElementById('btnRestart').addEventListener('click', () => {
        localStorage.clear();
        window.location.reload();
    });
});
