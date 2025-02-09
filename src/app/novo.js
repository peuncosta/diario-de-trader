// pages/novo.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Novo() {
  const [formData, setFormData] = useState({
    data: '',
    ativo: '',
    operacao: '',
    preco: '',
    observacoes: '',
  });
  const router = useRouter();

  // Função para lidar com a mudança de valores dos inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função para enviar os dados para a API
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/operacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert('Operação cadastrada com sucesso!');
        router.push('/operacoes');
      } else {
        alert('Erro ao cadastrar operação.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao cadastrar operação.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Cadastrar Nova Operação</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Data:</label>
          <input type="date" name="data" value={formData.data} onChange={handleChange} required />
        </div>
        <div>
          <label>Ativo:</label>
          <input type="text" name="ativo" value={formData.ativo} onChange={handleChange} required />
        </div>
        <div>
          <label>Operação:</label>
          <select name="operacao" value={formData.operacao} onChange={handleChange} required>
            <option value="">Selecione</option>
            <option value="compra">Compra</option>
            <option value="venda">Venda</option>
          </select>
        </div>
        <div>
          <label>Preço:</label>
          <input type="number" step="0.01" name="preco" value={formData.preco} onChange={handleChange} required />
        </div>
        <div>
          <label>Observações:</label>
          <textarea name="observacoes" value={formData.observacoes} onChange={handleChange} />
        </div>
        <button type="submit">Salvar Operação</button>
      </form>
    </div>
  );
}
