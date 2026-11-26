
/*
==================================================
 ESTÚDIO ABERTO — SCRIPT PRINCIPAL
==================================================

COMO EDITAR OS ARTISTAS:
1. Adicione ou remova artistas no array ARTISTS.
2. photo: caminho da imagem dentro da pasta img.
3. audio: caminho da música dentro da pasta audio.
4. genre: gênero musical do artista.
5. link: link externo do artista.

Exemplo:
photo: "img/novo-artista.webp"
audio: "audio/nova-musica.mp3"

==================================================
*/

// ================================================
// 1. DADOS DOS ARTISTAS
// ================================================

const ARTISTS = [
  {
    name: "Veigh",
    realName: "Thiago Veigh da Silva",
    birth: "2001-09-12",
    photo: "img/veigh.webp",
    track: "Novo Balanço (Estúdio Session)",
    origin: "Itapevi • Zona Oeste",
    genre: "Pluggnb / Trap",
    dur: "2:54",
    audio: "audio/veigh.mp3",
    link: "https://open.spotify.com/search/Veigh",
    grad: "linear-gradient(135deg,#FF5500,#7A1FA2)",

    bio: "Cria de Itapevi (SP), tornou-se referência no pluggnb e trap nacional ao transformar vivências da Zona Oeste em sucessos de alcance global.",

    lyrics: `Eu e meus, eu e meus manos
Cheio de ouro e o corte americano (juro)
Isso é um novo balanço
Quando ela desce, eu fico bambo
Senta em mim enquanto eu conto
Morde o canto do copo me olhando
Dentro do baile com meu som tocando.`
  },

  {
    name: "NandaTsunami",
    realName: "Fernanda Xavier Ferreira Santana",
    birth: "2000-02-05",
    photo: "img/nandatsunami.webp",
    track: "P.I.T.T.Y",
    origin: "São Vicente • Baixada Santista",
    genre: "Trap / Experimental",
    dur: "2:20",
    audio: "audio/nandatsunami.mp3",
    link: "https://open.spotify.com/search/NandaTsunami%20P.I.T.T.Y",
    grad: "linear-gradient(135deg,#00B7FF,#FF2D95)",

    bio: "Cantora e compositora da Baixada Santista reconhecida pela identidade sonora ousada, mesclando trap, rage e R&B contemporâneo.",

    lyrics: `Gosto dos homens igual eu gosto dos meus sapatos
Calados (shh), bonitos e altos
Me desculpa se eu sou rasa, eu tô tentando melhorar (aham)
Tento de novo na segunda, hoje é sexta, não vai dar
Às vezes eu só taco o foda-se, ajo igualzinho os cara
Tipo, eu não vou ouvir seu som se você tiver namorada.`
  },

  {
    name: "Sotam",
    realName: "Thomaz Matos",
    photo: "img/sotam.jfif",
    track: "Sinceramente",
    origin: "Zona Norte • SP",
    genre: "Trap / Drill",
    dur: "2:30",
    audio: "audio/sotam.mp3",
    link: "https://open.spotify.com/search/Sotam%20Sinceramente",
    grad: "linear-gradient(135deg,#1B2A6B,#00E676)",

    bio: "Nome forte da cena independente, combina beats atmosféricos, estética urbana e rimas sobre o cotidiano noturno e independência.",

    lyrics: `Sinceramente, eu não consigo te entender
Você diz que eu faço falta, mas também não quer me ter
Deixa nossas fotos salvas, mas me bloqueia na rede
Me liga de madrugada pra falar que não tá bem
E a minha mente já não sabe o que fazer
Se eu bater na tua casa, será que vai me atender?
Não tava fazendo nada e trouxe flores para você
Dizem que a saudade mata, e eu não vou pagar pra ver.`
  },

  {
    name: "22Diniz",
    photo: "img/22diniz.jfif",
    track: "Te Encontrar na Lapa",
    origin: "Periferia • SP",
    genre: "Trap / Street",
    dur: "3:15",
    audio: "audio/22diniz.mp3",
    link: "https://open.spotify.com/search/22Diniz%20Te%20Encontrar%20na%20Lapa",
    grad: "linear-gradient(135deg,#FFB300,#B71C1C)",

    bio: "Representante da nova geração do trap de rua, aposta em graves pesados de 808 e narrativas autênticas sobre o corre da quebrada.",

    lyrics: `Foda-se
Eu aprendo a viver sem você
Tu nunca entendeu minha vida
E eu correndo sempre de segunda a segunda
Reclamava que eu não parava em casa
E eu doido pra morar dentro dessa bunda
E esse maço no bolso é meu melhor amigo, parece contigo
Também sei que ele vai me matar, mas pelo menos esse vem com aviso.`
  }
];


// ================================================
// 2. GÊNEROS MUSICAIS
// ================================================

const GENRES = [
  "Todos",
  "Pluggnb / Trap",
  "Trap / Experimental",
  "Trap / Drill",
  "Trap / Street"
];


// ================================================
// 3. ELEMENTOS E VARIÁVEIS PRINCIPAIS
// ================================================

const $ = s => document.querySelector(s);

const audio = $("#audio");

let current = -1;
let filter = "Todos";
let lastFocus = null;


// ================================================
// 4. FUNÇÕES UTILITÁRIAS
// ================================================

const fmt = t => {
  if (!isFinite(t)) return "00:00";

  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);

  return String(m).padStart(2, "0") + ":" +
         String(s).padStart(2, "0");
};

const esc = s =>
  String(s ?? "").replace(/[&<>"]/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  }[c]));

function toast(msg) {
  const t = document.createElement("div");

  t.className = "toast";
  t.setAttribute("role", "status");
  t.textContent = msg;

  document.body.appendChild(t);

  setTimeout(() => t.remove(), 2600);
}


// ================================================
// 5. ACESSIBILIDADE
// ================================================

let fontPct = 100;

const setFont = v => {
  fontPct = Math.min(130, Math.max(80, v));
  document.documentElement.style.fontSize = fontPct + "%";
};

$("#fontUp").onclick = () => setFont(fontPct + 10);

$("#fontDown").onclick = () => setFont(fontPct - 10);

$("#contrast").onclick = e => {
  const on = document.body.classList.toggle("hc");

  e.currentTarget.setAttribute("aria-pressed", on);
};


// ================================================
// 6. MENU MOBILE
// ================================================

$("#burger").onclick = e => {
  const open = $("#nav").classList.toggle("open");

  e.currentTarget.setAttribute("aria-expanded", open);
};

document.querySelectorAll("#nav a").forEach(a => {
  a.onclick = () => {
    $("#nav").classList.remove("open");

    $("#burger").setAttribute("aria-expanded", "false");
  };
});


// ================================================
// 7. FILTROS E CATÁLOGO
// ================================================

function renderFilters() {

  $("#filters").innerHTML = GENRES.map(g => `
    <button
      class="chip"
      aria-pressed="${g === filter}"
      data-g="${esc(g)}">
      ${esc(g)}
    </button>
  `).join("");

  document.querySelectorAll(".chip").forEach(b => {

    b.onclick = () => {
      filter = b.dataset.g;

      renderFilters();
      renderCatalog();
    };

  });
}


function renderCatalog() {

  const list = ARTISTS
    .map((a, i) => ({ a, i }))
    .filter(({ a }) =>
      filter === "Todos" || a.genre === filter
    );

  $("#catalog").innerHTML = list.map(({ a, i }) => `

    <article class="card" data-i="${i}">

      <div
        class="art"
        style="background:${a.grad || "var(--line)"}">

        <img
          src="${esc(a.photo)}"
          alt="Foto de ${esc(a.name)}"
          loading="lazy">

        <div class="eq" aria-hidden="true">
          <i></i><i></i><i></i><i></i>
        </div>

      </div>

      <div class="info">

        <h3>${esc(a.name)}</h3>

        <div class="trk">
          ${esc(a.track)}
        </div>

        <div class="meta">
          ${esc(a.origin)}
          ${a.dur ? " • " + esc(a.dur) : ""}
        </div>

        <span class="genre">
          ${esc(a.genre)}
        </span>

        <div class="row">

          <button
            class="play"
            data-play="${i}"
            aria-label="Tocar ${esc(a.track)}">
            ▶
          </button>

          <button
            class="link"
            data-info="${i}">
            Ver Letra &amp; Bio
          </button>

          ${a.link ? `
            <a
              class="link"
              href="${esc(a.link)}"
              target="_blank"
              rel="noopener noreferrer">
              Ouvir no Spotify
            </a>
          ` : ""}

        </div>

      </div>

    </article>

  `).join("");

  document.querySelectorAll("[data-play]").forEach(b => {
    b.onclick = () => toggleTrack(+b.dataset.play);
  });

  document.querySelectorAll("[data-info]").forEach(b => {
    b.onclick = () => openModal(+b.dataset.info, b);
  });

  syncUI();
}


// ================================================
// 8. PLAYER DE MÚSICA
// ================================================

function loadTrack(i) {

  current = i;

  const a = ARTISTS[i];

  audio.src = a.audio;
  audio.load();

  $("#pTitle").textContent = a.track;

  $("#pArtist").textContent =
    a.name + (a.origin ? " • " + a.origin : "");

  const thumb = $("#pThumb");

  if (thumb.tagName === "IMG") {

    thumb.src = a.photo || "";
    thumb.alt = "Foto de " + (a.name || "artista");

  } else {

    thumb.style.background =
      `url(${a.photo}) center/cover, ${a.grad || "var(--line)"}`;

  }

  $("#seek").value = 0;
  $("#cur").textContent = "00:00";
  $("#dur").textContent = a.dur || "00:00";
}


function toggleTrack(i) {

  if (current !== i) {
    loadTrack(i);
  }

  if (audio.paused) {

    audio.play().catch(() => {
      toast("Não foi possível tocar o áudio. Verifique o arquivo na pasta audio/.");
    });

  } else {

    audio.pause();

  }
}


function step(d) {

  if (!ARTISTS.length) return;

  const i = current < 0
    ? 0
    : (current + d + ARTISTS.length) % ARTISTS.length;

  loadTrack(i);

  audio.play().catch(() => {});
}


function syncUI() {

  const playing = !audio.paused && current >= 0;

  document.querySelectorAll("#catalog .card").forEach(c => {

    const idx = +c.dataset.i;
    const mine = idx === current && playing;

    c.classList.toggle("playing", mine);

    const b = c.querySelector("[data-play]");

    if (b && ARTISTS[idx]) {

      b.textContent = mine ? "❚❚" : "▶";

      b.setAttribute(
        "aria-label",
        (mine ? "Pausar " : "Tocar ") + ARTISTS[idx].track
      );

    }

  });

  $("#pPlay").textContent = playing ? "❚❚" : "▶";

  $("#pPlay").setAttribute(
    "aria-label",
    playing ? "Pausar" : "Tocar"
  );
}


$("#pPlay").onclick = () => toggleTrack(current < 0 ? 0 : current);

$("#prev").onclick = () => step(-1);

$("#next").onclick = () => step(1);


audio.addEventListener("play", syncUI);

audio.addEventListener("pause", syncUI);

audio.addEventListener("ended", () => step(1));

audio.addEventListener("loadedmetadata", () => {
  $("#dur").textContent = fmt(audio.duration);
});

audio.addEventListener("timeupdate", () => {

  $("#cur").textContent = fmt(audio.currentTime);

  if (audio.duration) {
    $("#seek").value = audio.currentTime / audio.duration * 100;
  }

});

audio.addEventListener("error", () => {

  if (current >= 0) {
    toast("Erro ao carregar o arquivo de áudio.");
  }

});


$("#seek").oninput = e => {

  if (audio.duration) {
    audio.currentTime = e.target.value / 100 * audio.duration;
  }

};

$("#vol").oninput = e => {
  audio.volume = +e.target.value;
};

audio.volume = .8;


// ================================================
// 9. MODAL DE ARTISTAS
// ================================================

function openModal(i, trigger) {

  const a = ARTISTS[i];

  lastFocus = trigger;

  $("#mPhoto").src = a.photo || "";
  $("#mPhoto").alt = "Foto de " + (a.name || "artista");

  $("#mTitle").textContent = a.name || "";

  $("#mSub").textContent =
    (a.track || "") + (a.origin ? " • " + a.origin : "");

  const ageOf = iso => {

    const [y, m, d] = iso.split("-").map(Number);

    const n = new Date();

    let r = n.getFullYear() - y;

    if (
      n.getMonth() + 1 < m ||
      (n.getMonth() + 1 === m && n.getDate() < d)
    ) {
      r--;
    }

    return r;
  };


  $("#mReal").textContent = [
    a.realName && "Nome verdadeiro: " + a.realName,
    a.birth && ageOf(a.birth) + " anos"
  ].filter(Boolean).join(" • ");


  $("#mBio").textContent = a.bio || "";

  const L = $("#mLyrics");

  L.textContent = "";

  if (a.lyricsUrl) {

    const k = document.createElement("a");

    k.href = a.lyricsUrl;
    k.target = "_blank";
    k.rel = "noopener noreferrer";
    k.className = "link";
    k.textContent = "Ler a letra completa no Letras.mus.br";

    L.classList.remove("lyrics");
    L.appendChild(k);

  } else {

    L.classList.add("lyrics");
    L.textContent = a.lyrics || "";

  }

  $("#overlay").classList.add("open");

  $("#mClose").focus();
}


function closeModal() {

  $("#overlay").classList.remove("open");

  if (lastFocus) {
    lastFocus.focus();
  }

}


$("#mClose").onclick = closeModal;

$("#overlay").onclick = e => {

  if (e.target.id === "overlay") {
    closeModal();
  }

};

document.addEventListener("keydown", e => {

  if (
    e.key === "Escape" &&
    $("#overlay").classList.contains("open")
  ) {
    closeModal();
  }

});


// ================================================
// 10. FORMULÁRIO COM VALIDAÇÃO
// ================================================

const form = $("#form");

form.zap.addEventListener("input", e => {

  let v = e.target.value.replace(/\D/g, "").slice(0, 11);

  if (v.length > 6) {

    v = `(${v.slice(0, 2)}) ${v.slice(2, v.length - 4)}-${v.slice(-4)}`;

  } else if (v.length > 2) {

    v = `(${v.slice(0, 2)}) ${v.slice(2)}`;

  }

  e.target.value = v;

});


function validate(f) {

  const v = f.value.trim();

  let msg = "";

  if (!v) {
    msg = "Preencha este campo.";
  }

  else if (f.name === "nome" && v.length < 2) {
    msg = "Use ao menos 2 caracteres.";
  }

  else if (
    f.name === "demo" &&
    !/^https?:\/\/(www\.)?(soundcloud\.com|youtu\.be|youtube\.com|drive\.google\.com)\/\S+/i.test(v)
  ) {
    msg = "Use um link do SoundCloud, YouTube ou Google Drive.";
  }

  else if (
    f.name === "zap" &&
    !/^\(\d{2}\) 9?\d{4}-\d{4}$/.test(v)
  ) {
    msg = "Informe DDD e número, ex.: (11) 90000-0000.";
  }

  else if (f.name === "historia" && v.length < 20) {
    msg = "Conte um pouco mais (mínimo de 20 caracteres).";
  }

  f.setAttribute("aria-invalid", !!msg);

  f.parentElement.querySelector(".err").textContent = msg;

  return !msg;
}


form.querySelectorAll("input,select,textarea").forEach(f => {

  f.addEventListener("blur", () => validate(f));

});


// Endereço do PHP que grava no banco.
// Local (php -S na pasta do projeto): "api/inscrever.php".
// Em produção, se o PHP estiver em outro servidor, troque pelo endereço completo.
const API_INSCRICAO = "api/inscrever.php";

form.addEventListener("submit", async e => {

  e.preventDefault();

  const fields = [
    ...form.querySelectorAll("input,select,textarea")
  ];

  const ok = fields.map(validate).every(Boolean);

  if (!ok) {

    fields.find(
      f => f.getAttribute("aria-invalid") === "true"
    ).focus();

    return;

  }

  const btn = form.querySelector('button[type="submit"]');
  const textoBtn = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Enviando...";

  try {

    const resp = await fetch(API_INSCRICAO, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        Object.fromEntries(new FormData(form))
      )
    });

    const dados = await resp.json().catch(() => ({}));

    if (!resp.ok || !dados.ok) {

      // mostra o erro do servidor no campo certo, se houver
      if (dados.erros) {
        for (const [nome, msg] of Object.entries(dados.erros)) {
          const campo = form.elements[nome];
          if (campo) {
            campo.setAttribute("aria-invalid", "true");
            campo.parentElement.querySelector(".err").textContent = msg;
          }
        }
      } else {
        toast(dados.erro || "Não foi possível enviar agora. Tente novamente.");
      }

      return;

    }

    $("#proto").textContent = dados.protocolo;

    form.classList.add("hidden");

    $("#success").classList.remove("hidden");

    $("#success").focus();

  } catch (erro) {

    toast("Sem conexão com o servidor. Tente novamente em instantes.");

  } finally {

    btn.disabled = false;
    btn.textContent = textoBtn;

  }

});


$("#again").onclick = () => {

  form.reset();

  form.querySelectorAll("[aria-invalid]").forEach(f => {
    f.removeAttribute("aria-invalid");
  });

  $("#success").classList.add("hidden");

  form.classList.remove("hidden");

};


// ================================================
// 11. RODAPÉ
// ================================================

$("#pdf").onclick = () => {
  toast("Protótipo: o PDF do guia será disponibilizado em breve.");
};


// ================================================
// 12. INICIALIZAÇÃO DO SITE
// ================================================

renderFilters();

renderCatalog();
