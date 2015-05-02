var http = require('http');
var querystring = require('querystring');
var fs = require('fs');
Docxtemplater = require('docxtemplater');

function processPost(request, response, callback) {
    var queryData = "";
    if(typeof callback !== 'function') return null;

    if(request.method == 'POST') {
        request.on('data', function(data) {
            queryData += data;
            if(queryData.length > 1e6) {
                queryData = "";
                response.writeHead(413, {'Content-Type': 'text/plain'}).end();
                request.connection.destroy();
            }
        });

        request.on('end', function() {
            request.post = querystring.parse(queryData);
            callback();
        });

    } else {
        response.writeHead(405, {'Content-Type': 'text/plain'});
        response.end();
    }
}

function parse_zan(name,request){
	var d1_zan = [];
	var d1_c = [];
	var d1_th = [];
	var d1_ex = [];
	var d1_t = [];
			
	d1_c = request.post[name.concat('_context')];
	d1_th = request.post[name.concat('_theme')];
	d1_ex = request.post[name.concat('_ex')];
	d1_t = request.post[name.concat('_topic')];

	if (!Array.isArray(d1_c)){
		d1_c = [d1_c];
	}
	var th_name = "ТЕМА ";
	try{
	for (var i=0; i<d1_c.length;i++){
		d1_zan.push({
		"topic": d1_c[i], //тема context
		"name":th_name.concat(d1_th[i],'         ЗАНЯТИЕ ',d1_ex[i]),
		"context":d1_t[i],
		"location":"Учебный класс."
		});
	}
	} catch(e) {}
		
	return d1_zan;
	}

function doc_create(dt){
    content = fs
    .readFileSync(__dirname+"/raspis_temp.docx","binary");

    doc=new Docxtemplater(content);

    //set the templateVariables
    doc.setData(dt);
    //
    //                    //apply them (replace all occurences of {first_name} by Hipp, ...)
    doc.render();

    var buf = doc.getZip()
        .generate({type:"nodebuffer"});
    //
    return buf;
    //fs.writeFileSync(__dirname+"/rasp.docx",buf);
}

http.createServer(function(request, response) {
    if(request.method == 'POST') {
        processPost(request, response, function() {
            console.log(request.post);
            var new_param = {};
            var start = new Date(request.post['start']);
            var finish = new Date(request.post['finish']);
			var nr = "d";
            var n1 = new Date(start);
			Date.prototype.getMonthName = function() {
				var month = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
				return month[this.getMonth()];
			};
            var date_mass_d = [];
			var date_mass_m = [];
            for (var i=0; i<=6; i++){
				date_mass_d.push(n1.getDate());
				date_mass_m.push(n1.getMonthName());
				n1.setDate(n1.getDate()+1);
            }
            var sign_d = new Date(start);
			sign_d.setDate(sign_d.getDate()-3);
            				
			new_param = {"sign_d": sign_d.getDate(),
						 "sign_m": sign_d.getMonthName(),
						 "mnt": sign_d.getMonthName(),
						 "sign_mo": sign_d.getMonth(),
						 "st_d": date_mass_d[0],
						 "st_m": date_mass_m[0],
						 "fn_d": date_mass_d[6],
						 "fn_m": date_mass_m[6],
						 "d1_n": date_mass_d[0],
						 "d2_n": date_mass_d[1],
						 "d3_n": date_mass_d[2],
						 "d4_n": date_mass_d[3],
						 "d5_n": date_mass_d[4],
						 "d6_n": date_mass_d[5],
						 "d7_n": date_mass_d[6],
						 "d1_otv": request.post['d1_otv'],
						 "d2_otv": request.post['d2_otv'],
						 "d3_otv": request.post['d3_otv'],
						 "d4_otv": request.post['d4_otv'],
						 "d5_otv": request.post['d5_otv'],
						 "d6_otv": request.post['d6_otv'],
						 "d2_conv": request.post['d2_conv'],
						 "d4_conv": request.post['d4_conv'],
						 "d5_conv": request.post['d5_conv'],
						 "d1_r": parse_zan('d1',request),
						 "d2_r": parse_zan('d2',request),
						 "d3_r": parse_zan('d3',request),
						 "d4_r": parse_zan('d4',request),
						 "d5_r": parse_zan('d5',request),
						 "d6_r": parse_zan('d6',request)
						};
			console.log(new_param);

            // Use request.post here
            response.writeHead(200, "OK", {'Content-Type': 'application/msword'});
            response.write(doc_create(new_param));
            response.end();
        });
    } else {
        fs.readFile('index.html',function (err, data){
        response.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        response.write(data);
        response.end();
    });
    }

}).listen(8000);

