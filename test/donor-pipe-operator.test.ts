import { suite, test } from '@testdeck/jest';
import { mocked } from 'ts-jest/utils';
import { TestScheduler } from 'rxjs/testing';
import { formatISO } from 'date-fns';

import { QGiv } from '../src/qgiv/qgiv';
import { DonorBadge } from '../src/donors/donor-badge';
import { IDonation } from 'qgiv/qgiv.interface';

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

    // instance method = beforeEach
    before () {
        jest.mock('../src/qgiv/qgiv');
        this._qgiv = new QGiv();

        // initialize TestScheduler and tell it how to use our assertions
        this._testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });

        this._marbleDelay = DonorBadge.ANIMATION_DURATION_MSEC * 2 + DonorBadge.SHOW_DURATION_MSEC;
    }

    @test
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

            const dly = this._marbleDelay + 's';
            const subs     = '^------------ 4s ------!';
            const expected      = `--ab 4s c 99s de -|`;
            const expectedPiped = `${dly} a ${dly} b 5s c 100s d ${dly} e -|`;

            expectObservable(this._qgiv.watchTransactions().pipe(
		        DonorBadge.donorPipe(),
            )).toBe(expectedPiped, marbleValues);
            // expectSubscriptions(donationStream.subscriptions).toBe(subs);
        });
    }

    @test
    marbleTest2 () {
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

            const dly = this._marbleDelay + 's';
            const subs     = '^------------ 4s ------!';
            // const expected = `--a ${dly} b 5s c 100s d ${dly} e -|`;
            const expected = `--ab 4s c 99s de -|`;

            expectObservable(this._qgiv.watchTransactions()).toBe(expected, marbleValues);
            // expectSubscriptions(donationStream.subscriptions).toBe(subs);
        });
    }
}
