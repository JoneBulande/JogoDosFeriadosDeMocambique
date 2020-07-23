const feriados = [
	{ 
		img: "img/anonovo.png",
		celebra: "Ano Novo",
		datas: ["1 de Janeiro ",
				"1 de Janeiro",
				"1 de janeiro  ",
				"1 de janeiro "]
	},
	{
		img: "img/hero.png",
		celebra: "Dia dos Heróis Moçambicanos",
		datas: ["3 de Fevereiro ",
	  		  "3 de Fevereiro",
	  		  "3 de fevereiro ",
	  		  "3 de fevereiro"] 
	},	
	{ 	
		img: "img/mulher.png",
		celebra: "Dia da Mulher Moçambicana",
		datas: ["7 de Abril ",
				"7 de Abril",
				"7 de aAbril ",
				"7 de abril"] 
	},	
	{
		img: "img/trabalho.svg",
		celebra: "Dia Internacional dos Trabalhadores",
		datas: ["1 de Maio ",
				"1 de Maio",
				"1 de maio ",
				"1 de maio "]
	},	
	{
		img: "img/independencia.svg",
		celebra: "Dia da Independência",
		datas: ["25 de Junho ",
				"25 de Junho",
				"25 de junho ",
				"25 de junho"]
	},
	{
		img: "img/familia.svg",
		celebra: "Dia da Vitória",
		datas: ["7 de Setembro ",
				"7 de Setembro",
				"7 de setembro ",
				"7 de setembro"]
	},
	{
		img: "img/armado.svg",
		celebra: "Dia das Forças Armadas",
		datas: ["25 de Setembro ",
				"25 de Setembro",
				"25 de setembro ",
				"25 de setembro"]
	},
	{
		img: "img/familia.svg",
		celebra: "Dia da Paz e Reconciliação",
		datas: ["5 de outubro ",
				"5 de outubro",
				"5 de outubro ",
				"5 de outubro"]
	},
	{
		img: "img/familia.svg",
		celebra: "Dia da Família",
		datas: ["25 de Dezembro ",
				"25 de Dezembro",
				"25 de dezembro ",
				"25 de dezembro"]
	}
];
function reset(){
	const h1 = document.getElementById("h1");
	const img = document.getElementById("img");
	n = Math.floor(Math.random() * feriados.length),
	resposta = document.getElementById("resposta");
	const pergunta = document.getElementById("pergunta");
	img.src = feriados[n].img;
	pergunta.innerHTML = `Em que data se celebra:<br/> <b>${feriados[n].celebra}<b/>?`;
}
function responder() {
	if (resposta.value !== "" && resposta.value !== 0 && resposta.value != " ") {
		if (feriados[n].datas.includes(resposta.value) == true) {
			img.src = "img/certo.svg";
			document.getElementById("resposta").value = "";
		}else{
			img.src = "img/errado.svg";
			document.getElementById("resposta").value = "";			
		}
		setTimeout(reset, 1000);
	}else{
		alert("[ERRO] - preencha o input corretamente e volte a tentar!");
		setTimeout(reset, 100);
	}
}