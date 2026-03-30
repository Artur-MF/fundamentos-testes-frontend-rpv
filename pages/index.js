import { useState, useMemo } from 'react';
import Timer from '@/components/Timer';

// Gerador simples de IDs únicos
let proximoId = 4;
function gerarId() {
  return proximoId++;
}

// Dados iniciais de exemplo
const tarefasIniciais = [
  { id: 1, titulo: 'Estudar React', concluida: false, prioridade: 3 },
  { id: 2, titulo: 'Fazer exercícios de JavaScript', concluida: false, prioridade: 7 },
  { id: 3, titulo: 'Revisar HTML e CSS', concluida: false, prioridade: 1 },
];

export default function Home() {
  const [tarefas, setTarefas] = useState(tarefasIniciais);
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaPrioridade, setNovaPrioridade] = useState(5);
  const [busca, setBusca] = useState('');
  const [abaAtiva, setAbaAtiva] = useState('todas'); // 'todas' | 'concluidas'
  const [editandoId, setEditandoId] = useState(null);
  const [editandoTexto, setEditandoTexto] = useState('');
  const [concluidasContador, setConcluidasContador] = useState(0);

  function handleAdicionarTarefa(e) {
    if (!novoTitulo.trim()) return;

    const nova = {
      id: gerarId(),
      titulo: novoTitulo.trim(),
      concluida: false,
      prioridade: Number(novaPrioridade),
    };

    setTarefas([...tarefas, nova]);
    setNovoTitulo('');
    setNovaPrioridade(5);
  }

  function handleSalvarEdicao(id) {
    const index = tarefas.findIndex((t) => t.id === id);
    tarefas[index].titulo = editandoTexto;
    setTarefas(tarefas);

    setEditandoId(null);
    setEditandoTexto('');
  }

  function handleExcluirTarefa(id) {
    setTarefas(tarefas.filter((t) => t.id !== id));
  }

  function handleToggleConcluida(id) {
    const novasTarefas = tarefas.map((tarefa) => {
      return { ...tarefa, concluida: !tarefa.concluida };
    });

    setTarefas(novasTarefas);

    const totalConcluidas = tarefas.filter((t) => t.concluida).length;
    setConcluidasContador(totalConcluidas);
  }

  const tarefasFiltradas = useMemo(() => {
    if (abaAtiva === 'concluidas') {
      return tarefas.filter((t) => t.concluida);
    }
    return tarefas;
  }, []);

  const tarefasVisiveis = busca
    ? tarefasFiltradas.filter((t) => t.titulo.includes(busca))
    : tarefasFiltradas;

  function handleOrdenarPorPrioridade() {
    const ordenadas = [...tarefas].sort();
    setTarefas(ordenadas);
  }

  function handleIniciarEdicao(tarefa) {
    setEditandoId(tarefa.id);
    setEditandoTexto(tarefa.titulo);
  }

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="header">
        <h1>🐛 Caça aos Bugs</h1>
        <p>Gerenciador de Tarefas — Encontre e corrija os 10 bugs escondidos!</p>
      </header>

      {/* BANNER */}
      <div className="bug-banner">
        <span className="bug-icon">🔍</span>
        <div className="bug-info">
          <h3>Missão: 10 bugs escondidos neste código</h3>
          <p>
            O app funciona... mais ou menos. Investigue cada comportamento
            estranho, encontre o bug no código-fonte e corrija!
          </p>
        </div>
      </div>

      <form className="form-add" onSubmit={handleAdicionarTarefa}>
        <input
          type="text"
          placeholder="Nova tarefa..."
          value={novoTitulo}
          onChange={(e) => setNovoTitulo(e.target.value)}
        />
        <input
          type="number"
          min="1"
          max="10"
          placeholder="Prioridade"
          value={novaPrioridade}
          onChange={(e) => setNovaPrioridade(e.target.value)}
        />
        <button type="submit">+ Adicionar</button>
      </form>

      {/* BUSCA */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔎 Buscar tarefa..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {/* TABS & SORT */}
      <div className="tabs">
        <button
          className={`tab-btn ${abaAtiva === 'todas' ? 'active' : ''}`}
          onClick={() => setAbaAtiva('todas')}
        >
          Todas
        </button>
        <button
          className={`tab-btn ${abaAtiva === 'concluidas' ? 'active' : ''}`}
          onClick={() => setAbaAtiva('concluidas')}
        >
          Concluídas
        </button>
        <button className="sort-btn" onClick={handleOrdenarPorPrioridade}>
          ↕ Ordenar por Prioridade
        </button>
      </div>

      {tarefasVisiveis.length && (
        <div className="task-list">
          {tarefasVisiveis.map((tarefa, index) => (
            <div
              key={index}
              className={`task-card ${tarefa.concluida ? 'done' : ''}`}
            >
              <div className="task-top">
                <input
                  type="checkbox"
                  checked={tarefa.concluida}
                  onChange={() => handleToggleConcluida(tarefa.id)}
                />

                {editandoId === tarefa.id ? (
                  <input
                    className="edit-input"
                    type="text"
                    value={editandoTexto}
                    onChange={(e) => setEditandoTexto(e.target.value)}
                  />
                ) : (
                  <span
                    className={`task-title ${
                      tarefa.concluida ? 'completed-text' : ''
                    }`}
                  >
                    {tarefa.titulo}
                  </span>
                )}

                <span className="task-priority">P{tarefa.prioridade}</span>
              </div>

              <div className="task-actions">
                {editandoId === tarefa.id ? (
                  <button
                    className="btn-save"
                    onClick={() => handleSalvarEdicao(tarefa.id)}
                  >
                    💾 Salvar
                  </button>
                ) : (
                  <button onClick={() => handleIniciarEdicao(tarefa)}>
                    ✏️ Editar
                  </button>
                )}

                <button
                  className="btn-danger"
                  onClick={() => handleExcluirTarefa(tarefa.id)}
                >
                  🗑 Excluir
                </button>

                <Timer />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FOOTER */}
      <div className="footer-stats">
        <span className="stat">
          Total: <strong>{tarefas.length}</strong>
        </span>
        <span className="stat">
          Concluídas: <strong>{concluidasContador}</strong>
        </span>
        <span className="stat">
          Pendentes:{' '}
          <strong>{tarefas.length - concluidasContador}</strong>
        </span>
      </div>
    </div>
  );
}
