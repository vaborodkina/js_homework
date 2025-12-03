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

    var data = {"OkPercent": 34.863, "KoPercent": 65.137};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.316035, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.72205, 500, 1500, "HTTP Request_All caracters"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_Changecaracters"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_Delete caracter"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request_Caracter_by_id"], "isController": false}, {"data": [0.858125, 500, 1500, "HTTP Request_Create_caracter"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 100000, 65137, 65.137, 7717.933670000006, 1, 238263, 68.0, 341.90000000000146, 24215.20000000001, 150497.98, 324.46673891459386, 70880.44917489629, 54.062058674537155], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HTTP Request_All caracters", 20000, 3729, 18.645, 20080.79649999998, 1, 238263, 125.0, 133742.9, 134995.95, 175696.87000002692, 64.89566399621009, 70782.6848532709, 6.496366501912799], "isController": false}, {"data": ["HTTP Request_Changecaracters", 20000, 20000, 100.0, 4319.578199999992, 1, 150638, 58.0, 128.0, 17174.85000000003, 134112.0, 65.27180812699284, 21.70131133612207, 14.218641128663789], "isController": false}, {"data": ["HTTP Request_Delete caracter", 20000, 20000, 100.0, 2345.5295999999967, 1, 150501, 55.0, 121.0, 9504.200000000012, 96524.48000000008, 65.29354344795615, 19.67404136835679, 13.36222483362389], "isController": false}, {"data": ["HTTP Request_Caracter_by_id", 20000, 20000, 100.0, 8670.831249999983, 1, 151980, 63.0, 24677.50000000008, 75895.95, 134094.0, 65.15995139067627, 31.51011483525121, 7.27766979156146], "isController": false}, {"data": ["HTTP Request_Create_caracter", 20000, 1408, 7.04, 3172.9328000000014, 1, 151073, 62.0, 303.0, 17168.100000000013, 129893.71000000005, 65.22178668562447, 27.92112522970298, 12.966804556394017], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 4767, 7.318421173833612, 4.767], "isController": false}, {"data": ["404/Not Found", 57085, 87.63836222116463, 57.085], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 3285, 5.043216605001765, 3.285], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 100000, 65137, "404/Not Found", 57085, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 4767, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 3285, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["HTTP Request_All caracters", 20000, 3729, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 2472, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1257, "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request_Changecaracters", 20000, 20000, "404/Not Found", 19397, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 468, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 135, "", "", "", ""], "isController": false}, {"data": ["HTTP Request_Delete caracter", 20000, 20000, "404/Not Found", 19677, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 229, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 94, "", "", "", ""], "isController": false}, {"data": ["HTTP Request_Caracter_by_id", 20000, 20000, "404/Not Found", 18011, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1532, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 457, "", "", "", ""], "isController": false}, {"data": ["HTTP Request_Create_caracter", 20000, 1408, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:3001 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1281, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 127, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
