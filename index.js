// Função para formatar data
const formatador = (data) => {
  return {
    dia: {
      numerico: dayjs(data).format('DD'),
      semana: {
        curto: dayjs(data).format('ddd'),
        longo: dayjs(data).format('dddd'),
      },
    },
    mes: dayjs(data).format('MMMM'),
    hora: dayjs(data).format('HH:mm'),
  }
}

// Objeto inicial de atividade
const atividade = {
  nome: "Almoço",
  data: new Date("2024-07-08 10:00"),
  finalizada: false
}

// Lista de atividades
let atividades = [
  atividade,
  {
    nome: 'Academia em grupo',
    data: new Date("2024-07-09 12:00"),
    finalizada: false
  },
  {
    nome: 'gaming session',
    data: new Date("2024-07-10 13:00"),
    finalizada: false
  },
]

// Função para criar item de atividade
const createItemAtividade = (atividade) => {
  let input = `<input 
    onchange="concluirAtividade(event)"
    value="${atividade.data.getTime()}"  // Usar timestamp como valor
    type="checkbox"`
  
  if (atividade.finalizada) {
    input += ' checked'
  }

  input += '>'

  const formatar = formatador(atividade.data);

  return `
  <div class="card bg">
    ${input}
    <span>${atividade.nome}</span>
    <time class="short">
      ${formatar.dia.semana.curto}.
      ${formatar.dia.numerico} <br>
      ${formatar.hora}
    </time>
    <time class="full">
      ${formatar.dia.semana.longo}, ${formatar.dia.numerico} de ${formatar.mes} às ${formatar.hora}
    </time>
  </div>
`;
}

// Função para atualizar lista de atividades na página
const updateListaAtividades = () => {
  const section = document.querySelector('#atividades-lista');

  // Verificar se a lista está vazia
  if (atividades.length === 0) {
    section.innerHTML = `<p>Nenhuma Atividade Cadastrada.</p>`;
    return;
  }

  section.innerHTML = ''; // Limpa o conteúdo existente
  for (let atividade of atividades) {
    section.innerHTML += createItemAtividade(atividade);
  }
}

// Inicializa a lista de atividades na página
updateListaAtividades();

// Função para salvar nova atividade
const salvarAtividade = (event) => {
  event.preventDefault();
  const dadosDoFormulario = new FormData(event.target);
  const nome = dadosDoFormulario.get('atividades');
  const dia = dadosDoFormulario.get('dia');
  const hora = dadosDoFormulario.get('hora');
  const data = new Date(`${dia} ${hora}`);

  const novaAtividade = {
    nome,
    data,
    finalizada: false
  };

  // Verifica se já existe uma atividade no mesmo dia e hora
  const atividadeExiste = atividades.find((atividade) => {
    return atividade.data.getTime() === data.getTime(); // Comparar timestamps
  });

  if (atividadeExiste) {
    return alert('Dia/Hora não disponível');
  }

  atividades = [novaAtividade, ...atividades];
  updateListaAtividades();
}

// Função para criar seleção de dias
const createDaySelection = () => {
  const dias = [
    new Date("2024-02-28"),
    new Date("2024-02-29"),
    new Date("2024-03-01"),
    new Date("2024-03-02"),
    new Date("2024-03-03"),
  ];
  let diaSelecao = '';

  for (let dia of dias) {
    const formatar = formatador(dia);
    const diaFormatado = `
      ${formatar.dia.numerico} de
      ${formatar.mes} 
    `;
    diaSelecao += `
      <option value="${dayjs(dia).format('YYYY-MM-DD')}">${diaFormatado}</option>
    `;
  }

  document.querySelector('select[name="dia"]').innerHTML = diaSelecao;
}

// Inicializa a seleção de dias na página
createDaySelection();

// Função para criar seleção de horas
const createHorasSelecao = () => {
  let horasDisponiveis = '';

  for (let i = 6; i < 23; i++) {
    const hora = String(i).padStart(2, '0');
    horasDisponiveis += `<option value="${hora}:00">${hora}:00</option>`;
    horasDisponiveis += `<option value="${hora}:05">${hora}:05</option>`;
    horasDisponiveis += `<option value="${hora}:15">${hora}:15</option>`;
    horasDisponiveis += `<option value="${hora}:25">${hora}:25</option>`;
    horasDisponiveis += `<option value="${hora}:30">${hora}:30</option>`;
  }

  document.querySelector('select[name="hora"]').innerHTML = horasDisponiveis;
}

// Inicializa a seleção de horas na página
createHorasSelecao();

// Função para concluir atividade
const concluirAtividade = (event) => {
  const input = event.target;
  const dataDesteInput = parseInt(input.value);

  const atividadeEncontrada = atividades.find((atividade) => {
    return atividade.data.getTime() === dataDesteInput;
  });

  if (!atividadeEncontrada) {
    return;
  }

  atividadeEncontrada.finalizada = !atividadeEncontrada.finalizada;
  updateListaAtividades();
}
