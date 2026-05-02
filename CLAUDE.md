# Plugin Grafana — [Nome do Seu Plugin]

## O que é este projeto

Plugin do tipo panel para o Grafana.
Objetivo: [descreva em 1-2 frases o que o plugin faz]
ID do plugin: matheusdomingosjlcp-zabbixproblemspro-panel
Versão do Grafana alvo: 10.0+

## Ambiente de desenvolvimento- OS: Windows 11 com WSL 2 (Ubuntu)- Todos os comandos devem ser executados no terminal WSL (Ubuntu)- VS Code conectado ao WSL ("WSL: Ubuntu" no canto inferior esquerdo)

## Stack- Frontend: TypeScript + React- Pacotes principais: @grafana/ui, @grafana/runtime, @grafana/data- Backend: Go (Grafana Plugin SDK for Go)- Build frontend: Webpack (via npm scripts)- Build backend: Mage- Ambiente dev: Docker (docker compose)- Grafana: acessível em http://localhost:3000

## Estrutura de pastas

src/ → Frontend (TypeScript/React)
module.ts → Entry point do frontend
plugin.json → Metadados e ID do plugin
components/ → Componentes React
types.ts → Tipos TypeScript
pkg/ → Backend (Go)
main.go → Entry point do backend
plugin/ → Lógica principal do backend
dist/ → Build gerado (não editar manualmente)
docker-compose.yaml → Configuração do Grafana de desenvolvimento

## Comandos do projeto- `npm install` → instalar dependências frontend

- `npm run dev` → build frontend em modo watch (manter rodando)- `npm run build` → build frontend para produção- `npm run test` → testes unitários- `npm run lint` → verificar problemas de código TypeScript- `mage -v build:linux` → compilar backend Go (rodar após cada mudança em .go)- `docker compose up` → subir Grafana de desenvolvimento

## Regras importantes- NUNCA editar arquivos em `dist/` diretamente- SEMPRE rodar `mage -v build:linux` após alterar arquivos `.go`- SEMPRE reiniciar `docker compose up` após alterar o `plugin.json`- Usar componentes do `@grafana/ui` para manter visual consistente com o Grafana- Frontend e backend se comunicam via HTTP — endpoints ficam em `pkg/plugin/`

## Convenções- Idioma do código: inglês- Comentários: português- Commits: português, formato convencional (feat:, fix:, chore:, docs:)- Componentes React: PascalCase- Funções e variáveis: camelCase- Arquivos: kebab-case
