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

var q,j,k,i,s=0,tl,d,z;
var tweets = [];
var sentiment = [];
var alpha;
var reaction;
var current_mood;
var id;
var total_length = 0;
var all_tweets;

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
	var nlarge = 1;
	var plarge = 6;
	var nflag;
	var pflag;
	var negative_example;
	var positive_example;
	
	function search_them_tweets(stt)
	{		
		console.log("s = " + stt++);
		nflag = 0;
		pflag = 0;
		T.get('search/tweets',search_tweets,
		function(err, data, response) 
		{
			console.log("my s = " + stt);
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
				all_tweets += data.statuses[i].text + "\n";
				console.log(data.statuses[i].id);
				tweets[i] = data.statuses[i].text.replace(/[^a-zA-Z0-9]| the| be| to| of| and| a| in| that| have| i|the |be |to |of |and |a |in |that |have |i | rt|rt /gi, ' ').replace(/  +/g, ' ').split(' ');// + "\r\n" + "</br>";
			}

			search_tweets = {q: keyword,
							since: date, 
							count: 100,
							max_id: data.statuses[i-1].id};

			// fs.writeFile("tweets.txt", tweets, function(err) 
			// {
			//   	if(err) 
			//   	{
			// 	  	 return console.log(err);
			// 	}
			   	
			//    	console.log("The file was saved!");
			// });
			//console.log("length = " + data.statuses.length + " and id = " + id);

			for(i=0;i<tweets.length;i++)
			{
				k=0;
				sentiment[i]=0;
				for(j=0;j<tweets[i].length;j++)
				{
					switch(tweets[i][j][[0]])
					{
						case 'A':
						case 'a':
							alpha = json.a;
							break;
						case 'B':
						case 'b':
							alpha = json.b;
							break
						case 'C':;
						case 'c':
							alpha = json.c;
							break;
						case 'D':
						case 'd':
							alpha = json.d;
							break;
						case 'E':
						case 'e':
							alpha = json.e;
							break;
						case 'F':
						case 'f':
							alpha = json.f;
							break;
						case 'G':
						case 'g':
							alpha = json.g;
							break;
						case 'H':
						case 'h':
							alpha = json.h;
							break;
						case 'I':
						case 'i':
							alpha = json.i;
							break;
						case 'J':
						case 'j':
							alpha = json.j;
							break;
						case 'K':
						case 'k':
							alpha = json.k;
							break;
						case 'L':
						case 'l':
							alpha = json.l;
							break;
						case 'M':
						case 'm':
							alpha = json.m;
							break;
						case 'N':
						case 'n':
							alpha = json.n;
							break;
						case 'O':
						case 'o':
							alpha = json.o;
							break;
						case 'P':
						case 'p':
							alpha = json.p;
							break;
						case 'Q':
						case 'q':
							alpha = json.q;
							break;
						case 'R':
						case 'r':
							alpha = json.r;
							break;
						case 'S':
						case 's':
							alpha = json.s;
							break;
						case 'T':
						case 't':
							alpha = json.t;
							break;
						case 'U':
						case 'u':
							alpha = json.u;
							break;
						case 'V':
						case 'v':
							alpha = json.v;
							break;
						case 'W':	
						case 'w':
							alpha = json.w;
							break;
						case 'X':
						case 'x':
							alpha = json.z;
							break;
						case 'Y':
						case 'y':
							alpha = json.y;
							break;
						case 'Z':
						case 'z':
							alpha = json.z;
							break;
						default:
							alpha = json.z;
					}

					var capflag=0;

					for(z=0;z<tweets[i][j].length;z++)
					{
						if(tweets[i][j][z] == tweets[i][j][z].toLowerCase())
						{
							capflag=1;
							break;
						}
					}

					for(z=0;z<tweets[i].length;z++)
					{
						tweets[i][z] = tweets[i][z].toLowerCase();
					}

					for(q in alpha)
					{
						if(q == tweets[i][j])
						{
							z = 0;
							z = parseInt(alpha[q]);
							if(capflag == 0)
							{
								if(z <= 5)
								{
									z -= 1;
									if(z < 1)
									{
										z = 1;
									}	
								}
								else
								{
									z += 1;
									if(z > 10)
									{
										z = 10;
									}
								}
								console.log("CAPS MATE : " + data.statuses[i].text + "capflag = " + capflag);
							}
							k++;
							sentiment[i] += z;
						}
					}
				}
				if(k != 0)
				{
					//console.log("sentiment of " + i + "= " + sentiment[i]/k);
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
				if(temp[nlarge] <= temp[i])
				{
					nlarge = i;
					nflag++;
				}
				if(temp[plarge] <= temp[j])
				{
					plarge = j;
					pflag++;
				}
			}

			if(pflag > 0)
			{
				for(i=0;i<tweets.length;i++)
				{
					if(sentiment[i] == plarge)
					{
						positive_example = data.statuses[i].text + "---->with sentiment value of " + sentiment[i];
						break;
					}
				}
			}
			if(nflag > 0)
			{
				for(i=0;i<tweets.length;i++)
				{
					if(sentiment[i] == nlarge)
					{
						negative_example = data.statuses[i].text + "---->with sentiment value of " + sentiment[i];
						break;
					}
				}
			}

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
			console.log("my s = " + stt);
			if(stt < 5)
				search_them_tweets(stt);
			else
			{
				console.log("positive_example = " + positive_example);
				console.log("negative_example = " + negative_example);
				fs.writeFile("tweets.txt", all_tweets, function(err) 
				{
				  	if(err) 
				  	{
					  	 return console.log(err);
					}
				   	
				   	console.log("The file was saved!");
				});
				reaction = reaction.toFixed(2);
				res.writeHead(200, {'Content-Type': 'text/html'});
				fs.readFile('charty.html', 'utf-8', function(err, content) {
    				if (err) 
    				{
      					res.end('error occurred');
      					return;
      				}
					var renderedHtml = ejs.render(content, {temp: temp, reac: reaction, mood: current_mood, positive_example: positive_example, negative_example: negative_example});  //get rendered HTML code
    				res.end(renderedHtml);
    			});
    		}
		});
	}
	search_them_tweets(0);

	// setTimeout(function() 
	// {
	// 	res.writeHead(200, {'Content-Type': 'text/html'});
	// 	fs.readFile('charty.html', 'utf-8', function(err, content) {
 //    		if (err) 
 //    		{
 //      			res.end('error occurred');
 //      			return;
 //      		}
	// 		var renderedHtml = ejs.render(content, {temp: temp, reac: reaction, mood: current_mood});  //get rendered HTML code
 //    		res.end(renderedHtml);
 //    	});
	// }, 5000);
});


