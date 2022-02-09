export {};

// // TODO: Create a server (proxy) to centralize single requests to Qgiv API

// import { Server, Socket } from 'socket.io';
// import { Dict } from 'utilities/structures.interface';
// import { Qgiv } from 'libs/qgiv/qgiv';
// import { tap } from 'rxjs/operators';

// import { LocketClient } from '../locket/locket-client';
// import { ILocketData } from '../locket/locket.interface';

// // TODO: Let's Encrypt

// const io = new Server({
//     cors: {
//         // TODO: restrict origins
//         origin: 'localhost',
//         // methods: ['GET', 'POST']
//     }
// });

// io.on('connection', (socket: Socket) => {
//     console.log('listener added:', socket.id);

//     // no need to emit back to original, so use socket.broadcast

//     socket.on(LocketClient.EVENT_EMIT_LOG, (locketData: ILocketData) => {
//         locketData.serverEmitMSec = new Date().valueOf();
//         socket.broadcast.emit(LocketClient.EVENT_EMIT_LOG, locketData);
//     });

//     socket.on(LocketClient.EVENT_EMIT_CMD, (args: Dict) => {
//         socket.broadcast.emit(LocketClient.EVENT_EMIT_CMD, args);
//     });
// });

// io.listen(3000);
// console.log('listening on port 3000...');


// // document.addEventListener('DOMContentLoaded', () => {
//     const qgiv = new Qgiv();

//     const socketConsoleStyle = 'color:cyan;';

//     console.log('%csocket begins polling', socketConsoleStyle);
//     qgiv.watchTransactions(10_000, socketConsoleStyle).pipe(
//         tap((x) => { console.log('%csocket received marble', socketConsoleStyle, x.id); }),
//     ).subscribe(
//         () => { /* thumbs up */ },
//         error => { console.log('%csubscribe error', socketConsoleStyle, error); },
//         () => { console.log('%csocket done', socketConsoleStyle); }
//     );
// // });
