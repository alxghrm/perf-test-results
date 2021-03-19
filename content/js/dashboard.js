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

    var data = {"OkPercent": 98.94179894179894, "KoPercent": 1.0582010582010581};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.378, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "Create Payment Instrument Customer nr 2"], "isController": false}, {"data": [0.5, 500, 1500, "Create Payment Instrument Customer nr 1"], "isController": false}, {"data": [0.5, 500, 1500, "Create Payment Instrument Customer nr 3"], "isController": false}, {"data": [0.0, 500, 1500, "Acquiring Process  Customer nr 3"], "isController": false}, {"data": [0.0, 500, 1500, "Acquiring Process  Customer nr 2"], "isController": false}, {"data": [0.0, 500, 1500, "Acquiring Process  Customer nr 1"], "isController": false}, {"data": [0.0, 500, 1500, "Prysym Transaction "], "isController": true}, {"data": [1.0, 500, 1500, "Get Payment Instrument  Customer nr 3"], "isController": false}, {"data": [1.0, 500, 1500, "Get Payment Instrument  Customer nr 2"], "isController": false}, {"data": [1.0, 500, 1500, "Get Payment Instrument  Customer nr 1"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 189, 2, 1.0582010582010581, 1440.6402116402119, 287, 4373, 657.0, 3479.0, 3829.0, 4329.799999999999, 1.2504879549559682, 1.2740328153843101, 0.7851086692227788], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Create Payment Instrument Customer nr 2", 21, 0, 0.0, 660.1904761904763, 642, 695, 656.0, 679.0, 693.5, 695.0, 0.23892687699816822, 0.19856130109906364, 0.1537625116619071], "isController": false}, {"data": ["Create Payment Instrument Customer nr 1", 35, 0, 0.0, 697.7714285714286, 643, 1152, 659.0, 841.3999999999994, 1126.3999999999999, 1152.0, 0.23593649937645353, 0.19607613375914254, 0.1518380401260575], "isController": false}, {"data": ["Create Payment Instrument Customer nr 3", 7, 0, 0.0, 653.4285714285713, 643, 666, 657.0, 666.0, 666.0, 666.0, 0.25853154084798347, 0.21485384888831438, 0.16637918497931747], "isController": false}, {"data": ["Acquiring Process  Customer nr 3", 7, 0, 0.0, 3403.2857142857147, 2949, 4373, 3295.0, 4373.0, 4373.0, 4373.0, 0.23731226904430958, 0.32166936468115404, 0.22827400879750484], "isController": false}, {"data": ["Acquiring Process  Customer nr 2", 21, 1, 4.761904761904762, 3366.619047619048, 2654, 3914, 3399.0, 3876.2, 3910.6, 3914.0, 0.2336968617849989, 0.3304076306198531, 0.21409171210772313], "isController": false}, {"data": ["Acquiring Process  Customer nr 1", 35, 1, 2.857142857142857, 3323.0285714285715, 2504, 4325, 3332.0, 3918.2, 4323.4, 4325.0, 0.23385717340175327, 0.32517500659811316, 0.21852334646274324], "isController": false}, {"data": ["Prysym Transaction ", 61, 0, 0.0, 4347.55737704918, 3712, 5697, 4301.0, 4873.6, 5259.4, 5697.0, 0.4033697909089707, 1.2171998573327338, 0.7720749904117017], "isController": true}, {"data": ["Get Payment Instrument  Customer nr 3", 7, 0, 0.0, 293.1428571428571, 289, 299, 292.0, 299.0, 299.0, 299.0, 0.2620741295394983, 0.2177979338262823, 0.08087443841257956], "isController": false}, {"data": ["Get Payment Instrument  Customer nr 2", 21, 0, 0.0, 296.952380952381, 287, 313, 295.0, 311.2, 312.9, 313.0, 0.2399478970280739, 0.19940982458094814, 0.07404642134850718], "isController": false}, {"data": ["Get Payment Instrument  Customer nr 1", 35, 0, 0.0, 294.4285714285714, 288, 303, 294.0, 298.4, 299.79999999999995, 303.0, 0.23735733128979974, 0.1972569227808785, 0.07324698895271164], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, 100.0, 1.0582010582010581], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 189, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Acquiring Process  Customer nr 2", 21, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Acquiring Process  Customer nr 1", 35, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
