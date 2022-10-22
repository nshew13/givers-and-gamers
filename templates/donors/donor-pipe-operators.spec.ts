import { suite, test } from '@testdeck/jest';
import { mocked } from 'ts-jest/utils';
import { TestScheduler } from 'rxjs/testing';
import { formatISO } from 'date-fns';
// import { JSDOM } from 'jsdom';

import { Qgiv } from 'libs/qgiv/qgiv';
import { DonorBadge } from './donor-badge';
import { pace, donorShowBadge } from './donor-pipe-operators';
import { IQgivDonation } from 'libs/qgiv/qgiv.interface';
import { Observable } from 'rxjs';
import { QgivFeedMock } from 'libs/qgiv/qgiv-feed.mock';
import { take } from 'rxjs/operators';

// jest.mock('../src/qgiv/qgiv');


// jest.mock('../src/donors/donor-badge', () => {
//     return {
//         DonorBadge: jest.fn().mockImplementation(() => {
//             return {
//                 donorPipe: DonorBadge.donorPipe,
//             };
//         })
//     };
// });





@suite
class TestSuite {
    private _marbleDelay: number = 0;

    private _qgiv: Qgiv;
    private _testScheduler: TestScheduler;
    private _mockedDonorBadge: any;

    // instance method = beforeEach
    before () {
        // this._mockedDonorBadge = mocked(DonorBadge, true);
        // this._qgiv = new QGiv();

//         // const dom = new JSDOM();
//         // global.document = dom.window.document;
//         document.body.innerHTML = `<template id="donorBadgeTpl">
//   <div class="donation">
//     <div class="circle"></div>
//     <div class="donor">
//       <p class="name"></p>
//       <p class="loc"></p>
//     </div>
//   </div>
// </template>`;


        // initialize TestScheduler and tell it how to use our assertions
        this._testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });

        this._marbleDelay = DonorBadge.ANIMATION_DURATION_MSEC * 2 + DonorBadge.SHOW_DURATION_MSEC;
    }

    @test.skip
    marbleTest1 () {
        this._testScheduler.run(({ cold, expectObservable, expectSubscriptions }) => {
            // stub watchTransactions with cold()
            jest.spyOn(this._qgiv, 'watchTransactions').mockReturnValue(
                cold('--ab 4s c 99s de -|'/* , QgivFeedMock.marbleValues */)
            );

            const dly = this._marbleDelay + 'ms';
            const subs     = '^------------ 4s ------!';
            const expected      = `--ab 4s c 99s de -|`;
            const expectedPiped = `-- ${dly} a ${dly} b 5s c 100s d ${dly} e -|`;


            expectObservable(this._qgiv.watchTransactions().pipe(
		        this._mockedDonorBadge.donorPipe(),
            )).toBe(expectedPiped/* , QgivFeedMock.marbleValues */);
            // expectSubscriptions(donationStream.subscriptions).toBe(subs);
        });
    }

    @test('test pace operator against incoming batches of donations')
    paceTest1 () {
        this._testScheduler.run(({ cold, expectObservable, expectSubscriptions }) => {
            const dly = '4999ms';

            const marblesIn    = '--ab 4s c 99s de -|';
            const marblesInMap = QgivFeedMock.getMarbleMapInput();

            // remember that pace's delay() affects the first marble
            // const marblesOut    = `-- 5s a ${dly} b ${dly} c ${dly} d ${dly} e -|`;
            const marblesOut    = `-- 5s a ${dly} b ${dly} c ${dly} d e -|`;
            const marblesOutMap = QgivFeedMock.getMarbleMapOutput();

            expectObservable(
                cold(marblesIn, marblesInMap).pipe(
                    take(1),
                    pace(),
                )
            ).toBe(marblesOut, marblesOutMap);

        });
    }
}
