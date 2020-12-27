import { tap } from 'rxjs/operators';
import { LocketClient } from './locket-client';
import { LocketMonitor } from './locket-monitor';

const monitor = new LocketMonitor();
const locket = new LocketClient();

let msgCount = 0;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnEmitLog').addEventListener('click', () => {
        locket.log('log ' + msgCount++);
    });

    const terminalEl = document.getElementById('terminal');

    monitor.output.pipe(
        tap((msg) => {
            const newEl = document.createElement('li');
            newEl.textContent = JSON.stringify(msg);
            terminalEl.insertBefore(newEl, terminalEl.firstChild);
        }),
    ).subscribe();
});
