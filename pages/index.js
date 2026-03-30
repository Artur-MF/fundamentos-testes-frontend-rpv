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

  // ─────────────────────────────────────────────
  // BUG #7 — O Refresh Acidental
  // Falta e.preventDefault() no onSubmit do form.
  // ─────────────────────────────────────────────
  function handleAdicionarTarefa(e) {
    // 🐛 BUG #7: Falta e.preventDefault() aqui
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

  // ─────────────────────────────────────────────
  // BUG #1 — A Edição Zumbi (Mutação direta)
  // Em vez de criar uma cópia do array, o código muta
  // o objeto diretamente e passa a mesma referência.
  // ─────────────────────────────────────────────
  function handleSalvarEdicao(id) {
    // 🐛 BUG #1: Mutação direta do estado
    const index = tarefas.findIndex((t) => t.id === id);
    tarefas[index].titulo = editandoTexto;
    setTarefas(tarefas); // mesma referência — React não re-renderiza

    setEditandoId(null);
    setEditandoTexto('');
  }

  // ─────────────────────────────────────────────
  // BUG #2 — O Apagão Incorreto
  // A key do .map usa o index, o que causa confusão
  // no React ao remover itens do início da lista.
  // (A key está no JSX de renderização mais abaixo)
  // ─────────────────────────────────────────────
  function handleExcluirTarefa(id) {
    setTarefas(tarefas.filter((t) => t.id !== id));
  }

  // ─────────────────────────────────────────────
  // BUG #3 — O Checkbox Contagioso
  // O .map não verifica o ID corretamente e aplica
  // o toggle de conclusão para TODOS os itens.
  // ─────────────────────────────────────────────
  function handleToggleConcluida(id) {
    // 🐛 BUG #3: Falta verificação do id — marca todos
    const novasTarefas = tarefas.map((tarefa) => {
      return { ...tarefa, concluida: !tarefa.concluida };
    });

    setTarefas(novasTarefas);

    // ─────────────────────────────────────────
    // BUG #4 — O Contador Atrasado
    // Lê "tarefas" (valor antigo) logo após o set.
    // ─────────────────────────────────────────
    // 🐛 BUG #4: Usa o estado antigo para calcular
    const totalConcluidas = tarefas.filter((t) => t.concluida).length;
    setConcluidasContador(totalConcluidas);
  }

  // ─────────────────────────────────────────────
  // BUG #5 — O Filtro Congelado
  // useMemo com array de dependências vazio [].
  // O filtro nunca é recalculado após a montagem.
  // ─────────────────────────────────────────────
  // 🐛 BUG #5: Deveria depender de [tarefas, abaAtiva]
  const tarefasFiltradas = useMemo(() => {
    if (abaAtiva === 'concluidas') {
      return tarefas.filter((t) => t.concluida);
    }
    return tarefas;
  }, []); // <- dependências vazias!

  // ─────────────────────────────────────────────
  // BUG #9 — A Busca Rigorosa (Case Sensitivity)
  // Não normaliza para minúsculo antes de comparar.
  // ─────────────────────────────────────────────
  // 🐛 BUG #9: Falta .toLowerCase() em ambos os lados
  const tarefasVisiveis = busca
    ? tarefasFiltradas.filter((t) => t.titulo.includes(busca))
    : tarefasFiltradas;

  // ─────────────────────────────────────────────
  // BUG #10 — A Ordenação Caótica
  // .sort() sem comparador converte para string.
  // ─────────────────────────────────────────────
  function handleOrdenarPorPrioridade() {
    // 🐛 BUG #10: Sort sem função de comparação
    const ordenadas = [...tarefas].sort();
    setTarefas(ordenadas);
  }

  // ─────────────────────────────────────────────
  // Início da edição
  // ─────────────────────────────────────────────
  function handleIniciarEdicao(tarefa) {
    setEditandoId(tarefa.id);
    setEditandoTexto(tarefa.titulo);
  }

  // ─══════════════════════════════════════════════
  //  RENDERIZAÇÃO
  // ─══════════════════════════════════════════════
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

      {/* ───── BUG #7: form sem preventDefault ───── */}
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

      {/* ───── BUG #8: O Zero Fantasma ───── */}
      {/* 🐛 BUG #8: tarefasVisiveis.length && ... renderiza 0 quando vazio */}
      {tarefasVisiveis.length && (
        <div className="task-list">
          {/* ───── BUG #2: key usa index em vez de tarefa.id ───── */}
          {tarefasVisiveis.map((tarefa, index) => (
            <div
              key={index} /* 🐛 BUG #2: deveria ser key={tarefa.id} */
              className={`task-card ${tarefa.concluida ? 'done' : ''}`}
            >
              <div className="task-top">
                {/* ───── BUG #3: checkbox contagioso ───── */}
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

                {/* ───── BUG #6: Timer sem cleanup ───── */}
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
        {/* ───── BUG #4: Contador sempre atrasado ───── */}
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
