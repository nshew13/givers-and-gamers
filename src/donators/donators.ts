// import * as $ from 'jquery';
import { tap } from 'rxjs/operators';

import { QGiv } from 'qgiv/qgiv';
import { IDonation } from 'qgiv/qgiv.interface';
import { GGFeed } from 'mock/gg-feed-mock';

import './donators.scss';


document.addEventListener('DOMContentLoaded', () => {
    const qgiv = new QGiv();
    
    // qgiv.getTransactions().subscribe((result) => {
    //     output1JQO.html(JSON.stringify(result, null, 2));
    // });
    
    function showAchievement() {
        $('#achievement .circle').removeClass('rotate');
        // Run the animations
        setTimeout(function () {
            $('#achievement').addClass('expand');
            setTimeout(function () {
                $('#achievement').addClass('widen');
                setTimeout(function () {
                    $('#achievement .copy').addClass('show');
                }, 1000);
            }, 1000);
        }, 1000);
        // Hide the achievement
        // setTimeout(function () {
        //     hideAchievement();
        // }, 4000);
    }
    
    function hideAchievement() {
        setTimeout(function () {
            $('#achievement .copy').removeClass('show');
            setTimeout(function () {
                $('#achievement').removeClass('widen');
                $('#achievement .circle').addClass('rotate');
                setTimeout(function () {
                    $('#achievement').removeClass('expand');
                    $('.refresh').fadeIn(300);
                }, 1000);
            }, 1000);
        }, 3000);
        
        $('.refresh').click(function () {
            showAchievement();
            $(this).fadeOut(300);
        });
    }
    
    console.log('got here');
    showAchievement();
    
    // TEMP: donation simulator
    const nameEl = document.getElementById('h4#donor');
    const locationEl = document.getElementById('p#loc');
    GGFeed.simulateFeed().subscribe((donation: IDonation) => {
        nameEl.textContent = donation.displayName;
        locationEl.textContent = donation.location;
    });
    
    // qgiv.watchTransactions().pipe(
    //     tap((result) => {
    //         // output2JQO.prepend('total: ' + qgiv.totalAmount + "\n" + result.length + " records:\n" + JSON.stringify(result, null, 2) + "\n\n");
    //         myChart.data.datasets[0].data[0] = qgiv.totalAmount;
    //         myChart.update();
    //     }),
    // ).subscribe();
});
