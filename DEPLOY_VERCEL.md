# Guia de Deploy no Vercel - Frontend

## Pré-requisitos

1. Conta no Vercel (https://vercel.com)
2. Backend já deployado no Vercel
3. Repositório Git (GitHub, GitLab ou Bitbucket)

## Passo a Passo

### 1. Preparar o Projeto

O projeto já está configurado para funcionar no Vercel. Certifique-se de que:
- O arquivo `vercel.json` está correto (já configurado)
- O arquivo `vite.config.cjs` está correto

### 2. Configurar Variáveis de Ambiente Localmente (Opcional)

Crie um arquivo `.env` na raiz do projeto (não commite este arquivo):

```env
VITE_API_URL=http://localhost:3100/api
```

### 3. Fazer Deploy no Vercel

#### Opção A: Via CLI do Vercel

```bash
# Instalar Vercel CLI globalmente
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

#### Opção B: Via Dashboard do Vercel

1. Acesse https://vercel.com
2. Clique em "New Project"
3. Conecte seu repositório Git
4. Configure o projeto:
   - **Framework Preset**: Vite
   - **Root Directory**: `fribt-main` (ou o nome da pasta do frontend)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 4. Configurar Variáveis de Ambiente no Vercel

No painel do Vercel, vá em **Settings > Environment Variables** e adicione:

#### Variável Obrigatória

```
VITE_API_URL=https://seu-backend.vercel.app/api
```

**IMPORTANTE**: Substitua `seu-backend.vercel.app` pela URL real do seu backend deployado no Vercel.

### 5. Configurar Domínio Personalizado (Opcional)

1. No painel do Vercel, vá em **Settings > Domains**
2. Adicione seu domínio personalizado
3. Configure os registros DNS conforme instruções

### 6. Testar o Deploy

Após o deploy, acesse a URL fornecida pelo Vercel e teste:

1. Acesse a página de login
2. Verifique se as requisições para a API estão funcionando
3. Teste o login e outras funcionalidades

## Troubleshooting

### Erro 404 nas Rotas
- Certifique-se de que o `vercel.json` está configurado corretamente
- Verifique se todas as rotas estão sendo redirecionadas para `index.html`

### Erro de CORS
- Verifique se a variável `VITE_API_URL` está configurada corretamente
- Verifique se o backend está configurado para aceitar requisições do frontend
- Verifique se a variável `CORS_ORIGIN` no backend inclui a URL do frontend

### Erro de Conexão com a API
- Verifique se a variável `VITE_API_URL` está configurada no Vercel
- Verifique se a URL do backend está correta
- Verifique se o backend está online e funcionando

### Build Falha
- Verifique se todas as dependências estão no `package.json`
- Execute `npm install` localmente para verificar se há erros
- Verifique os logs de build no Vercel

## Estrutura de Arquivos

```
fribt-main/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   │   └── api.js        # Configuração da API
│   └── ...
├── public/
├── vercel.json           # Configuração do Vercel
├── vite.config.cjs       # Configuração do Vite
└── package.json
```

## Variáveis de Ambiente

### Desenvolvimento Local

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3100/api
```

### Produção (Vercel)

Configure no painel do Vercel:

```
VITE_API_URL=https://seu-backend.vercel.app/api
```

## URLs Importantes

Após o deploy, você receberá uma URL como:
- `https://seu-frontend.vercel.app`

Use esta URL para configurar o CORS no backend.

## Configuração Completa

### 1. Backend no Vercel
- URL: `https://seu-backend.vercel.app`
- Variável `CORS_ORIGIN`: `https://seu-frontend.vercel.app`

### 2. Frontend no Vercel
- URL: `https://seu-frontend.vercel.app`
- Variável `VITE_API_URL`: `https://seu-backend.vercel.app/api`

### 3. MongoDB Atlas
- Network Access: `0.0.0.0/0` (ou IPs do Vercel)
- Connection String: Configurada como `MONGODB_URI` no backend

## Comandos Úteis

```bash
# Desenvolvimento local
npm run dev

# Build local
npm run build

# Preview do build
npm run preview

# Deploy no Vercel
vercel

# Deploy para produção
vercel --prod

# Ver logs
vercel logs
```

