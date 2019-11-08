var ans;
console.log("undefined", document);
var lb = document.getElementById('load');
var fb = document.getElementById('find');

lb.addEventListener('click', load);
fb.addEventListener('click', find);

function load(){
    var select = document.getElementById("select");
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    if (true){//regex.test(select.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {

            var reader = new FileReader();
            reader.onload = function(e) {
                var data = e.target.result;
                var allTextLines = data.split(/\r\n|\n/);
                var headers = allTextLines[0].split(',');
                var lines = [];

                for (var i=1; i<allTextLines.length; i++) {
                    var res = allTextLines[i].split(',');
                    if (res.length == headers.length) {
                        var tarr = {};
                        for (var j=0; j<headers.length; j++) tarr[headers[j]] = res[j];
                        lines.push(tarr);
                    }
                }
                ans = lines;
                var disp = document.getElementById('display');
                disp.innerHTML = '';
                var textNode = document.createTextNode('Data loaded Successfully !');
                disp.append(textNode);
                //alert('Data loaded Successfully !');
            };
            reader.readAsText(select.files[0]);
        }
        else{
            var disp = document.getElementById('display');
            disp.innerHTML = '';
            var textNode = document.createTextNode('The Browser does not support HTML5 !');
            disp.append(textNode);
        }
    }
    else{
        var disp = document.getElementById('display');
        disp.innerHTML = '';
        var textNode = document.createTextNode('Please upload a valid CSV file !');
        disp.append(textNode);
    }
}

function find(){
    var tb = document.getElementById('input');
    var disp = document.getElementById('display');
    var arg = tb.value.toLowerCase();
    var i;
    for (i=0; i<ans.length; i++) {
        var ob = ans[i];
        if(ob.name.toLowerCase() == arg){
            disp.innerHTML = '';
            var name = 'Name : ' + ob.name.replace(/_/g, ' ');
            var people = 'People involved : ' + ob.people.replace(/_/g, ' ');
            var year = 'Year released : ' + ob.year.replace(/_/g, ' ');
            var rating = 'IMDB rating : ' + ob.rating.replace(/_/g, ' ');

            var textNode = document.createTextNode(name);
            disp.append(textNode,document.createElement("br"));

            textNode = document.createTextNode(people);
            disp.append(textNode,document.createElement("br"));

            textNode = document.createTextNode(year);
            disp.append(textNode,document.createElement("br"));

            textNode = document.createTextNode(rating);
            disp.append(textNode);
            break;
        }
    }
    if(i == ans.length){
        var disp = document.getElementById('display');
        disp.innerHTML = '';
        var textNode = document.createTextNode('Not Found !');
        disp.append(textNode);
    }
}
