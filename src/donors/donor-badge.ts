import { IDonation } from 'qgiv/qgiv.interface';

// TODO: test looooooong names
// TODO: there's a memory leak (on the order of 100MB). It looks like DIVs aren't cleaned up.

export class DonorBadge {
    private _badgeEl: HTMLDivElement;
    private _donation: IDonation;

    /**
     * cumulative time of all transitions to show, in milliseconds
     *
     * This is $durationSpin + $durationFade.
     */
    public static readonly ANIMATION_DURATION_MSEC = 1300;

    /**
     * length of time between fade in and fade out
     */
    public static readonly SHOW_DURATION_MSEC = 4000;

    private static _HTML_BODY: HTMLBodyElement;
    private static _HTML_TEMPLATE: HTMLTemplateElement;

    public constructor (donation: IDonation) {
        this._donation = Object.assign({}, donation);

        const badgeTpl = document.importNode(DonorBadge._HTML_TEMPLATE.content, true);
        this._badgeEl = badgeTpl.querySelector('div.donation');

        badgeTpl.querySelector('div.donor > p.name').textContent = donation.displayName;
        badgeTpl.querySelector('div.donor > p.loc').textContent = donation.location;
        DonorBadge._HTML_BODY.appendChild(badgeTpl);

        this._restyle();
    }

    public get element (): HTMLDivElement {
        return this._badgeEl;
    }

    public get id (): string | number {
        return this._donation.id;
    }

    public show (): void {
        console.log('showing badge ' + this._donation.id);
        this._badgeEl.classList.add('show', 'expand');
        this._restyle();
    }

    public hide (remove = false): void {
        console.log('hiding badge ' + this._donation.id);
        this._badgeEl.classList.remove('show');
        this._restyle();

        if (remove) {
            // TODO: must destroy the reference to this instance
            setTimeout(() => { this._badgeEl.remove(); },
                DonorBadge.ANIMATION_DURATION_MSEC
            );
        }
    }

    private _restyle () {
        // force the browser to calculate the styles of the new badge
        // https://stackoverflow.com/a/6918307/356016
        window.getComputedStyle(this._badgeEl).getPropertyValue('top');
    }

    public static init (): void {
        if (document.readyState === 'loading') {
            // wait for DOM to be ready
            document.addEventListener('DOMContentLoaded', DonorBadge._onReady);
        } else {
            DonorBadge._onReady();
        }
    }

    private static _onReady () {
        DonorBadge._HTML_BODY = document.getElementsByTagName('body')[0];
        DonorBadge._HTML_TEMPLATE = document.getElementById('donorBadgeTpl') as HTMLTemplateElement;
    }
}
