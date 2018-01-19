var myList = new Array();

function getList(){

    $('#excelDataTable tr').each(function(row, tr){
        myList[row]={
            "Type" : $(tr).find('td:eq(0)').text(),
            "Title" : $(tr).find('td:eq(1)').text(),
            "Distance" :$(tr).find('td:eq(2)').text(),
            "Time" :$(tr).find('td:eq(4)').text(),
            "Owner" :$(tr).find('td:eq(5)').text(),
            "Event Id" :$(tr).find('td:eq(3)').text()
        }
    });
    return myList;
}
function boxChecked() {
    var myCurrentList = [];
    var numberchecked = 0;
    $('input[type=checkbox]').each(function () {
        if (this.checked) {
            numberchecked += 1;
            var x = this.name;
            for (var listIndex = 0; listIndex < myList.length; listIndex++) {
                if (myList[listIndex]["Type"] == x) {
                    myCurrentList.push(myList[listIndex]);
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
            newArrangeList[listIndextmpsec]["Distance"] = newArrangeList[listIndextmpsec]["Distance"].toString() + 'km';
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
    for (var listIndex = 0; listIndex < myList.length; listIndex++) {
        if (myList[listIndex]["Time"] == x) {
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
    var x = $("#txt_name").val();
    if (x != "") {
        for (var listIndex = 0; listIndex < myList.length; listIndex++) {
            if (myList[listIndex]["Type"] == x) {
                myCurrentList.push(myList[listIndex]);
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
