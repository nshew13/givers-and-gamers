import * as d3 from 'd3';

export class Drawing {
    private _scaleX = d3.scaleLinear()
        .domain([0, d3.max(data)])
        .range([0, width]);

    public initBar () {
    }

}
