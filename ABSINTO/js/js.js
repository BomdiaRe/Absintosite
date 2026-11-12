/* =========================================
   1. MENU PARA CELULARES
========================================= */

const menuToggle = document.querySelector(".menu-toggle");
const navegacao = document.querySelector(".navegacao");
const linksMenu = document.querySelectorAll(".link-nav");

menuToggle.addEventListener("click", () => {
    const aberto = navegacao.classList.toggle("aberto");

    menuToggle.setAttribute("aria-expanded", aberto);
    menuToggle.setAttribute(
        "aria-label",
        aberto ? "Fechar menu" : "Abrir menu"
    );

    menuToggle.textContent = aberto ? "✕" : "☰";
});

linksMenu.forEach((link) => {
    link.addEventListener("click", () => {
        navegacao.classList.remove("aberto");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
        menuToggle.textContent = "☰";
    });
});


/* =========================================
   2. ANIMAÇÃO DAS SEÇÕES
========================================= */

const elementosRevelar = document.querySelectorAll(".revelar");

if ("IntersectionObserver" in window) {

    const observador = new IntersectionObserver((entradas, observer) => {

        entradas.forEach((entrada) => {

            if (entrada.isIntersecting) {
                entrada.target.classList.add("visivel");
                observer.unobserve(entrada.target);
            }

        });

    }, {
        threshold: 0.15
    });

    elementosRevelar.forEach((elemento) => {
        observador.observe(elemento);
    });

} else {

    elementosRevelar.forEach((elemento) => {
        elemento.classList.add("visivel");
    });

}


/* =========================================
   3. DESTAQUE DA NAVEGAÇÃO
========================================= */

const secoes = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {

    const observadorMenu = new IntersectionObserver((entradas) => {

        entradas.forEach((entrada) => {

            if (entrada.isIntersecting) {

                const idSecao = entrada.target.id;

                linksMenu.forEach((link) => {

                    const selecionado =
                        link.getAttribute("href") === `#${idSecao}`;

                    link.classList.toggle("ativo", selecionado);

                });

            }

        });

    }, {
        rootMargin: "-25% 0px -60% 0px"
    });

    secoes.forEach((secao) => {
        observadorMenu.observe(secao);
    });

}


/* =========================================
   4. PLAYER MUSICAL
========================================= */

const audio = document.querySelector("#audio-banda");

const botaoPlay = document.querySelector("#player-play");
const botaoAnterior = document.querySelector("#player-anterior");
const botaoProxima = document.querySelector("#player-proxima");

const tituloPlayer = document.querySelector("#player-titulo");
const capaPlayer = document.querySelector(".player-capa");

const barraProgresso = document.querySelector("#barra-progresso");
const tempoAtual = document.querySelector("#tempo-atual");
const duracao = document.querySelector("#duracao");

const botoesOuvir = document.querySelectorAll("[data-track]");

const faixas = [
    {
        titulo: "Náusea",
        capa: "img/capaabsinto.jpg",
        arquivo: "audio/nausea.mp3"
    },
    {
        titulo: "Apatia Crônica Generalizada",
        capa: "img/capaabsinto.jpg",
        arquivo: "audio/apatia-cronica-generalizada.mp3"
    },
    {
        titulo: "Jam",
        capa: "img/capaabsinto.jpg",
        arquivo: "audio/jam.mp3"
    }
];

let faixaAtual = 1;


/* Formata os segundos como minutos e segundos */

function formatarTempo(segundos) {

    if (!Number.isFinite(segundos)) {
        return "0:00";
    }

    const minutos = Math.floor(segundos / 60);
    const resto = Math.floor(segundos % 60);

    return `${minutos}:${String(resto).padStart(2, "0")}`;
}


/* Atualiza os dados da faixa selecionada */

function carregarFaixa(indice) {

    faixaAtual = (indice + faixas.length) % faixas.length;

    const faixa = faixas[faixaAtual];

    audio.src = faixa.arquivo;

    tituloPlayer.textContent = faixa.titulo;
    capaPlayer.src = faixa.capa;
    capaPlayer.alt = `Capa de ${faixa.titulo}`;

    barraProgresso.value = 0;
    tempoAtual.textContent = "0:00";
    duracao.textContent = "0:00";

    botaoPlay.textContent = "▶";
    botaoPlay.setAttribute("aria-label", "Reproduzir música");
}


/* Reproduz ou pausa a faixa atual */

async function alternarReproducao() {

    if (audio.paused) {

        if (!audio.getAttribute("src")) {
            carregarFaixa(faixaAtual);
        }

        try {

            await audio.play();

            botaoPlay.textContent = "Ⅱ";
            botaoPlay.setAttribute("aria-label", "Pausar música");

        } catch (erro) {

            console.error("Não foi possível reproduzir a música:", erro);

            botaoPlay.textContent = "▶";
            botaoPlay.setAttribute("aria-label", "Reproduzir música");

        }

    } else {

        audio.pause();

        botaoPlay.textContent = "▶";
        botaoPlay.setAttribute("aria-label", "Reproduzir música");

    }

}


/* Seleciona uma faixa e inicia a reprodução */

async function tocarFaixa(indice) {

    carregarFaixa(indice);

    try {

        await audio.play();

        botaoPlay.textContent = "Ⅱ";
        botaoPlay.setAttribute("aria-label", "Pausar música");

    } catch (erro) {

        console.error("Não foi possível reproduzir a faixa:", erro);

    }

}


/* Controles do player */

botaoPlay.addEventListener("click", alternarReproducao);

botaoAnterior.addEventListener("click", () => {
    tocarFaixa(faixaAtual - 1);
});

botaoProxima.addEventListener("click", () => {
    tocarFaixa(faixaAtual + 1);
});


/* Botões das capas dos álbuns */

botoesOuvir.forEach((botao) => {

    botao.addEventListener("click", () => {

        const indice = Number(botao.dataset.track);

        if (Number.isInteger(indice) && faixas[indice]) {
            tocarFaixa(indice);
        }

    });

});


/* Atualiza o tempo da música */

audio.addEventListener("loadedmetadata", () => {

    duracao.textContent = formatarTempo(audio.duration);

});

audio.addEventListener("timeupdate", () => {

    if (Number.isFinite(audio.duration) && audio.duration > 0) {

        barraProgresso.value =
            (audio.currentTime / audio.duration) * 100;

        tempoAtual.textContent =
            formatarTempo(audio.currentTime);

        duracao.textContent =
            formatarTempo(audio.duration);

    }

});


/* Permite avançar ou retroceder na música */

barraProgresso.addEventListener("input", () => {

    if (Number.isFinite(audio.duration) && audio.duration > 0) {

        audio.currentTime =
            (Number(barraProgresso.value) / 100) * audio.duration;

    }

});


/* Quando uma música termina, toca a próxima */

audio.addEventListener("ended", () => {

    tocarFaixa(faixaAtual + 1);

});


/* Exibe a primeira faixa no player, sem reproduzir automaticamente */

carregarFaixa(faixaAtual);



