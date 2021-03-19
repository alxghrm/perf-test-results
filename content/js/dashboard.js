/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 66.66666666666667, "KoPercent": 33.333333333333336};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.391304347826087, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Payment Instrument  Customer nr 4"], "isController": false}, {"data": [0.5, 500, 1500, "Create Payment Instrument Customer nr 6"], "isController": false}, {"data": [1.0, 500, 1500, "Get Payment Instrument  Customer nr 3"], "isController": false}, {"data": [0.5, 500, 1500, "Create Payment Instrument Customer nr 5"], "isController": false}, {"data": [1.0, 500, 1500, "Get Payment Instrument  Customer nr 2"], "isController": false}, {"data": [1.0, 500, 1500, "Get Payment Instrument  Customer nr 1"], "isController": false}, {"data": [0.5, 500, 1500, "Create Payment Instrument Customer nr 2"], "isController": false}, {"data": [0.5, 500, 1500, "Create Payment Instrument Customer nr 1"], "isController": false}, {"data": [0.5, 500, 1500, "Create Payment Instrument Customer nr 4"], "isController": false}, {"data": [1.0, 500, 1500, "Get Payment Instrument  Customer nr 6"], "isController": false}, {"data": [0.5, 500, 1500, "Create Payment Instrument Customer nr 3"], "isController": false}, {"data": [1.0, 500, 1500, "Get Payment Instrument  Customer nr 5"], "isController": false}, {"data": [0.0, 500, 1500, "Acquiring Process  Customer nr 6"], "isController": false}, {"data": [0.0, 500, 1500, "Acquiring Process  Customer nr 5"], "isController": false}, {"data": [0.0, 500, 1500, "Acquiring Process  Customer nr 4"], "isController": false}, {"data": [0.0, 500, 1500, "Acquiring Process  Customer nr 3"], "isController": false}, {"data": [0.0, 500, 1500, "Acquiring Process  Customer nr 2"], "isController": false}, {"data": [0.0, 500, 1500, "Acquiring Process  Customer nr 1"], "isController": false}, {"data": [0.0, 500, 1500, "Prysym Transaction "], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 18, 6, 33.333333333333336, 6627.611111111111, 290, 18744, 878.0, 18709.8, 18744.0, 18744.0, 0.15082324353764298, 0.10958251288281871, 0.09622837152792325], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Payment Instrument  Customer nr 4", 1, 0, 0.0, 290.0, 290, 290, 290.0, 290.0, 290.0, 290.0, 3.4482758620689653, 2.8657058189655173, 1.064116379310345], "isController": false}, {"data": ["Create Payment Instrument Customer nr 6", 1, 0, 0.0, 660.0, 660, 660, 660.0, 660.0, 660.0, 660.0, 1.5151515151515151, 1.2591737689393938, 0.9750828598484848], "isController": false}, {"data": ["Get Payment Instrument  Customer nr 3", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 2.855858032646048, 1.0604596219931273], "isController": false}, {"data": ["Create Payment Instrument Customer nr 5", 1, 0, 0.0, 1097.0, 1097, 1097, 1097.0, 1097.0, 1097.0, 1097.0, 0.9115770282588879, 0.7575703623518687, 0.5866496695533273], "isController": false}, {"data": ["Get Payment Instrument  Customer nr 2", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 2.82671662414966, 1.049638605442177], "isController": false}, {"data": ["Get Payment Instrument  Customer nr 1", 1, 0, 0.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 2.8460776969178085, 1.0568279109589043], "isController": false}, {"data": ["Create Payment Instrument Customer nr 2", 1, 0, 0.0, 1096.0, 1096, 1096, 1096.0, 1096.0, 1096.0, 1096.0, 0.9124087591240876, 0.7582615761861313, 0.587184933850365], "isController": false}, {"data": ["Create Payment Instrument Customer nr 1", 1, 0, 0.0, 1143.0, 1143, 1143, 1143.0, 1143.0, 1143.0, 1143.0, 0.8748906386701663, 0.7270819663167104, 0.5630399715660542], "isController": false}, {"data": ["Create Payment Instrument Customer nr 4", 1, 0, 0.0, 655.0, 655, 655, 655.0, 655.0, 655.0, 655.0, 1.5267175572519083, 1.268785782442748, 0.9825262404580152], "isController": false}, {"data": ["Get Payment Instrument  Customer nr 6", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 2.855858032646048, 1.0604596219931273], "isController": false}, {"data": ["Create Payment Instrument Customer nr 3", 1, 0, 0.0, 657.0, 657, 657, 657.0, 657.0, 657.0, 657.0, 1.5220700152207, 1.2649234208523592, 0.9795352929984779], "isController": false}, {"data": ["Get Payment Instrument  Customer nr 5", 1, 0, 0.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 2.8460776969178085, 1.0568279109589043], "isController": false}, {"data": ["Acquiring Process  Customer nr 6", 1, 1, 100.0, 18695.0, 18695, 18695, 18695.0, 18695.0, 18695.0, 18695.0, 0.053490238031559244, 0.027685377106178122, 0.05145301216902915], "isController": false}, {"data": ["Acquiring Process  Customer nr 5", 1, 1, 100.0, 18744.0, 18744, 18744, 18744.0, 18744.0, 18744.0, 18744.0, 0.05335040546308152, 0.02761300282757149, 0.05131850525501494], "isController": false}, {"data": ["Acquiring Process  Customer nr 4", 1, 1, 100.0, 18691.0, 18691, 18691, 18691.0, 18691.0, 18691.0, 18691.0, 0.05350168530308705, 0.02769130196351185, 0.051464023460489006], "isController": false}, {"data": ["Acquiring Process  Customer nr 3", 1, 1, 100.0, 18702.0, 18702, 18702, 18702.0, 18702.0, 18702.0, 18702.0, 0.05347021708908138, 0.0276750147043097, 0.05143375374291519], "isController": false}, {"data": ["Acquiring Process  Customer nr 2", 1, 1, 100.0, 18701.0, 18701, 18701, 18701.0, 18701.0, 18701.0, 18701.0, 0.05347307630607989, 0.027676494572482755, 0.051436504063953795], "isController": false}, {"data": ["Acquiring Process  Customer nr 1", 1, 1, 100.0, 18706.0, 18706, 18706, 18706.0, 18706.0, 18706.0, 18706.0, 0.053458783278092586, 0.027669096813856518, 0.05142275539933711], "isController": false}, {"data": ["Prysym Transaction ", 5, 5, 100.0, 19930.2, 19636, 20141, 20091.0, 20141.0, 20141.0, 20141.0, 0.050108233784975545, 0.10922029082818888, 0.09591029122905476], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 6, 100.0, 33.333333333333336], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 18, 6, "400", 6, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Acquiring Process  Customer nr 6", 1, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Acquiring Process  Customer nr 5", 1, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Acquiring Process  Customer nr 4", 1, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Acquiring Process  Customer nr 3", 1, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Acquiring Process  Customer nr 2", 1, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Acquiring Process  Customer nr 1", 1, 1, "400", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
