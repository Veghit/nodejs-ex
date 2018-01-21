var myList = new Array();

function getList(){

    $('#excelDataTable tr').each(function(row, tr){
        myList[row]={
            "Type" : $(tr).find('td:eq(0)').text(),
            "Title" : $(tr).find('td:eq(1)').text(),
            "Distance" : $(tr).find('td:eq(2)').text(),
            "Time" :$(tr).find('td:eq(4)').text(),
            "Owner" :$(tr).find('td:eq(5)').text(),
            "Event Id" :$(tr).find('td:eq(3)').text()
        }
    });
    for (var listIndex = 2; listIndex < myList.length; listIndex++) {
        if (myList[listIndex]["Distance"] !== "") {
            var tmpDistance = readyForDistance(myList[listIndex]["Distance"]);
            myList[listIndex]["Distance"] = tmpDistance;
        }
    }
    return myList;
}
function boxChecked() {
    var myCurrentList = [];
    var numberchecked = 0;
    var alreadyIn = [];
    $('input[type=checkbox]').each(function () {
        if (this.checked) {
            numberchecked += 1;
            var x = this.name;
            for (var listIndex = 0; listIndex < myList.length; listIndex++) {
                var event_types=myList[listIndex]["Type"].split(',');
                for (var typesIndex = 0; typesIndex < event_types.length; typesIndex++) {
                    if (event_types[typesIndex] == x && alreadyIn.indexOf(listIndex) == -1) {
                        myCurrentList.push(myList[listIndex]);
                        alreadyIn.push(listIndex);
                        break;
                    }
                }
            }
        }
    });
    if (numberchecked == 0){
        for (var listIndex = 2; listIndex < myList.length; listIndex++) {
            myCurrentList.push(myList[listIndex]);
        }
    }
    $("#excelDataTable tr").remove();
    buildEventsTable('#excelDataTable', myCurrentList);
}

function displayarrange() {
    var newList = [];
    for (var listIndex = 2; listIndex < myList.length; listIndex++) {
        if (myList[listIndex]["Distance"].indexOf("km") !== -1) {
            newList.push(Object.assign({}, myList[listIndex]));
        }
    }
    var distancecurr = 0;
    for (var listIndextmp = 0; listIndextmp < newList.length; listIndextmp++) {
        distancecurr = Number(newList[listIndextmp]["Distance"].replace("km",""));
        newList[listIndextmp]["Distance"] = distancecurr;
    }
    var newArrangeList = newList.sort(function(a,b) {return (a["Distance"] > b["Distance"]) ? 1 : ((b["Distance"] > a["Distance"]) ? -1 : 0);} );
    for (var listIndexSec = 2; listIndexSec < myList.length; listIndexSec++) {
        if (myList[listIndexSec]["Distance"].indexOf("km") == -1) {
            newArrangeList.push(myList[listIndexSec]);
        }
    }
    for (var listIndextmpsec = 0; listIndextmpsec < newArrangeList.length; listIndextmpsec++) {
        if (typeof(newArrangeList[listIndextmpsec]["Distance"]) === 'number') {
            newArrangeList[listIndextmpsec]["Distance"] = newArrangeList[listIndextmpsec]["Distance"] + 'km';
        }
    }
    $("#excelDataTable tr").remove();
    buildEventsTable('#excelDataTable', newArrangeList);
}

function displaytime() {
    var date = document.getElementById("date").value;
    var time = document.getElementById("time").value;
    var myCurrentList = [];
    var x = (date + "T" + time);
    var splittedTime = [];
    for (var listIndex = 2; listIndex < myList.length; listIndex++) {
        splittedTime = myList[listIndex]["Time"].split("T");
        if (time == "") {
            if (splittedTime[0] == date){
                myCurrentList.push(myList[listIndex]);
            }
        } else if (date == "") {
            if (splittedTime[1] == time) {
                myCurrentList.push(myList[listIndex]);
            }
        } else if (myList[listIndex]["Time"] == x) {
            myCurrentList.push(myList[listIndex]);
        }
    }
    if (x == "T"){
        for (var listIndex = 2; listIndex < myList.length; listIndex++) {
            myCurrentList.push(myList[listIndex]);
        }
    }
    $("#excelDataTable tr").remove();
    buildEventsTable('#excelDataTable', myCurrentList);
}

function displaysearch() {
    var myCurrentList = [];
    var alreadyIn = [];
    var x = $("#txt_name").val();
    if (x != "") {
        for (var listIndex = 0; listIndex < myList.length; listIndex++) {
            var event_types=myList[listIndex]["Type"].split(',');
            for (var typesIndex = 0; typesIndex < event_types.length; typesIndex++) {
                if (event_types[typesIndex] == x && alreadyIn.indexOf(listIndex) == -1) {
                    myCurrentList.push(myList[listIndex]);
                    alreadyIn.push(listIndex);
                    break;
                }
            }
        }
    }
    else if (x == "") {
        for (var listIndex = 2; listIndex < myList.length; listIndex++) {
            myCurrentList.push(myList[listIndex]);
        }
    }
    $("#excelDataTable tr").remove();
    buildEventsTable('#excelDataTable', myCurrentList);
}

function buildEventsTableMain(selector, myList) {
    buildEventsTable(selector, myList);
}

// Builds the HTML Table out of myList.
function buildEventsTable(selector, myList) {
    var columns = addAllColumnHeaders(myList, selector);
    for (var i = 0; i < myList.length; i++) {

        var row$ = $('<tr>');

        for (var colIndex = 0; colIndex < columns.length; colIndex++) {
            var cellValue = myList[i][columns[colIndex]];
            if (cellValue == null) cellValue = "";
            var myHref = window.location.href;
            var arrayHref = myHref.split("/");
            var user_id = arrayHref[5];
            var link = "/eventMe/event/" + myList[i]["Event Id"]+ "/" + user_id;
            var hrefdelete = "/eventMe/delete_event/" + myList[i]["Event Id"]+ "/" +user_id;
            if (columns[colIndex] == "Title") {
                row$.append($('<td>'+'<a href='+link+'>'+cellValue+'</a>'+'</td>'+'</tr>'));
            } else if (columns[colIndex] == "Owner" && arrayHref[4] == "myownevents") {
                row$.append($('<td>'+cellValue+'</td>'+'</tr>'));
                row$.append($('<td>'+'<a href='+hrefdelete+'> <button>delete</button>'+'</a>'+'</td>'+'</tr>'));
            } else {
                row$.append($('<td>'+cellValue+'</td>'+'</tr>'));
            }

        }
        $(selector).append(row$);
    }
}

// Adds a header row to the table and returns the set of columns.
// Need to do union of keys from all records as some records may not contain
// all records.
function addAllColumnHeaders(myList, selector) {
    // $(selector).append($('<caption>'+"Events"+'</caption>'));
    var columnSet = [];
    var headerTr$ = $('<tr/>');
    var ifEmpty = ["Type", "Title", "Distance", "Time", "Owner"];
    if (myList.length == 0) {
        for (var i = 0; i < ifEmpty.length; i++) {
            if (ifEmpty[i] !== "Distance"){
                columnSet.push(ifEmpty[i]);
                headerTr$.append($('<th/>').html(ifEmpty[i]));
            }
            else if (ifEmpty[i] == "Distance"){
                headerTr$.append($('<th>' + '<button onclick="displayarrange()"  class="mybutton" ><span>Distance</span></button>' + '</th>' ));
            }
        }
    }

    for (var i = 0; i < myList.length; i++) {
        var rowHash = myList[i];
        for (var key in rowHash) {
            if ($.inArray(key, columnSet) == -1 && key !== "Event Id" && key !== "Distance"){
                columnSet.push(key);
                headerTr$.append($('<th/>').html(key));
            }
            else if ($.inArray(key, columnSet) == -1 && key == "Distance"){
                columnSet.push(key);
                headerTr$.append($('<th>' + '<button onclick="displayarrange()"  class="mybutton" ><span>Distance</span></button>' + '</th>' ));
            }
        }
    }
    $(selector).append(headerTr$);

    return columnSet;
}

function readyForDistance(x){
    var event_loc=x;
    event_loc=event_loc.split(')');
    return CalcDistance(event_loc[0]);
}

function CalcDistance(x)
{
    //-----------Calculate distance between event and user locations---------------
    var R = 6371e3; // metres
    var coords = document.getElementById('user_location').innerHTML;
    /*
       var latlng=coords.split(',');
       var lat1=parseFloat(latlng[0].substr(1,latlng[0].length-1));
       var lon1=parseFloat(latlng[1].substr(1,latlng[1].length));
    */
    var lat1 = JSON.parse(coords).lat;
    //console.log(lat1);
    var lon1 = JSON.parse(coords).lng;
    //console.log(lon1);
    coords = x; //x should be event location taken from table
    var latlng = coords.split(',');
    //console.log (latlng);
    var lat2 = parseFloat(latlng[0].substr(1, latlng[0].length - 1));
    //console.log(lat2);
    var lon2 = parseFloat(latlng[1].substr(1, latlng[1].length));
    //console.log(lon2);
    var φ1 = radians(lat1);
    var φ2 = radians(lat2);
    var Δφ = radians(lat2 - lat1);
    var Δλ = radians(lon2 - lon1);

    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c;
    d = Math.round(d * 100) / 100;

    return (parseInt(d/100))/10 +'km';
}

function radians(x) {
    var pi = Math.PI;
    return x * (pi / 180);
}