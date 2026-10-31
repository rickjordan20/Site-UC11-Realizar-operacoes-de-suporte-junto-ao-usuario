# UC11 — Central de Suporte ao Usuário

Site educacional da turma **2025.07.186 — Técnico em Desenvolvimento de Sistemas (Senac-DF)**, para a unidade curricular **UC11 — Realizar operações de suporte junto ao usuário**.

## Acesso

- **Site oficial:** https://uc11-classroom-auth.vercel.app/
- **Repositório:** https://github.com/rickjordan20/Site-UC11-Realizar-operacoes-de-suporte-junto-ao-usuario
- **Branch de publicação:** `master`
- **GitHub Pages:** há um redirecionamento no `index.html` para o domínio oficial do Vercel. Utilizar o endereço oficial para divulgar as aulas.

## Organização didática

O site reúne calendário, indicadores, aulas presenciais, atividades assíncronas, autoavaliação e orientações para o uso do GLPI. As práticas usam os projetos **TechEduca** (guiadas pelo instrutor) e **Café Central** (autônomas).

As aulas presenciais têm duração prevista de quatro horas. O catálogo de aulas é montado em `script.js`, a partir da lista `aulas`. A liberação por data usa o fuso `America/Sao_Paulo`, às **14h**, e a variável `ready` controla se o cartão aponta para uma página publicada.

## Aulas publicadas no catálogo

| Aula | Data | Tema | Indicador | Página |
| --- | --- | --- | --- | --- |
| 1 | 21/10/2026 | Introdução ao Suporte Técnico e à Central de Serviços | I1 | `aula-1.html` |
| 2 | 22/10/2026 | Identificação das Necessidades e Perfis dos Usuários | I1 | `aula-2.html` |
| 3 | 26/10/2026 | Tipos de Chamados | I1 | `aula-3.html` |
| 4 | 27/10/2026 | Registro, Categorização e Diagnóstico Inicial | I1 | `aula-4.html` |
| **5** | **29/10/2026** | **Comunicação Profissional e Atendimento Humanizado** | **I2** | **`aula-5.html`** |

As aulas seguintes permanecem no cronograma, mas não são consideradas publicadas automaticamente.

### Aula 5 — Comunicação Profissional e Atendimento Humanizado

- **Carga horária:** 4 horas; **indicador:** I2.
- **Teoria contextualizada (45 min):** dez slides interativos sobre comunicação profissional, clareza, empatia, escuta ativa e adequação da linguagem.
- **Prática guiada — TechEduca (75 min):** análise e reescrita de mensagens de atendimento.
- **Prática autônoma — Café Central (90 min):** simulações de atendimento e elaboração de respostas profissionais.
- **Fechamento (30 min):** síntese e reflexão sobre o atendimento humanizado.
- **Identificação:** o estudante informa seu nome antes das atividades.
- **Avaliação:** a página orienta que as atividades práticas sejam avaliadas pelo instrutor, sem atribuição automática de nota ou menção.
- **GLPI:** utilização opcional, conforme confirmação de disponibilidade pelo instrutor.

**Publicação corrigida:** o arquivo `aula-5.html` já existia, mas o catálogo em `script.js` limitava `ready` às aulas de índice 0 a 3. A alteração do commit `b5deea6529f4690a722f5fa8df413ec5e281a0d0` ampliou a liberação para o índice 4 e adicionou `aula-5.html` à lista de destinos. Assim, após a data de liberação, o cartão da Aula 5 passa a exibir o link de acesso em vez da mensagem de conteúdo em preparação.

## Principais arquivos

| Arquivo | Finalidade |
| --- | --- |
| `index.html` | Página inicial, calendário, catálogo e orientações |
| `script.js` | Dados do cronograma, renderização dos cartões e lógica de liberação |
| `style.css` | Estilos compartilhados |
| `aula-1.html` a `aula-5.html` | Conteúdo das aulas publicadas |
| `access-guard.js` | Script de controle de acesso carregado na página inicial |
| `glpi-manual-floating.js` | Acesso ao manual flutuante do GLPI |
| `senac-institucional.js` | Identidade visual institucional |

## Procedimento para publicar uma próxima aula

1. Criar e revisar a página `aula-N.html` com conteúdo e atividades completos.
2. Conferir o registro da aula e sua data no array `aulas` de `script.js`.
3. Adicionar a página ao mapeamento de links do catálogo e atualizar a condição `ready` para a aula correspondente. **Não liberar aulas futuras sem o conteúdo pronto.**
4. Testar navegação, identificação, interações, responsividade e geração de evidências.
5. Publicar na branch `master`, acompanhar a implantação do Vercel e verificar o endereço oficial.
6. Atualizar esta documentação.

> **Atenção:** o bloqueio de data em JavaScript é visual e não substitui controle de autorização no servidor. A implantação em produção deve ser verificada separadamente do commit no GitHub.

## Histórico

- **31/10/2026 — Documentação inicial:** registro do funcionamento do site, das cinco aulas publicadas e da correção de acesso à Aula 5.
