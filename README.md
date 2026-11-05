# UC11 — Central de Suporte ao Usuário

Portal educacional da turma **2025.07.186 — Técnico em Desenvolvimento de Sistemas (Senac-DF)**, para a unidade curricular **UC11 — Realizar operações de suporte junto ao usuário**.

## Acesso e publicação

- **Endereço oficial:** https://uc11-classroom-auth.vercel.app/
- **Repositório:** https://github.com/rickjordan20/Site-UC11-Realizar-operacoes-de-suporte-junto-ao-usuario
- **Branch de publicação:** `master`
- **GitHub Pages:** as páginas redirecionam para o domínio oficial do Vercel para manter o acesso ao endpoint da API e aos recursos do site.

O Vercel deve publicar a **raiz do repositório**: as páginas estáticas ficam na raiz, e `api/authorize.js` expõe a função em `/api/authorize`, reutilizando a implementação em `backend-vercel/api/authorize.js`.

### Configuração de autorização

1. Habilite Google Authentication no projeto Firebase identificado em `auth-config.js`.
2. No Vercel, configure `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` e `GOOGLE_REFRESH_TOKEN` como variáveis privadas. A conta Google associada deve ter acesso à lista de estudantes do Classroom e autorizar o escopo `https://www.googleapis.com/auth/classroom.rosters.readonly`.
3. O endpoint do frontend está definido em `auth-config.js` como `https://uc11-classroom-auth.vercel.app/api/authorize`. Se o domínio de produção mudar, atualize-o junto com a lista de origens.
4. `APP_ORIGINS` aceita uma lista de origens separadas por vírgula. Sem configuração, o backend aceita o domínio oficial e o domínio atual do GitHub Pages. CORS limita chamadas de navegador, mas não substitui autenticação.
5. `CLASSROOM_COURSE_ID` é opcional; por padrão, o backend usa o mesmo ID do Classroom declarado no frontend.
6. Teste conta matriculada, conta não matriculada, token inválido e indisponibilidade das credenciais antes de divulgar a plataforma.

O guard no navegador melhora o fluxo normal de navegação, mas os arquivos HTML publicados são estáticos e podem ser acessados diretamente por URL. **Não trate as páginas como conteúdo privado.** Para confidencialidade real, hospede o conteúdo atrás de autorização por requisição.

## Conteúdo atual

O portal reúne calendário, indicadores, aulas, atividades assíncronas, autoavaliação e orientações para o GLPI. As práticas usam os projetos **TechEduca** (guiadas pelo instrutor) e **Café Central** (autônomas). As atividades armazenam progresso no navegador e permitem exportação local; a exportação não envia respostas ao instrutor nem ao Classroom.

### Aulas presenciais existentes

| Aula | Data | Tema | Indicador | Página |
|---|---|---|---|---|
| 1 | 21/10/2026 | Introdução ao Suporte Técnico e à Central de Serviços | I1 | `aula-1.html` |
| 2 | 22/10/2026 | Identificação das Necessidades e Perfis dos Usuários | I1 | `aula-2.html` |
| 3 | 26/10/2026 | Tipos de Chamados | I1 | `aula-3.html` |
| 4 | 27/10/2026 | Registro, Categorização e Diagnóstico Inicial | I1 | `aula-4.html` |
| 5 | 29/10/2026 | Comunicação Profissional e Atendimento Humanizado | I2 | `aula-5.html` |
| 6 | 03/11/2026 | Canais de Atendimento | I1 · I2 | `aula-6.html` |

As aulas 7–17 estão planejadas, mas ainda não têm páginas. As atividades assíncronas 1 e 2 existem; 3 e 4 estão planejadas.

### Liberação de conteúdo

O catálogo em `script.js` contém cronograma e horários de liberação no fuso `America/Sao_Paulo`, às **14h**. `lessonFiles` e `remoteFiles` relacionam aulas e atividades existentes aos seus caminhos. A liberação por data é apenas uma regra de interface, não um controle de segurança.

## Estrutura

```text
/
├── api/                         # Rota Vercel /api/authorize
├── assets/
│   ├── css/senac-institucional.css
│   └── js/storage-service.js
├── activities/                  # Orientações para futuras atividades
├── lessons/                     # Orientações para futuras aulas
├── backend-vercel/api/          # Implementação da autorização
├── scripts/check-links.mjs      # Verificador de links e fragmentos locais
├── .github/workflows/validate.yml
├── index.html                   # Catálogo e página inicial
├── script.js                    # Calendário, aulas e atividades
├── style.css                    # Estilos compartilhados da plataforma
└── *.html                       # Páginas publicadas (URLs preservadas)
```

As páginas atuais permanecem na raiz para preservar links já divulgados. Para cadastrar novas páginas, siga [`lessons/README.md`](./lessons/README.md) e [`activities/README.md`](./activities/README.md).

## Desenvolvimento e validação

Requer Node.js 22.22 ou superior:

```sh
npm ci
npm run validate:html
npm run lint
npm run check:links
```

O workflow `Validate site` executa essas três verificações em cada push e pull request. `npm run test:ci` executa localmente a mesma sequência.

## Privacidade e dados locais

`assets/js/storage-service.js` centraliza acesso ao `localStorage`. A indisponibilidade do armazenamento é informada na própria página; a plataforma não envia respostas didáticas automaticamente ao professor. Consulte [`politica-de-privacidade.html`](./politica-de-privacidade.html).

## Arquivos de referência

- [`ARQUITETURA.md`](./ARQUITETURA.md) — estrutura atual, compatibilidade e expansão segura para futuras aulas.
- [`AUDITORIA-TECNICA.md`](./AUDITORIA-TECNICA.md) — diagnóstico técnico anterior às melhorias desta implementação.
- [`LOGIN-SETUP.md`](./LOGIN-SETUP.md) — histórico e configuração do login.
- [`backend-vercel/README.md`](./backend-vercel/README.md) — implantação e segurança do serviço de autorização.
