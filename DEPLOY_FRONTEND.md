# 🚀 Deploy do Frontend no Vercel - Passo a Passo

## ✅ Pré-requisitos

- ✅ Backend já deployado no Vercel e funcionando
- ✅ URL do backend (ex: `https://seu-backend.vercel.app`)

## 📋 Passo a Passo

### 1. Fazer Deploy no Vercel

#### Opção A: Via Dashboard do Vercel (Recomendado)

1. Acesse https://vercel.com
2. Clique em **"New Project"** ou **"Add New..."** > **"Project"**
3. Conecte seu repositório Git (GitHub, GitLab ou Bitbucket)
4. Selecione o repositório que contém o frontend
5. Configure o projeto:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `fribt-main` (ou o nome da pasta do frontend)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Clique em **"Deploy"**

#### Opção B: Via CLI do Vercel

```bash
cd fribt-main
npm install -g vercel
vercel login
vercel
vercel --prod
```

### 2. Configurar Variável de Ambiente

**⚠️ IMPORTANTE**: Após o deploy, você DEVE configurar a variável de ambiente antes de usar o frontend!

1. No painel do Vercel, vá em **Settings** > **Environment Variables**
2. Adicione a seguinte variável:

```
Key: VITE_API_URL
Value: https://seu-backend.vercel.app/api
```

**⚠️ IMPORTANTE**: 
- Substitua `seu-backend.vercel.app` pela URL REAL do seu backend
- A URL deve incluir `/api` no final
- Exemplo: Se seu backend é `https://portal-aluno-backend.vercel.app`, então:
  - `VITE_API_URL = https://portal-aluno-backend.vercel.app/api`

3. Selecione os ambientes:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
4. Clique em **"Save"**

### 3. Fazer Novo Deploy

Após configurar a variável de ambiente, você precisa fazer um novo deploy:

1. No painel do Vercel, vá em **Deployments**
2. Clique nos **3 pontinhos** (⋯) do último deployment
3. Clique em **"Redeploy"**
4. Ou faça um novo commit no repositório Git

### 4. Atualizar CORS no Backend

1. Volte ao projeto do backend no Vercel
2. Vá em **Settings** > **Environment Variables**
3. Atualize a variável `CORS_ORIGIN` para incluir a URL do frontend:

```
Key: CORS_ORIGIN
Value: https://seu-frontend.vercel.app
```

4. Faça um redeploy do backend

### 5. Testar o Frontend

1. Acesse a URL do frontend no navegador
2. Abra o Console do Navegador (F12)
3. Verifique se não há erros de CORS
4. Teste o login
5. Verifique se as requisições para a API estão funcionando

## 🔍 Verificar se Está Funcionando

### No Console do Navegador

Abra o Console (F12) e verifique:

1. **Logs de API**: Deve mostrar a URL da API sendo usada
2. **Erros de CORS**: Não deve haver erros de CORS
3. **Requisições**: As requisições devem estar indo para a URL correta do backend

### Teste Manual

1. Acesse a página de login
2. Tente fazer login
3. Se funcionar, o frontend está conectado ao backend corretamente!

## ⚠️ Problemas Comuns

### Erro de CORS

**Sintoma**: Erro no console: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solução**:
1. Verifique se `CORS_ORIGIN` no backend inclui a URL do frontend
2. Certifique-se de que a URL está com `https://`
3. Faça um redeploy do backend após atualizar `CORS_ORIGIN`

### Erro 404 nas Rotas

**Sintoma**: Página branca ao navegar entre rotas

**Solução**:
1. Verifique se o `vercel.json` está correto
2. Certifique-se de que todas as rotas redirecionam para `index.html`

### API não Conecta

**Sintoma**: Erro ao fazer requisições para a API

**Solução**:
1. Verifique se `VITE_API_URL` está configurada corretamente
2. Certifique-se de que a URL inclui `/api` no final
3. Verifique se o backend está online e funcionando
4. Faça um redeploy do frontend após configurar a variável

### Build Falha

**Sintoma**: Erro durante o build no Vercel

**Solução**:
1. Verifique se todas as dependências estão no `package.json`
2. Execute `npm install` localmente para verificar erros
3. Verifique os logs de build no Vercel

## 📝 Checklist Final

- [ ] Frontend deployado no Vercel
- [ ] Variável `VITE_API_URL` configurada no Vercel
- [ ] URL do backend está correta (com `/api` no final)
- [ ] Variável `CORS_ORIGIN` no backend inclui a URL do frontend
- [ ] Redeploy feito após configurar variáveis
- [ ] Frontend está funcionando e conectado ao backend
- [ ] Login está funcionando
- [ ] Não há erros no console do navegador

## 🎉 Pronto!

Após seguir todos os passos, seu frontend estará funcionando e conectado ao backend!

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs no painel do Vercel
2. Verifique o console do navegador (F12)
3. Consulte a documentação completa em [README_DEPLOY.md](../README_DEPLOY.md)

