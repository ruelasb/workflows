

$(function() {
  var Mustache = require('mustache');

  $.getJSON('js/data.json', function(data) {
    var template = $('#speakerstpl').html();//get the data inside the script(get template layout)
    var html = Mustache.to_html(template, data);//merge the data in script with the json data as html(make template layout)
    $('#speakers').html(html);//place merged data inside the #speakers article as html (place html template layout)
  }); //getJSON
  
}); //function