const request = require('request');
const otcsv = require('objects-to-csv');
var fs = require('fs');
const cheerio = require('cheerio');

var details = [];

function convertAtoC(args){
  var result, ctr, keys, columnDelimeter, lineDelimeter, data;
  data = args.data || null;
  if(data == null || !data.length){
    console.log('yo');
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
      fs.writeFile('output.csv', csv, function(err){
        console.log('There was some error!');
      })
      console.log("Data written successfully");
    }
    else console.log('failed to fetch');
  }
  else{
    console.log('Failed to connect!', error);
  }
})
