# Login da UC11 — implementação inicial
Turma-alvo: **2025.07.186**.

## Implementado
- Página `login.html` com entrada Google e saída, mensagens acessíveis e tema do site.
- Integração Firebase Authentication preparada em `auth.js`.
- Verificação **obrigatória** em um endpoint HTTPS de autorização; o navegador não pode autorizar a si mesmo.
- Falha segura: sem configuração ou sem resposta autorizada do servidor, nenhum acesso é confirmado.

## Pendente para ativar
1. Criar projeto Firebase, cadastrar o domínio GitHub Pages em Authentication > Settings > Authorized domains e ativar o provedor Google.
2. Registrar um aplicativo Web e preencher os identificadores públicos em `auth-config.js`.
3. Implantar um backend (por exemplo, Firebase Cloud Functions) que:
   - valide o ID token Firebase com Admin SDK;
   - use credenciais OAuth do professor armazenadas **no servidor** para consultar a API do Google Classroom;
   - confira a participação ativa na turma correta pelo `courseId` real (o código 2025.07.186 é rótulo, não o ID da API);
   - associe com segurança a conta Google autenticada à identidade no Classroom (sem confiar no e-mail ou turma enviados pelo navegador);
   - responda `{ "authorized": true }` somente após validação;
   - configure CORS apenas para a origem permitida e limites de requisição.
4. Preencher `authorizationEndpoint` com a URL HTTPS do backend.
5. Testar contas de aluno autorizado, aluno de outra turma e usuário não autenticado.

**Importante:** GitHub Pages é hospedagem estática. Mesmo após o login funcionar, os arquivos HTML públicos continuam acessíveis diretamente por URL. Para restringir de verdade aulas, atividades ou dados, será necessário hospedar o conteúdo protegido atrás de um backend que valide autorização em cada requisição, ou migrar para infraestrutura com proteção de rotas. Não considere a autenticação da interface uma proteção dos arquivos.

**Segurança:** não incluir no GitHub segredos OAuth, refresh tokens, chave de conta de serviço, lista privada de estudantes nem credenciais do professor.
