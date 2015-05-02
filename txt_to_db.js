var fs = require('fs');
var pars ='';

fs.readFile(__dirname+"/cont.txt","utf-8", function (err,pars) {
  if (err) {
    return console.log(err);
  }

var all = [];
var all_name = 'Военная экология';
var th_name ='';
var th_number;
var th = false;
var ex_name ='';
var ex_number;
var ex =false;

function ex_pr(){
	all.push({"category":all_name,"tp":th_number,"ex":ex_number,"tp_name":th_name,"content":ex_name});
}

for (var i=0;i<pars.length;i++){
	if (pars[i]	== 'Т' && pars[i+1] == 'е' && pars[i+2] == 'м' && pars[i+3] == 'а' && pars[i+4] == ' '){
		//console.log(pars[i+5]);
		ex_pr(ex_name,ex_number,th_name,th_number);
		th_number =pars[i+5];
		if (pars[i+6] != ' ') {
			th_number = th_number + pars[i+6];
		}
		i=i+8;
		ex = false;
		th = true;
		th_name ='';
	}
	if (pars[i]	== 'З' && pars[i+1] == 'а' && pars[i+2] == 'н' && pars[i+3] == 'я' && pars[i+4] == 'т' && pars[i+5] == 'и' && pars[i+6] == 'е' && pars[i+7] == ' '){
		if (ex) {
			ex_pr(ex_name,ex_number,th_name,th_number);
		}
		//console.log(pars[i+8]);
		ex_number = pars[i+8];
		if (pars[i+9] != '.'){
			ex_number = ex_number + pars[i+9];
		}
		i=i+11;
		th = false;
		ex = true;
		ex_name = '';
	}
		if (th){
		th_name = th_name + pars[i];
	}
	if (ex){
		ex_name = ex_name + pars[i];
	}
}
ex_pr(ex_name,ex_number,th_name,th_number);

console.log(all); 	
	
});


// var pars = " Тема 10. Основы управления и связи в СВФ \
//Занятие 10. Теоретическое − 1 час. Значение управления и связи при подготовке и ведении ПСР. Средства управления и связи: табельные, стационарные, мобильные, радиостанции, телефонные аппараты. \
//Понятие о линии и канале связи. Способы организации радиосвязи, преимущества и недостатки. Классификация радиоволн. Дисциплина связи и ее требования. Понятие о безопасности связи. Правила установления радиосвязи и ведения обмена в радиотелефонном режиме. Ознакомление со средствами связи, используемыми в СВФ.\
//Тема 2. Устройство и эксплуатация техники связи \
//Занятие 1. Практическое − 2 часа. Общее устройство телефонного аппарата. Проверка работоспособности аппарата, включение аппарата в линию. Тактико-технические данные, общее устройство, состав комплекта коммутатора П-193 М. Развертывание, подготовка к работе, проверка работоспособности и обслуживание коммутатора. Тактико-технические данные и общее устройство радиостанции УКВ диапазона, условия применения. Подготовка к работе радиостанции. Тактико-технические данные и общее устройство радиостанции KB диапазона, условия применения. Подготовка к работе радиостанции в различных режимах работы";
 
