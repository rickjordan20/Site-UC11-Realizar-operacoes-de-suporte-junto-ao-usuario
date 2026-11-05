# Serviço de autorização UC11

Esta pasta contém a implementação da função Vercel que valida o ID token do Firebase e verifica se a conta Google está cadastrada como estudante ou professora no Google Classroom. A rota pública do projeto é `api/authorize.js` na raiz do repositório, que reexporta esta função para que o Vercel publique `/api/authorize` sem alterar as URLs das páginas estáticas.

## Implantação

1. Configure o projeto Vercel com a **raiz do repositório** como Root Directory. Não selecione `backend-vercel` como raiz: isso separaria a função do portal estático.
2. Configure as variáveis privadas `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` e `GOOGLE_REFRESH_TOKEN`.
3. A conta emissora do refresh token precisa consultar a lista de estudantes do curso `689889762928` com o escopo `https://www.googleapis.com/auth/classroom.rosters.readonly`.
4. A conta que emitiu o refresh token precisa conseguir consultar os participantes do curso. A autorização verifica a conta pelo ID Google do Firebase e, como alternativa, pelo e-mail verificado no token; só libera estudantes ou professores cadastrados no `CLASSROOM_COURSE_ID`.
5. Opcionalmente, configure `CLASSROOM_COURSE_ID` e `APP_ORIGINS` (origens separadas por vírgula). Por padrão, são aceitos `https://uc11-classroom-auth.vercel.app` e `https://rickjordan20.github.io`.
6. Confirme que `/api/authorize` está disponível no mesmo domínio apontado em `auth-config.js` e teste acesso de estudante, professora, conta ausente, token inválido e falha de configuração.

## Segurança e limitações

- O token Firebase é verificado no servidor; a identidade Google vem do token, não do corpo enviado pelo navegador.
- As consultas ao Classroom são somente leitura; a API não retorna nomes ou listas de participantes.
- Segredos OAuth e refresh tokens devem existir apenas no ambiente privado do Vercel.
- CORS não é autorização e não impede chamadas diretas de outros clientes.
- O guard da interface não protege arquivos HTML estáticos acessados diretamente por URL.
- O pacote raiz declara `jose` para que a função Vercel resolva a dependência quando publicada pela raiz. O `package.json` desta pasta continua útil para execução isolada local.

Veja o procedimento de acesso em [`../README.md`](../README.md).
