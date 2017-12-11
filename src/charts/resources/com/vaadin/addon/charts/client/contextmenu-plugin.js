(function (Highcharts) {

    Highcharts.wrap(Highcharts.Chart.prototype, 'firstRender', function (proceed) {

        proceed.call(this);

        var chart = this,
            container = this.container,
            plotLeft = this.plotLeft,
            plotTop = this.plotTop,
            plotWidth = this.plotWidth,
            plotHeight = this.plotHeight,
            inverted = this.inverted,
            pointer = this.pointer;

        if (chart.options.chart.catchRightClick) {
            console.log("handling right-click for this chart");
            container.oncontextmenu = function (e) {

                var hoverPoint = chart.hoverPoint,
                    chartPosition = pointer.chartPosition;

                this.rightClick = true;

                e = pointer.normalize(e);
                e.series = hoverPoint.series;
                e.plotX = hoverPoint.plotX;
                e.plotY = hoverPoint.plotY;

                e.cancelBubble = true; // IE specific
                e.returnValue = false; // IE 8 specific
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
                if (e.preventDefault) {
                    e.preventDefault();
                }

                if (!pointer.hasDragged) {
                    if (hoverPoint && pointer.inClass(e.target, 'highcharts-tracker')) {
                        var plotX = hoverPoint.plotX,
                            plotY = hoverPoint.plotY;

                        // add page position info
                        Highcharts.extend(hoverPoint, {
                            pageX: chartPosition.left + plotLeft +
                            (inverted ? plotWidth - plotY : plotX),
                            pageY: chartPosition.top + plotTop +
                            (inverted ? plotHeight - plotX : plotY)
                        });

                        Highcharts.extend(e, {
                            point: hoverPoint
                        })
                        hoverPoint.firePointEvent('contextmenu', e);
                    }
                }
            }
        }
    });

}(Highcharts));