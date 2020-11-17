import 'main.scss';
import * as $ from 'jquery';
import { tap } from 'rxjs/operators';
import * as d3 from 'd3';

import { QGiv } from 'qgiv/qgiv';
// import { Utilities } from 'utilities';

$((event) => {
    const output1JQO = $('pre#output1');
    const output2JQO = $('pre#output2');
    const qgiv = new QGiv();

    // qgiv.getTransactions().subscribe((result) => {
    //     output1JQO.html(JSON.stringify(result, null, 2));
    // });

    const svgW = 800;
    const svgH = 600;
    const svg = d3.select('body').append('svg')
        .attr('width', svgW)
        .attr('height', svgH);
    const g = svg.append('g');

    const data = [66.38, 21.51, 23.37, 34.17, 36.21];
    const bar_height = 50;

    const x = d3.scaleLinear()
        .domain([0, d3.max(data)])
        .range([0, svgW])

    console.log('d3.range(data.length)', d3.range(data.length));

    const y = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([0, 20 * data.length])

    const bar = g.selectAll('rect').data(data).join(
        (enter) => {
            const rect_enter = enter.append('rect').attr('x', 0);
            rect_enter.append('title');
            return rect_enter;
        }
    );
    bar.attr('height', bar_height)
        .attr('width', (d) => d * 7)
        .attr('y', (d, i) => i*(bar_height+5));

    const scale = d3.scaleLinear().domain([0, 8000]).range([0, svgW]);
    const axis = d3.axisBottom(scale);
    // create a container to put the axis
    const axis_container = svg.append("g").attr("class", "axis").attr("transform", "translate(0,200)");
    // call axis to create the SVG elements for you
    axis_container.call(axis);

    // qgiv.watchTransactions().pipe(
    //     tap((result) => {
    //         output2JQO.prepend('total: ' + qgiv.totalAmount + "\n" + result.length + " records:\n" + JSON.stringify(result, null, 2) + "\n\n");
    //         data = qgiv.totalAmount;
    //     }),
    // ).subscribe();

    // // create CSV timeline
    // qgiv.getTransactions().subscribe(
    //     (result) => {
    //         let csvData = '<pre>';
    //         result.forEach((value) => {
    //             csvData += '"' + value.timestamp + '",' + value.amount + '\n';
    //         });
    //         csvData += '</pre>';
    //
    //         output1JQO.html(csvData);
    //     }
    // );
    //
    // // create JSON timeline
    // qgiv.getTransactions().subscribe(
    //     (result) => {
    //         const data: object[] = [];
    //         result.forEach((value) => {
    //             data.push({
    //                 'ts': value.timestamp,
    //                 'amt': value.amount,
    //             });
    //         });
    //
    //         output1JQO.html(JSON.stringify(data, null, 2));
    //     }
    // );
    //
    // // fill gauge
    // qgiv.readTransactionsFromFeed(1, 10).subscribe(
    //     (result) => {
    //         const gaugeJQO = $('div#gauge');
    //         gaugeJQO.width((index, width) => width + result.amount);
    //         console.log('width set to', gaugeJQO.width());
    //     }
    // );
});
