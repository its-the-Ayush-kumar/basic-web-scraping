const express = require('express')
const request = require('request');
const otcsv = require('objects-to-csv');
const fs = require('fs');
const cheerio = require('cheerio');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express()
var port = 3000

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).json({
      msg : 'Server started!'
    });
});

app.get('/fetchData', (req, res) => {
    var details = [];

    function convertAtoC(args){
      var result, ctr, keys, columnDelimeter, lineDelimeter, data;
      data = args.data || null;
      if(data == null || !data.length){
        console.log('Null data');
        return null;
      }
      columnDelimeter = args.columnDelimeter || ',';
      lineDelimeter = args.lineDelimeter || '\n';

      keys = Object.keys(data[0]);

      result = '';
      result += keys.join(columnDelimeter);
      result += lineDelimeter;

      data.forEach(function (item) {
        ctr = 0;
        keys.forEach(function (key) {
          if (ctr > 0) result += columnDelimeter;
          result += item[key];
          ctr++;
        });
        result += lineDelimeter;
      });
      return result;
    }

    request('https://www.imdb.com/india/top-rated-indian-movies/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=7e351343-5e22-40d2-afef-3586aa91f858&pf_rd_r=YND9SW1B7QZRPHA00797&pf_rd_s=center-16&pf_rd_t=15061&pf_rd_i=homepage&ref_=hm_india_tr_in_hd', (error, response, html) =>{
      if(!error && response.statusCode == 200){
        console.log('Scraping started!');

        const $ = cheerio.load(html);
        const movies = $('.lister-list tr');
        movies.each((i, el) => {
          details[i] = {};
          var title = $(el).find('.titleColumn');
          var rating = $(el).find('.ratingColumn.imdbRating');

          details[i]['name'] = $(title).find('a').text().replace(/,/g, '').replace(/ /g, '_');
          details[i]['people'] = $(title).find('a').attr('title').replace(/,/g, '').replace(/ /g, '_');
          details[i]['year'] = $(title).find('.secondaryInfo').text().replace('(','').replace(')','');
          details[i]['rating'] = $(rating).find('.ratingColumn.imdbRating strong').text();
        });

        console.log('Scraping finished!');
        console.log('Conversion started!');
        //console.log(details);
        var csv = convertAtoC({
          data: details
        });

        console.log('Conversion finished!');

       if(!(csv == null)){
        const options ={
          encoding: 'utf8'
        }
        const WritableStream = fs.createWriteStream('output.csv', options, (err) => {
          console.log("Failed to create writable stream - ", err);
        })
        //console.log(WritableStream);
        WritableStream.write(csv);
        WritableStream.end("");
        }
        else console.log('failed to fetch!');
      }
      else{
        console.log('Failed to connect!', error);
      }
    })

    res.status(200).json({
      msg : "Data fetched!"
    });
})

app.post('/findData', function(req, res) {
    var search = req.body.search.toLowerCase();

    const readableStream = fs.createReadStream('output.csv', {encoding: 'utf8'}, (err) => {
      console.log("Failed to create readable stream - ", err);
    })

    readableStream.on('error', err => {
      console.log("Error in reading the file!");
      res.staus(300).json({});
    })

    readableStream.on('data', chunk => {
      chunk = chunk.split('\n');
      chunk.forEach(data => {
        data = data.split(',')
        if(data[0].toLowerCase() == search){
          console.log("Film found!");
          var json = {};
          json['name'] = data[0];
          json['people'] = data[1];
          json['year'] = data[2];
          json['rating'] = data[3];

          res.status(200).json(json);
        }
      })
    })
})

app.listen(port, () => console.log(`Listening to port ${port}!`))
