# UC11 — Backend de matrícula (Vercel, plano Hobby)
Backend separado do site GitHub Pages; Firebase permanece no Spark.

## Implantação
1. Crie projeto Vercel com **Root Directory** `backend-vercel` (ou publique somente essa pasta).
2. Configure as variáveis **criptografadas** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN` no projeto Vercel.
3. A conta que emitiu o refresh token deve ser a do professor com acesso à turma **689889762928**, autorizando o escopo `https://www.googleapis.com/auth/classroom.rosters.readonly`. O cliente OAuth para essa autorização deve ter redirecionamento compatível com o fluxo utilizado. Não use o cliente Firebase automaticamente criado sem compreender o fluxo.
4. Use a URL HTTPS pública da função, terminando em `/api/authorize`, em `auth-config.js` como `authorizationEndpoint` **somente depois de testar**.
5. Teste: estudante matriculado → true; conta Google fora da turma → false; token inválido → 401; falta de credenciais → 503. Verifique os limites atuais do plano Hobby.

## Segurança
- O token Firebase é validado no servidor e a identidade Google vem do provedor autenticado, não do corpo enviado pelo navegador.
- Consulta apenas leitura da lista de estudantes; sem divulgar o cadastro completo.
- Segredos nunca devem ir ao GitHub ou ao frontend.
- A origem autorizada por CORS não substitui a autenticação por token.
- A autorização protege as APIs e o fluxo normal da interface; **não torna privados os arquivos estáticos publicados no GitHub Pages**.
- O Firebase Spark não é alterado.
