var fb = document.getElementById('find');
var fe = document.getElementById('fetch');
var tb = document.getElementById('input');
var disp = document.getElementById('display');

fe.addEventListener('click', fetchData);
fb.addEventListener('click', findData);

var ob;

async function fetchData(){
    let url = 'http://localhost:3000/fetchData';
    let response = await fetch(url);
    console.log(response.json());
}

async function findData(){
    let film = tb.value.toLowerCase();
    let url = 'http://localhost:3000/findData';
    let obj = {
        search : film
    };

    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(obj),
    });

    ob = await response.json();

    console.log(ob);

    disp.innerHTML = '';

    if(ob == {}){
        var textNode = document.createTextNode('Not Found !');
        disp.append(textNode);
    }
    else{
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
    }
}
