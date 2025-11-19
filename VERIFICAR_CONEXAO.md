# Verificar Conexão Frontend-Backend

## Problema: ERR_NETWORK mesmo com backend rodando

Se o backend está rodando mas você ainda vê `ERR_NETWORK` ou `ERR_CONNECTION_REFUSED`, siga estes passos:

## 1. Verificar se o Backend Está Rodando

### No terminal do backend, você deve ver:
```
✅ Conectado ao MongoDB Atlas
🚀 Servidor Portal do Aluno rodando na porta... 3100
📚 API disponível em: http://localhost:3100/api
```

### Testar no navegador:
Abra: `http://localhost:3100/api`

Deve aparecer uma mensagem JSON como:
```json
{
  "message": "Portal do Aluno API - Funcionando!",
  "version": "1.0.0"
}
```

## 2. Verificar o Console do Frontend

Abra o console do navegador (F12) e procure por:
```
🔗 API Base URL: /api
📍 Ambiente: Desenvolvimento Local
```

Se aparecer `http://localhost:3100/api` ao invés de `/api`, o proxy não está funcionando.

## 3. Reiniciar o Frontend

Após as alterações, **reinicie o frontend**:

1. Pare o frontend (Ctrl+C)
2. Inicie novamente:
   ```bash
   cd fribt-main
   npm run dev
   ```

## 4. Verificar Porta do Backend

Certifique-se de que o backend está na porta **3100**:

1. Abra `back-do-cafe-main/config.env`
2. Verifique: `PORT=3100`

## 5. Verificar CORS no Backend

O backend deve permitir requisições de `http://localhost:5173`.

No arquivo `back-do-cafe-main/config.env`:
```env
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

## 6. Testar Requisição Manual

No console do navegador (F12), execute:

```javascript
fetch('/api')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

Se funcionar, deve aparecer a mensagem da API.

## 7. Verificar Firewall/Antivírus

Alguns firewalls ou antivírus podem bloquear conexões locais. Tente:

1. Desabilitar temporariamente o firewall
2. Adicionar exceção para Node.js
3. Verificar se o antivírus não está bloqueando

## 8. Usar URL Direta (Alternativa)

Se o proxy não funcionar, você pode usar a URL direta:

1. Crie um arquivo `.env` em `fribt-main/`:
   ```env
   VITE_API_URL=http://localhost:3100/api
   ```

2. Reinicie o frontend

## Solução Rápida

1. **Pare o frontend** (Ctrl+C)
2. **Pare o backend** (Ctrl+C)
3. **Inicie o backend primeiro**:
   ```bash
   cd back-do-cafe-main
   npm run dev
   ```
4. **Aguarde ver a mensagem de sucesso**
5. **Em outro terminal, inicie o frontend**:
   ```bash
   cd fribt-main
   npm run dev
   ```
6. **Teste novamente**

## Logs Úteis

No console do navegador, você deve ver:
- `🔗 API Base URL: /api` (ou a URL configurada)
- `📍 Ambiente: Desenvolvimento Local`

No terminal do backend, você deve ver:
- Requisições chegando quando faz login
- Logs de cada requisição

Se não aparecer nada no backend quando tenta fazer login, a requisição não está chegando.

