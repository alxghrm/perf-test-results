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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.37897310513447435, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Acquiring Process  Customer nr 10"], "isController": false}, {"data": [0.5, 500, 1500, "Create Payment Instrument Customer nr 2"], "isController": false}, {"data": [0.5, 500, 1500, "Create Payment Instrument Customer nr 1"], "isController": false}, {"data": [0.5, 500, 1500, "Create Payment Instrument Customer nr 4"], "isController": false}, {"data": [0.5, 500, 1500, "Create Payment Instrument Customer nr 3"], "isController": false}, {"data": [1.0, 500, 1500, "Get Payment Instrument  Customer nr 10"], "isController": false}, {"data": [0.5, 500, 1500, "Create Payment Instrument Customer nr 9"], "isController": false}, {"data": [1.0, 500, 1500, "Get Payment Instrument  Customer nr 4"], "isController": false}, {"data": [0.5, 500, 1500, "Create Payment Instrument Customer nr 6"], "isController": false}, {"data": [1.0, 500, 1500, "Get Payment Instrument  Customer nr 3"], "isController": false}, {"data": [0.5, 500, 1500, "Create Payment Instrument Customer nr 5"], "isController": false}, {"data": [1.0, 500, 1500, "Get Payment Instrument  Customer nr 2"], "isController": false}, {"data": [0.5, 500, 1500, "Create Payment Instrument Customer nr 8"], "isController": false}, {"data": [1.0, 500, 1500, "Get Payment Instrument  Customer nr 1"], "isController": false}, {"data": [0.5, 500, 1500, "Create Payment Instrument Customer nr 7"], "isController": false}, {"data": [1.0, 500, 1500, "Get Payment Instrument  Customer nr 8"], "isController": false}, {"data": [0.5, 500, 1500, "Create Payment Instrument Customer nr 10"], "isController": false}, {"data": [1.0, 500, 1500, "Get Payment Instrument  Customer nr 7"], "isController": false}, {"data": [1.0, 500, 1500, "Get Payment Instrument  Customer nr 6"], "isController": false}, {"data": [0.0, 500, 1500, "Acquiring Process  Customer nr 9"], "isController": false}, {"data": [1.0, 500, 1500, "Get Payment Instrument  Customer nr 5"], "isController": false}, {"data": [0.0, 500, 1500, "Acquiring Process  Customer nr 8"], "isController": false}, {"data": [0.0, 500, 1500, "Acquiring Process  Customer nr 7"], "isController": false}, {"data": [0.0, 500, 1500, "Acquiring Process  Customer nr 6"], "isController": false}, {"data": [0.0, 500, 1500, "Acquiring Process  Customer nr 5"], "isController": false}, {"data": [0.0, 500, 1500, "Acquiring Process  Customer nr 4"], "isController": false}, {"data": [1.0, 500, 1500, "Get Payment Instrument  Customer nr 9"], "isController": false}, {"data": [0.0, 500, 1500, "Acquiring Process  Customer nr 3"], "isController": false}, {"data": [0.0, 500, 1500, "Acquiring Process  Customer nr 2"], "isController": false}, {"data": [0.0, 500, 1500, "Acquiring Process  Customer nr 1"], "isController": false}, {"data": [0.0, 500, 1500, "Prysym Transaction "], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 620, 0, 0.0, 1734.8338709677412, 287, 7072, 667.0, 4537.9, 5303.4, 6197.919999999998, 5.46621526308365, 5.495161545396035, 3.4876567955194666], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Acquiring Process  Customer nr 10", 20, 0, 0.0, 4142.450000000001, 2937, 5962, 4001.5, 5843.200000000001, 5956.75, 5962.0, 0.19673808259064707, 0.26667232288654114, 0.18924512827322984], "isController": false}, {"data": ["Create Payment Instrument Customer nr 2", 22, 0, 0.0, 694.8181818181819, 646, 1086, 675.0, 727.8, 1032.4499999999994, 1086.0, 0.19997636642942196, 0.16619129671038876, 0.12869572800487214], "isController": false}, {"data": ["Create Payment Instrument Customer nr 1", 21, 0, 0.0, 697.4285714285713, 643, 1122, 669.0, 737.0, 1083.6999999999994, 1122.0, 0.19701106076384003, 0.1637269655371366, 0.12678739164391659], "isController": false}, {"data": ["Create Payment Instrument Customer nr 4", 21, 0, 0.0, 720.4761904761905, 650, 1209, 677.0, 1050.6000000000004, 1201.1999999999998, 1209.0, 0.20053475935828877, 0.16665535177139038, 0.12905508439171123], "isController": false}, {"data": ["Create Payment Instrument Customer nr 3", 21, 0, 0.0, 692.5714285714286, 649, 1080, 668.0, 727.8, 1044.8999999999996, 1080.0, 0.20233358062993187, 0.16815027062116408, 0.13021272425305186], "isController": false}, {"data": ["Get Payment Instrument  Customer nr 10", 20, 0, 0.0, 322.85, 293, 383, 315.5, 366.20000000000005, 382.2, 383.0, 0.20331401850157568, 0.16896506811019618, 0.06274143539697062], "isController": false}, {"data": ["Create Payment Instrument Customer nr 9", 20, 0, 0.0, 723.1000000000001, 644, 1173, 668.5, 1071.3000000000009, 1169.75, 1173.0, 0.1978689513934921, 0.16443991956627127, 0.1273394911799915], "isController": false}, {"data": ["Get Payment Instrument  Customer nr 4", 21, 0, 0.0, 315.7142857142858, 290, 383, 308.0, 357.2, 380.49999999999994, 383.0, 0.2012226672543646, 0.16722704085299248, 0.062096057473026586], "isController": false}, {"data": ["Create Payment Instrument Customer nr 6", 21, 0, 0.0, 699.7142857142856, 648, 1130, 672.0, 742.2, 1091.6999999999994, 1130.0, 0.2008589109621142, 0.16692473948121012, 0.12926369367581372], "isController": false}, {"data": ["Get Payment Instrument  Customer nr 3", 21, 0, 0.0, 307.7142857142857, 289, 350, 299.0, 343.0, 349.4, 350.0, 0.20387557764747002, 0.16943175447070016, 0.06291472903964894], "isController": false}, {"data": ["Create Payment Instrument Customer nr 5", 21, 0, 0.0, 668.6666666666666, 644, 738, 665.0, 698.0, 734.0999999999999, 738.0, 0.1985308715505261, 0.1649900114155251, 0.12776547299980145], "isController": false}, {"data": ["Get Payment Instrument  Customer nr 2", 21, 0, 0.0, 306.5238095238095, 287, 336, 304.0, 334.4, 336.0, 336.0, 0.20096463022508038, 0.16701259797025725, 0.062016428858520906], "isController": false}, {"data": ["Create Payment Instrument Customer nr 8", 21, 0, 0.0, 670.0, 647, 728, 663.0, 707.0, 726.3, 728.0, 0.20160322565161043, 0.16754330569289108, 0.12974270088321413], "isController": false}, {"data": ["Get Payment Instrument  Customer nr 1", 21, 0, 0.0, 310.0476190476191, 292, 352, 306.0, 343.40000000000003, 351.4, 352.0, 0.1986022186705, 0.16504930477401905, 0.061287403417849606], "isController": false}, {"data": ["Create Payment Instrument Customer nr 7", 20, 0, 0.0, 718.85, 643, 1107, 668.0, 1065.0000000000007, 1106.65, 1107.0, 0.1929198418057297, 0.16032693884441016, 0.12415446850583582], "isController": false}, {"data": ["Get Payment Instrument  Customer nr 8", 20, 0, 0.0, 313.0, 289, 360, 308.0, 342.9, 359.15, 360.0, 0.20415871298347335, 0.16966705541888266, 0.06300210283474374], "isController": false}, {"data": ["Create Payment Instrument Customer nr 10", 20, 0, 0.0, 665.0, 642, 703, 661.0, 698.9, 702.8, 703.0, 0.2025726729464195, 0.16834896941152638, 0.1303665932340727], "isController": false}, {"data": ["Get Payment Instrument  Customer nr 7", 20, 0, 0.0, 312.65, 292, 364, 306.5, 340.6, 362.84999999999997, 364.0, 0.1944201419267036, 0.1615737702926023, 0.05999684067269369], "isController": false}, {"data": ["Get Payment Instrument  Customer nr 6", 21, 0, 0.0, 321.0, 288, 434, 301.0, 395.8, 430.69999999999993, 434.0, 0.20160516109212395, 0.16754491414980224, 0.062214092680772624], "isController": false}, {"data": ["Acquiring Process  Customer nr 9", 20, 0, 0.0, 4207.8499999999985, 3100, 6347, 3825.5, 5693.7, 6314.349999999999, 6347.0, 0.19244832762403294, 0.2608576940841384, 0.18511875264616448], "isController": false}, {"data": ["Get Payment Instrument  Customer nr 5", 21, 0, 0.0, 312.38095238095246, 288, 439, 306.0, 353.2, 430.6999999999999, 439.0, 0.19919185020772864, 0.16553932082693074, 0.06146936002504126], "isController": false}, {"data": ["Acquiring Process  Customer nr 8", 20, 0, 0.0, 4190.849999999999, 3100, 5650, 4044.5, 5484.400000000001, 5642.85, 5650.0, 0.1950610541099364, 0.2643991631880779, 0.18763197099442125], "isController": false}, {"data": ["Acquiring Process  Customer nr 7", 20, 0, 0.0, 4328.05, 2858, 6092, 3992.5, 5875.8, 6081.349999999999, 6092.0, 0.18902341054939653, 0.25621532601812735, 0.1818242767491754], "isController": false}, {"data": ["Acquiring Process  Customer nr 6", 21, 0, 0.0, 4143.2380952380945, 2791, 7072, 3825.0, 6016.000000000001, 6985.5999999999985, 7072.0, 0.19547794357203363, 0.26496424382615497, 0.1880329828305206], "isController": false}, {"data": ["Acquiring Process  Customer nr 5", 21, 0, 0.0, 4231.095238095238, 2825, 6141, 4145.0, 5935.800000000001, 6138.3, 6141.0, 0.1934681468515362, 0.26224002717766826, 0.1860997311023078], "isController": false}, {"data": ["Acquiring Process  Customer nr 4", 21, 0, 0.0, 4129.0, 3070, 6160, 3950.0, 5632.0, 6121.599999999999, 6160.0, 0.1952507577588932, 0.26465630055599976, 0.18781444960206037], "isController": false}, {"data": ["Get Payment Instrument  Customer nr 9", 20, 0, 0.0, 311.8000000000001, 289, 406, 298.0, 383.6000000000001, 405.09999999999997, 406.0, 0.1985407256663523, 0.16499820072467364, 0.06126842706110091], "isController": false}, {"data": ["Acquiring Process  Customer nr 3", 21, 0, 0.0, 4207.190476190476, 3071, 6123, 3870.0, 5623.4, 6073.4, 6123.0, 0.19443724306507168, 0.2635536068108588, 0.18703191837802302], "isController": false}, {"data": ["Acquiring Process  Customer nr 2", 21, 0, 0.0, 4203.0952380952385, 2867, 6675, 3766.0, 6205.6, 6647.2, 6675.0, 0.19450387618438966, 0.26364392592180946, 0.18709601371252327], "isController": false}, {"data": ["Acquiring Process  Customer nr 1", 21, 0, 0.0, 4282.333333333334, 2947, 6224, 4060.0, 6079.8, 6213.2, 6224.0, 0.19145560964936273, 0.2595120958919096, 0.1841638432662327], "isController": false}, {"data": ["Prysym Transaction ", 198, 0, 0.0, 5231.333333333336, 3829, 8052, 4948.0, 6726.0, 7096.75, 7731.239999999997, 1.7912878273849913, 5.405350963495725, 3.4286368571040846], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 620, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
