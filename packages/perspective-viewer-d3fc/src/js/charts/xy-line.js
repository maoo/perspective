/******************************************************************************
 *
 * Copyright (c) 2017, the Perspective Authors.
 *
 * This file is part of the Perspective library, distributed under the terms of
 * the Apache License 2.0.  The full license can be found in the LICENSE file.
 *
 */
import * as fc from "d3fc";
import {transposeData} from "../data/transposeData";
import {axisFactory} from "../axis/axisFactory";
import {chartSvgFactory} from "../axis/chartFactory";
import {lineSeries} from "../series/lineSeries";
import {splitData} from "../data/splitData";
import {seriesColors} from "../series/seriesColors";
import {filterDataByGroup} from "../legend/filter";
import withGridLines from "../gridlines/gridlines";
import {hardLimitZeroPadding} from "../d3fc/padding/hardLimitZero";
import zoomableChart from "../zoom/zoomableChart";
import {pointData} from "../data/pointData";
import nearbyTip from "../tooltip/nearbyTip";

function xyLine(container, settings) {
    const data = pointData(settings, filterDataByGroup(settings));

    const data2 = splitData(settings, filterDataByGroup(settings));
    // const half = Math.floor(asdf.length / 2);
    // const data2 = asdf.splice(0, half);
    console.error(data2);

    const color = seriesColors(settings);

    const series = fc
        .seriesSvgRepeat()
        .series(lineSeries(settings, color))
        .orient("horizontal");

    const axisDefault = () =>
        axisFactory(settings)
            .settingName("mainValues")
            .paddingStrategy(hardLimitZeroPadding())
            .pad([0.1, 0.1]);

    const xAxis = axisDefault()
        .settingValue(settings.mainValues[0].name)
        .settingName("mainValues")
        .valueName("x")(data);
    const yAxis = axisDefault()
        .orient("vertical")
        .settingValue(settings.mainValues[1].name)
        .valueName("y")(data);

    const plotSeries = withGridLines(series, settings).orient("vertical");

    const chart = chartSvgFactory(xAxis, yAxis)
        .xLabel(settings.mainValues[0].name)
        .yLabel(settings.mainValues[1].name)
        .plotArea(plotSeries);

    chart.xNice && chart.xNice();
    chart.yNice && chart.yNice();

    const zoomChart = zoomableChart()
        .chart(chart)
        .settings(settings)
        .xScale(xAxis.scale)
        .yScale(yAxis.scale);

    const toolTip = nearbyTip()
        .settings(settings)
        .xScale(xAxis.scale)
        .yScale(yAxis.scale)
        .color(color)
        .data(data2);

    // render
    container.datum(data2).call(zoomChart);
    container.call(toolTip);
}

xyLine.plugin = {
    type: "d3_xy_line",
    name: "X/Y Line Chart",
    max_cells: 50000,
    max_columns: 50,
    initial: {
        type: "number",
        count: 2,
        names: ["X Axis", "Y Axis"]
    },
    selectMode: "toggle"
};

export default xyLine;
