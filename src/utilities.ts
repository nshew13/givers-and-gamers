export class Utilities {

    public notify (msg: string) {
        let notifier: Notification;

        const options = {
            body: msg,
            tag: 'tag string',
            // icon: 'https://i.kym-cdn.com/entries/icons/original/000/020/077/dndnextlogo.jpg',
            icon: 'https://scontent.flex2-1.fna.fbcdn.net/v/t1.0-9/117400558_191895378951018_6498288682219824371_n.png?_nc_cat=107&ccb=2&_nc_sid=09cbfe&_nc_ohc=XoMbje2n5akAX-8uoC1&_nc_ht=scontent.flex2-1.fna&oh=baafbabcff51b02b23510f6a634a543e&oe=5FC50540',
            silent: true, // not supported by Firefox
        };

        if (!('Notification' in window)) {
            console.warn('This browser does not support desktop notification');
            this.notify = () => false;
        } else if (Notification.permission === 'granted') {
            notifier = new Notification('Givers & Gamers', options);
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    notifier = new Notification('Givers & Gamers', options);
                }
            });
        }
    }
}
