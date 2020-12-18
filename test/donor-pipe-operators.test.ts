import { suite, test } from '@testdeck/jest';
import { mocked } from 'ts-jest/utils';
import { TestScheduler } from 'rxjs/testing';
import { formatISO } from 'date-fns';
// import { JSDOM } from 'jsdom';

import { QGiv } from '../src/qgiv/qgiv';
import { DonorBadge } from '../src/donors/donor-badge';
import { donorPace, donorShowBadge } from '../src/donors/donor-pipe-operators';
import { IDonation } from 'qgiv/qgiv.interface';
import { Observable } from 'rxjs';

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

    private _donationId = 0;
    private _generateDonation (): IDonation {
        return {
            id:           (this._donationId++).toString(),
            status:       'test',
            displayName:  'Bob White',
            anonymous:    false,
            memo:         'memo',
            location:     'Anywhere, KY',
            amount:       50.50,
            // create a timestamp an increasing number of minutes in the future
            timestamp:    formatISO(new Date().valueOf() + this._donationId * 1000 * 60),
        };
    }
    private _marbleDelay: number = 0;

    private _qgiv: QGiv;
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
            /**
             * create the data to map to the marbles
             *
             * We want the values to match the return type of our spied-upon
             * method.
             */
            const marbleValues: { [marble: string]: IDonation[] } = {
                a: [
                    this._generateDonation(),
                    this._generateDonation(),
                    this._generateDonation(),
                    this._generateDonation(),
                ],
                b: [
                    this._generateDonation(),
                    this._generateDonation(),
                    this._generateDonation(),
                    this._generateDonation(),
                    this._generateDonation(),
                    this._generateDonation(),
                    this._generateDonation(),
                    this._generateDonation(),
                    this._generateDonation(),
                    this._generateDonation(),
                ],
                c: [
                    this._generateDonation(),
                    this._generateDonation(),
                ],
                d: [
                    this._generateDonation(),
                    this._generateDonation(),
                    this._generateDonation(),
                    this._generateDonation(),
                    this._generateDonation(),
                    this._generateDonation(),
                    this._generateDonation(),
                ],
                e: [
                    this._generateDonation(),
                ],
            };

            // stub watchTransactions with cold()
            jest.spyOn(this._qgiv, 'watchTransactions').mockReturnValue(
                cold('--ab 4s c 99s de -|', marbleValues)
            );

            const dly = this._marbleDelay + 'ms';
            const subs     = '^------------ 4s ------!';
            const expected      = `--ab 4s c 99s de -|`;
            const expectedPiped = `-- ${dly} a ${dly} b 5s c 100s d ${dly} e -|`;


            expectObservable(this._qgiv.watchTransactions().pipe(
		        this._mockedDonorBadge.donorPipe(),
            )).toBe(expectedPiped, marbleValues);
            // expectSubscriptions(donationStream.subscriptions).toBe(subs);
        });
    }

    @test('test donorPace pipe against incoming batches of donations')
    donorPaceTest1 () {
        this._testScheduler.run(({ cold, expectObservable, expectSubscriptions }) => {
            /**
             * create the data to map to the marbles
             *
             * We want the values to match the return type of our spied-upon
             * method.
             */
            const marbleValues: { [marble: string]: IDonation[] } = {
                a: [
                    this._generateDonation(), // 0
                    this._generateDonation(),
                    this._generateDonation(),
                    this._generateDonation(),
                ],
                b: [
                    this._generateDonation(), // 4
                    this._generateDonation(),
                    this._generateDonation(),
                    this._generateDonation(),
                    this._generateDonation(),
                    this._generateDonation(),
                    this._generateDonation(),
                    this._generateDonation(),
                    this._generateDonation(),
                    this._generateDonation(),
                ],
                c: [
                    this._generateDonation(), // 14
                    this._generateDonation(),
                ],
                d: [
                    this._generateDonation(), // 16
                    this._generateDonation(),
                    this._generateDonation(),
                    this._generateDonation(),
                    this._generateDonation(),
                    this._generateDonation(),
                    this._generateDonation(),
                ],
                e: [
                    this._generateDonation(), // 23
                ],
            };

            // subtract 1 because the notation counts
            const dly = (this._marbleDelay - 1) + 'ms';
            const marblesIn  = '--ab 4s c 99s de -|';
            // const marblesOut = `-- ${dly} a ${dly} b ${dly} c ${dly} d ${dly} e -|`;
            const marblesOut = `-- ${dly} a ${dly} b ${dly} c ${dly} d ${dly} e -|`;

            console.log('marblesOut', marblesOut);

            expectObservable(
                cold(marblesIn, marbleValues).pipe(
                    donorPace(),
                )
            ).toBe(marblesOut, marbleValues);

        });
    }
}
