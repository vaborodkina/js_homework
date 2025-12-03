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

    var data = {"OkPercent": 0.47041089482028225, "KoPercent": 99.52958910517972};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0030407776074018243, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [4.924167815639157E-5, 500, 1500, "HTTP Request_All caracters"], "isController": false}, {"data": [0.005411255411255411, 500, 1500, "HTTP Request_Changecaracters"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_Delete caracter"], "isController": false}, {"data": [0.004360952700436095, 500, 1500, "HTTP Request_Caracter_by_id"], "isController": false}, {"data": [0.005968262884426345, 500, 1500, "HTTP Request_Create_caracter"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 38477, 38296, 99.52958910517972, 10345.127062920674, 2, 107838, 3546.5, 74412.9, 102604.9, 106636.84000000003, 354.90476410090855, 1715.1229685986716, 0.3530901945072176], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HTTP Request_All caracters", 10154, 10104, 99.50758321843608, 8924.619952727982, 2, 107838, 2634.0, 8372.5, 74427.0, 106873.9, 93.6594904717103, 1060.119080561551, 0.05674860949692844], "isController": false}, {"data": ["HTTP Request_Changecaracters", 6468, 6427, 99.3661100803958, 8761.11750154607, 2, 103699, 3443.0, 8184.0, 34796.349999997474, 102610.93, 62.05209382644985, 156.3001795821941, 0.08950066256535713], "isController": false}, {"data": ["HTTP Request_Delete caracter", 5791, 5791, 100.0, 5944.547573821448, 25, 102239, 3178.0, 7048.600000000003, 29117.8, 63845.24, 56.002011469242895, 141.9016698730502, 0.07343555078476312], "isController": false}, {"data": ["HTTP Request_Caracter_by_id", 8943, 8897, 99.48563121994856, 17902.703902493562, 6, 106089, 2728.0, 74889.0, 102631.0, 105281.0, 84.17416512932495, 207.57963574707748, 0.05454352128120176], "isController": false}, {"data": ["HTTP Request_Create_caracter", 7121, 7077, 99.38210925431821, 7896.8121050414275, 13, 105315, 2488.0, 7864.400000000001, 63816.0, 104447.78, 67.55333782360809, 170.6965993283561, 0.08926940937076072], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,831,797; received: 105,300)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,831,464; received: 407,452)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,831,464; received: 341,916)", 2, 0.005222477543346564, 0.005197910440003119], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,831,464; received: 264,796)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,830,946; received: 1,031,492)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,831,020; received: 923,052)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,830,946; received: 760,660)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,830,761; received: 1,474,316)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,831,760; received: 112,540)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,831,020; received: 950,028)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["404/Not Found", 36, 0.09400459578023815, 0.09356238792005614], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,831,131; received: 498,516)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,831,464; received: 356,396)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,830,946; received: 1,226,652)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,831,723; received: 145,308)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,831,242; received: 491,276)", 2, 0.005222477543346564, 0.005197910440003119], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,831,464; received: 309,148)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 685, 1.788698558596198, 1.780284325701068], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,831,464; received: 327,436)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,830,946; received: 1,239,684)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,830,761; received: 1,789,500)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,831,686; received: 155,444)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,831,131; received: 571,292)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,831,020; received: 830,540)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,831,464; received: 425,740)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,830,761; received: 1,614,124)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,831,020; received: 854,620)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,830,761; received: 1,816,476)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,830,761; received: 1,310,476)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,831,464; received: 400,212)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,831,649; received: 374,684)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,830,946; received: 1,078,740)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,831,649; received: 243,612)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,831,464; received: 360,204)", 2, 0.005222477543346564, 0.005197910440003119], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,830,946; received: 1,193,884)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 34244, 89.41926049717986, 88.9986225537334], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,830,761; received: 1,383,252)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,831,464; received: 349,156)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,830,761; received: 1,736,460)", 1, 0.002611238771673282, 0.0025989552200015595], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 3292, 8.596198036348444, 8.555760584245133], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 38477, 38296, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 34244, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 3292, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 685, "404/Not Found", 36, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,831,464; received: 341,916)", 2], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["HTTP Request_All caracters", 10154, 10104, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 9262, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 682, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 121, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,831,464; received: 341,916)", 2, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 1,831,242; received: 491,276)", 2], "isController": false}, {"data": ["HTTP Request_Changecaracters", 6468, 6427, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 5838, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 441, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 148, "", "", "", ""], "isController": false}, {"data": ["HTTP Request_Delete caracter", 5791, 5791, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 5375, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 233, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 147, "404/Not Found", 36, "", ""], "isController": false}, {"data": ["HTTP Request_Caracter_by_id", 8943, 8897, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 7269, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 1553, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 75, "", "", "", ""], "isController": false}, {"data": ["HTTP Request_Create_caracter", 7121, 7077, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 6500, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 383, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 194, "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
