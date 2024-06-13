const feriados = [
	{
		img: "img/anonovo.png",
		celebra: "Ano Novo",
		data: "1 de Janeiro"
	},
	{
		img: "img/hero.png",
		celebra: "Dia dos Heróis Moçambicanos",
		data: "3 de Fevereiro"
	},
	{
		img: "img/mulher.png",
		celebra: "Dia da Mulher Moçambicana",
		data: "7 de Abril"
	},
	{
		img: "img/trabalho.svg",
		celebra: "Dia Internacional dos Trabalhadores",
		data: "1 de Maio"
	},
	{
		img: "img/independencia.svg",
		celebra: "Dia da Independência",
		data: "25 de Junho"
	},
	{
		img: "img/familia.svg",
		celebra: "Dia da Vitória",
		data: "7 de Setembro"
	},
	{
		img: "img/armado.svg",
		celebra: "Dia das Forças Armadas",
		data: "25 de Setembro"
	},
	{
		img: "img/familia.svg",
		celebra: "Dia da Paz e Reconciliação",
		data: "4 de Outubro"
	},
	{
		img: "img/familia.svg",
		celebra: "Dia da Família",
		data: "25 de Dezembro"
	}
];

let score = 0;
let questionCount = 0;
const totalQuestions = 5; // Number of questions to be asked

function reset() {
	if (questionCount >= totalQuestions) {
		showFinalScore();
		return;
	}

	const ding = document.getElementById("ding");
	const wrong = document.getElementById("wrong");
	const img = document.getElementById("img");
	const pergunta = document.getElementById("pergunta");
	const opcoes = document.getElementById("opcoes");
	const scoreDisplay = document.getElementById("score");

	n = Math.floor(Math.random() * feriados.length);

	img.src = feriados[n].img;
	pergunta.innerHTML = `Em que data se celebra:<br/><b>${feriados[n].celebra}</b>?`;

	const correctAnswer = feriados[n].data;
	const allAnswers = feriados.map(f => f.data);
	allAnswers.sort(() => 0.5 - Math.random());

	const answersToShow = allAnswers.slice(0, 3);
	if (!answersToShow.includes(correctAnswer)) {
		answersToShow[Math.floor(Math.random() * 3)] = correctAnswer;
	}

	opcoes.innerHTML = '';
	answersToShow.forEach(answer => {
		const button = document.createElement("button");
		button.className = "item";
		button.innerText = answer;
		button.onclick = () => responder(answer, correctAnswer);
		opcoes.appendChild(button);
	});

	scoreDisplay.innerHTML = `Score: ${score}`;
}

function responder(selectedAnswer, correctAnswer) {
	const img = document.getElementById("img");
	const ding = document.getElementById("ding");
	const wrong = document.getElementById("wrong");

	if (selectedAnswer === correctAnswer) {
		img.src = "img/certo.svg";
		ding.play();
		score++;
	} else {
		img.src = "img/errado.svg";
		wrong.play();
	}

	questionCount++;
	setTimeout(reset, 1000);
}

function showFinalScore() {
	const pergunta = document.getElementById("pergunta");
	const opcoes = document.getElementById("opcoes");
	const scoreDisplay = document.getElementById("score");
	const restartButton = document.getElementById("restart");

	pergunta.innerHTML = `Jogo terminado! Sua pontuação final é ${score} de ${totalQuestions}.`;
	opcoes.innerHTML = '';
	scoreDisplay.innerHTML = '';
	restartButton.style.display = 'block';
}

function restartGame() {
	score = 0;
	questionCount = 0;
	document.getElementById("restart").style.display = 'none';
	reset();
}
