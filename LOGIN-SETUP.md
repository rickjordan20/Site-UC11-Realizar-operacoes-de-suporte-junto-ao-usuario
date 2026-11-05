# Acesso dos estudantes — UC11

O fluxo normal do portal utiliza Firebase Authentication com Google e valida a matrícula no Google Classroom por meio do endpoint Vercel configurado em `auth-config.js`.

## Implantação

Consulte [`README.md`](./README.md) para os passos de publicação e configuração de credenciais. O projeto Vercel deve usar a raiz do repositório, com `/api/authorize` disponível no mesmo domínio do portal. A implementação está em `backend-vercel/api/authorize.js` e é exposta por `api/authorize.js`.

## Comportamento e limitações

- O guard valida a sessão e a matrícula antes de exibir páginas no fluxo normal de navegação.
- Falha de autenticação ou indisponibilidade da API não libera a interface.
- `access-guard.js` é carregado em todas as páginas de conteúdo; login e política de privacidade permanecem públicos.
- A hospedagem estática não protege arquivos acessados diretamente por URL. Não use o guard como controle de confidencialidade; conteúdo que precise ser privado deve ser servido por infraestrutura com autorização por requisição.
- Os identificadores de configuração Firebase no navegador são públicos; segredos OAuth e refresh tokens devem permanecer somente no ambiente Vercel.
