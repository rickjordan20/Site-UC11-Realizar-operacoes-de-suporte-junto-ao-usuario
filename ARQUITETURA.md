# Arquitetura do portal UC11

## Objetivo e limites

Este documento descreve a estrutura atual e uma evolução conservadora, preservando as URLs e o comportamento publicado. As páginas atuais, o endpoint e os recursos carregados por elas não devem ser movidos como parte de uma reorganização de pastas.

O portal é um site estático, sem etapa de build. O GitHub Pages hospeda conteúdo estático; as páginas redirecionam para o domínio Vercel, onde também está disponível a API de autorização. A publicação Vercel deve usar a raiz do repositório como Root Directory.

## Estrutura atual

```text
/
├── .github/workflows/validate.yml   # Validação contínua
├── activities/README.md             # Orientações para futuras atividades
├── api/authorize.js                 # Rota pública Vercel: /api/authorize
├── assets/
│   ├── css/senac-institucional.css  # Estilo do shell compartilhado
│   └── js/storage-service.js        # Serviço compartilhado de localStorage
├── backend-vercel/
│   ├── api/authorize.js             # Implementação da autorização
│   ├── package.json                 # Execução isolada do backend
│   └── README.md                    # Implantação e segurança do backend
├── lessons/README.md                # Orientações para futuras aulas
├── scripts/check-links.mjs          # Verificação de links e fragmentos
├── *.html                           # 13 páginas atuais, todas na raiz
├── *.js                             # Scripts e módulos consumidos pelas páginas
├── *.css                            # Folhas de estilo consumidas pelas páginas
├── package.json                     # Scripts e dependências do projeto
├── README.md                        # Entrada e instruções do projeto
└── demais arquivos de configuração e documentação
```

As páginas atuais são `index.html`, `login.html`, `politica-de-privacidade.html`, `autoavaliacao-i1.html`, `aula-1.html` até `aula-6.html`, `aula-assincrona-1.html`, `aula-assincrona-2.html` e `atividade-aula-1.html`.

## Recursos compartilhados e localização

Nem todos os recursos compartilhados estão em `assets/`. Atualmente, `assets/` contém o CSS institucional e o serviço de armazenamento. Há arquivos compartilhados na raiz, referenciados diretamente pelas páginas:

| Arquivo | Uso e dependências | Recomendação |
|---|---|---|
| `style.css`, `lesson-colors.css` | Folhas de estilo referenciadas por páginas HTML | Manter na raiz enquanto as referências atuais dependerem desses caminhos. |
| `senac-institucional.js` | Shell comum, carregado por várias páginas; usa prefixos para as futuras pastas | Manter na raiz; uma futura migração exige atualizar as referências e testar as rotas aninhadas. |
| `glpi-manual-floating.js` | Ajuda flutuante compartilhada; busca `./index.html` relativamente à página | Manter na raiz; para páginas aninhadas, corrigir e testar o caminho de busca antes de adotá-las. |
| `access-guard.js` | Guard carregado em páginas de conteúdo; importa `./auth-config.js` | Manter ambos na raiz ou migrá-los em conjunto com os imports e referências HTML revisados. |
| `auth-config.js` | Configuração importada por `access-guard.js` e `auth.js` | Manter na raiz ou migrar junto com os consumidores. |
| `lesson-duration.js` | Script usado por páginas de aula; identifica dados pelo nome do arquivo da rota | Manter na raiz durante a compatibilidade das páginas atuais. |
| `script.js` | Catálogo, cronograma e mapas de páginas usado por `index.html` | Manter na raiz enquanto a página inicial o referenciar nesse caminho. |
| `assets/css/senac-institucional.css` | Estilo compartilhado do shell | Já está em `assets/`; não mover. |
| `assets/js/storage-service.js` | Acesso compartilhado ao armazenamento local | Já está em `assets/`; não mover. |
| `auth.js` | Fluxo da página de login e import de `auth-config.js` | É específico do login, mas seu caminho atual é consumido diretamente; manter na raiz por compatibilidade. |

Portanto, **nem todos os recursos compartilhados estão em `assets/`**. Mover os arquivos da raiz para `assets/` agora não é seguro: as páginas os requisitam pelos caminhos atuais, e os módulos têm imports relativos entre si. A migração pode ser planejada posteriormente como uma alteração coordenada, mas não deve ser executada sem atualizar referências, conferir os imports e validar todos os destinos nos dois hosts.

## Arquivos que devem permanecer na raiz

1. **Todas as 13 páginas HTML atuais.** Seus nomes formam as URLs públicas usadas pelo catálogo, pela navegação e por links já divulgados. Não mover nem renomear.
2. **Os CSS e JavaScript atualmente carregados por caminhos da raiz.** As páginas os referenciam diretamente; movê-los interromperia a carga até que todas as referências fossem adaptadas.
3. **`api/authorize.js`.** É a entrada convencional da função Vercel que publica `/api/authorize`. A implementação pode permanecer em `backend-vercel/api/authorize.js`, como hoje.
4. **`README.md`, `package.json`, arquivos de configuração e dependências do projeto.** São pontos de entrada, comandos ou configurações convencionais da raiz.

Os outros documentos Markdown também ficam onde estão. Movê-los não melhora o funcionamento do portal e exigiria corrigir links relativos em outros documentos. Não há migração documental de diretório justificada no momento; este arquivo centraliza a orientação arquitetural sem deslocar a documentação operacional existente.

## Estrutura recomendada

Preservar a raiz como diretório de publicação das páginas existentes e usar `assets/` para novos recursos compartilhados, sem realocar os atuais nesta etapa:

```text
/
├── .github/workflows/
├── activities/
│   ├── README.md
│   └── futuras atividades HTML
├── api/authorize.js
├── assets/
│   ├── css/
│   ├── images/                     # Quando necessário
│   └── js/
├── backend-vercel/
├── lessons/
│   ├── README.md
│   └── futuras aulas HTML
├── scripts/
├── páginas HTML atuais na raiz
├── recursos atuais da raiz, mantidos por compatibilidade
└── documentação e configurações na raiz
```

Não é necessário criar `src/`, `dist/` ou adicionar um framework/build para comportar as aulas planejadas. Uma mudança desse tipo alteraria a publicação sem benefício necessário para o escopo atual.

## Estratégia de expansão até a aula 17

- Manter `aula-1.html` a `aula-6.html` e todos os seus caminhos atuais.
- Criar as aulas 7–17 em `lessons/`, usando nomes estáveis como `aula-07.html` até `aula-17.html`; não renomear rotas antigas.
- Criar novas atividades em `activities/`, seguindo a convenção documentada em `activities/README.md`.
- Antes de publicar uma página aninhada, usar um template validado com referências aos recursos da raiz e de `assets/` via caminhos relativos apropriados (`../`), links de navegação, guard de acesso e shell institucional.
- Corrigir ou parametrizar qualquer URL que dependa da localização da página. Em particular, verificar o `fetch('./index.html')` de `glpi-manual-floating.js`, que, dentro de uma subpasta, aponta para `index.html` naquela subpasta.
- Registrar as novas páginas nos mapas `lessonFiles` ou `remoteFiles` em `script.js`; validar calendário, liberação, navegação e carregamento dos recursos.
- Executar `npm run test:ci` e testar as rotas no Vercel. Confirmar também o redirecionamento a partir do GitHub Pages, que remove o prefixo do repositório ao encaminhar a URL.
- Não mover páginas antigas para acomodar a expansão. Dezessete páginas na raiz continuam sendo uma opção válida se a criação de arquivos aninhados não justificar o custo de manter e testar prefixos de caminho.

## Compatibilidade e política de movimentação

- **GitHub Pages:** entrega arquivos estáticos e usa um prefixo de repositório nas URLs de projeto. Evitar caminhos iniciados em `/` para recursos, pois podem ignorar esse prefixo. As páginas atuais redirecionam para o Vercel; preservar nomes e regra de redirecionamento.
- **Vercel:** manter a raiz do repositório como Root Directory para hospedar as páginas e descobrir `api/authorize.js`. Preservar a rota `/api/authorize` e suas dependências.
- **Google Classroom e autenticação:** manter `auth-config.js`, `access-guard.js`, `auth.js` e o endpoint configurado em sincronia. A validação de matrícula e a navegação ao login dependem desse fluxo.
- **Links já publicados:** manter cada HTML atual no mesmo caminho, inclusive nomes usados no catálogo e em links diretos.
- **Arquivos que podem ser movidos sem risco operacional:** nenhum arquivo executável ou recurso estático foi identificado como seguramente relocável sem alterar caminhos ou referências. Documentos Markdown poderiam ser movidos apenas com atualização de links; como não há benefício operacional, também permanecerão onde estão.

Qualquer migração futura de CSS ou JavaScript deve ser tratada como uma mudança única: inventariar todas as referências, atualizar HTML e imports, manter compatibilidade de rotas e executar as validações e testes de navegação antes da publicação. Esta recomendação não autoriza a movimentação nesta etapa.
