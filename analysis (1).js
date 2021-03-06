console.log('The analysis has begun.');

var Twit = require('twit');
var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var json = require('./AFINN.json');
var ejs = require('ejs');

app.use(express.static('public'));
app.listen(3000,function() {console.log('listening'); });

app.use(bodyParser.urlencoded({
	extended : true
}));

app.use(bodyParser.json());

var q,j,k,i,s=0,tl;
var tweets = [];
var sentiment = [];
var alpha;
var reaction;
var current_mood;
var id;
var total_length = 0;

var T = new Twit({
  consumer_key:         'dHjeXsqkcJH1l3KdYl7LwMNe5',
  consumer_secret:      'dPq9xCXTmQn0UYt4UYFH4GDwAoueOV18VNhp6X8V29FU4rVAfy',
  access_token:         '903282520841641984-iZNjVzPrTAAeUkVLtMdRpHTUC7WKzgW',
  access_token_secret:  'zBneeyvIrPS41E1eiB0G7PeW5WoSaPJ0gK6G8GLVWdR2X',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})

app.post("/constraint", function (req, res){
	keyword = req.body.keyword;
	date = req.body.date;
	location = req.body.location;

	var search_tweets = {q: keyword,
						since: date, 
						count: 100,
						result_type: "recent"};

	var temp = [0,0,0,0,0,0,0,0,0,0,0];
	var positive_tweets = 0;
	var negative_tweets = 0;
	
	do
	{		
		console.log("s = " + s++);
		T.get('search/tweets',search_tweets,
		function(err, data, response) 
		{
			var yolo = JSON.stringify(data);
		 	fs.writeFile("C:\\Users\\muffi\\twitter\\yolo.json", yolo, function(err) 
		 	{
			   	if(err) 
			   	{
			  	  	 return console.log(err);
				}
			    	console.log("The file was saved!");
			});

			for(i=0;i < data.statuses.length;i++)
			{
				//console.log(data.statuses[i].id);
				tweets[i] = data.statuses[i].text.toLowerCase().replace(/[^a-zA-Z0-9]| the| be| to| of| and| a| in| that| have| i|the |be |to |of |and |a |in |that |have |i /gi, ' ').replace(/  +/g, ' ').split(' ');// + "\r\n" + "</br>";
			}

			fs.writeFile("C:\\Users\\muffi\\twitter\\tweets.txt", tweets, function(err) 
			{
			  	if(err) 
			  	{
				  	 return console.log(err);
				}
			   	
			   	console.log("The file was saved!");
			});
			//console.log("length = " + data.statuses.length + " and id = " + id);

			for(i=0;i<tweets.length;i++)
			{
				k=0;
				sentiment[i]=0;
				for(j=0;j<tweets[i].length;j++)
				{
					switch(tweets[i][j][[0]])
					{
						case 'a':
							alpha = json.a;
							break;
						case 'b':
							alpha = json.b;
							break;
						case 'c':
							alpha = json.c;
							break;
						case 'd':
							alpha = json.d;
							break;
						case 'e':
							alpha = json.e;
							break;
						case 'f':
							alpha = json.f;
							break;
						case 'g':
							alpha = json.g;
							break;
						case 'h':
							alpha = json.h;
							break;
						case 'i':
							alpha = json.i;
							break;
						case 'j':
							alpha = json.j;
							break;
						case 'k':
							alpha = json.k;
							break;
						case 'l':
							alpha = json.l;
							break;
						case 'm':
							alpha = json.m;
							break;
						case 'n':
							alpha = json.n;
							break;
						case 'o':
							alpha = json.o;
							break;
						case 'p':
							alpha = json.p;
							break;
						case 'q':
							alpha = json.q;
							break;
						case 'r':
							alpha = json.r;
							break;
						case 's':
							alpha = json.s;
							break;
						case 't':
							alpha = json.t;
							break;
						case 'u':
							alpha = json.u;
							break;
						case 'v':
							alpha = json.v;
							break;	
						case 'w':
							alpha = json.w;
							break;
						case 'x':
							alpha = json.z;
							break;
						case 'y':
							alpha = json.y;
							break;
						case 'z':
							alpha = json.z;
							break;
						default:
							alpha = json.z;
					}

					for(q in alpha)
					{
						if(q == tweets[i][j])
						{
							k++;
							sentiment[i] += parseInt(alpha[q]);
						}
					}
				}
				if(k != 0)
				{
					console.log("sentiment of " + i + "= " + sentiment[i]/k);
					sentiment[i] = sentiment[i]/k;
				}
			}

			for(i = 0;i < sentiment.length; i++)
			{
				a = Math.floor(sentiment[i])
				temp[a]++;
			}
			console.log(temp);

			for(i = 1,j = 6;i<6; i++,j++)
			{
				negative_tweets += temp[i];
				positive_tweets += temp[j];
			}
			if(positive_tweets > negative_tweets)
			{
				reaction = positive_tweets;
				current_mood = 6;
			}
			else if(positive_tweets < negative_tweets)
			{
				current_mood = 5;
				reaction = negative_tweets;
			}
			else if(positive_tweets == negative_tweets)
			{
				current_mood = 0;
				if(positive_tweets == 0)
					current_mood = 1;
			}
			total_length += sentiment.length;
			reaction = reaction / (total_length - temp[0]) * 100;

			console.log("reaction = " + reaction);
			console.log("positive = " + positive_tweets);
			console.log("negative = " + negative_tweets);

			positive_tweets = 0;
			negative_tweets = 0;
			tl = tweets.length;
		});
	}while((tl != 0) && (s < 10));

	setTimeout(function() 
	{
		res.writeHead(200, {'Content-Type': 'text/html'});
		fs.readFile('charty.html', 'utf-8', function(err, content) {
    		if (err) 
    		{
      			res.end('error occurred');
      			return;
      		}
			var renderedHtml = ejs.render(content, {temp: temp, reac: reaction, mood: current_mood});  //get redered HTML code
    		res.end(renderedHtml);
    	});
	}, 5000);
});


