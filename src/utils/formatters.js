// src/utils/formatters.js
export const formatDate = (iso) => {
    if (!iso) return '-';
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  
  export const formatTime = (iso) => {
    if (!iso) return '-';
    const d = new Date(iso);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };
  
  export const formatGrade = (n) => {
    if (n === null || n === undefined) return '-';
    return Number(n).toFixed(1).replace('.', ',');
  };
  