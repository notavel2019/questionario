# Continuidade do projeto — apoio a empresários (Reforma Tributária)

Preparado em 2026-11-17 para retomada em 2026-11-18.

## Objetivo (a confirmar amanhã)

Hipótese de trabalho: construir, no app Next.js deste repositório, uma ferramenta que ajude
empresários a entender/simular o impacto da Reforma Tributária do Consumo (CBS/IBS/IS, LC 214/2025),
usando as APIs oficiais da Receita Federal. **O escopo exato ainda não foi definido** — ver "Perguntas abertas".

## Estado do repositório atual (`notavel2019/questionario`)

- Next.js 14 + Tailwind + shadcn/ui + Firebase App Hosting (`apphosting.yaml`), nome do pacote `nextn`.
- Hoje é o **"Notável Briefing"**: formulário de briefing de site que gera mensagem de WhatsApp
  (`src/components/briefing-form.tsx`, `src/app/actions.ts`). Ver `docs/blueprint.md`.
- Nada ainda integra com tributos. Branch de trabalho: `ccr-e9546b81-h0s5e3`.
- Observação: `package.json` usa `react`/`react-dom` em `latest` com `next ^14` — pode gerar
  incompatibilidade; fixar versões (React 18) antes de evoluir.

## Os três repositórios da Receita Federal (clonados em `/home/user/receitafederal/`, só leitura)

Os clones são do container e somem; recloná-los com
`git clone --depth 1 https://github.com/ReceitaFederal/<nome>`.

| Repo | Stack | O que faz | Porta/endpoint-chave |
|---|---|---|---|
| `calculadora-rtc-simples-nacional` (v0.0.6) | Java 21, Spring Boot 3.5, SQLite, Flyway | CBS/IBS para optantes do Simples Nacional (NFS-e, NF-e, NFC-e); atividades por anexo/data; modo offline | `:8082/api` — `POST /calculadora/observabilidade/simples-nacional`, `GET /calculadora/simples-nacional/atividades?data=AAAA-MM-DD`, `GET /versao`, Swagger em `/api/swagger-ui.html` |
| `calculadora-rtc-regime-regular` | Java 21, Spring Boot, Flyway | CBS, IBS e IS no regime geral; base de cálculo NF-e/NFS-e; gera/valida XML (XSD); dados abertos (CST, cClassTrib, NCM, NBS, alíquotas União/UF/município) | `:8080/api/calculadora` — `POST /regime-geral`, `POST /observabilidade/regime-geral`, `GET /dados-abertos/...`; exemplos em `docs/exemplos.md` |
| `calculadora-rtc-gerador-danfse` (1.0.0) | Go 1.27, Echo | Gera DANFSe (PDF) a partir do XML de uma NFS-e | `:8080` — `POST /api/danfse`, `GET /health/live`; env `SERVER_PORT`, `XML_MAX_SIZE_BYTES`, `LOG_LEVEL` |

Pontos do ROADMAP relevantes:
- Simples Nacional: **não substitui o PGDAS-D**; alíquota efetiva (RBT12) continua no PGDAS-D, integração prevista na Release 16.
  A calculadora só traz percentuais de IBS/CBS pré-carregados da 1ª faixa, por anexo e ano.
- DANFSe: concluído, sem novas funcionalidades previstas.
- Regime Regular: Release 16 e iniciativas de 2027 em planejamento (ver `ROADMAP.md` do repo).

Ambiente deste container: Java, Maven e Go **já instalados** (`java`, `mvn`, `go`), então dá para subir as três APIs localmente.

## Arquitetura sugerida (a validar)

```
Empresário → app Next.js (este repo) → Server Actions / route handlers (proxy)
                                         ├─ Simples Nacional API  (:8082)
                                         ├─ Regime Regular API    (:8080)
                                         └─ DANFSe service        (:8081)
```

- Chamar as APIs **só pelo servidor** (Server Actions), nunca do navegador.
- Rodar as APIs via Docker/JAR; decidir se hospeda junto (Cloud Run) ou usa as instâncias online da Receita.
- Um questionário curto (regime: Simples/Presumido/Real; atividade; NCM/NBS; UF/município; faturamento)
  decide qual API chamar e monta o payload.

## Próximos passos propostos para amanhã

1. Definir o escopo/público do produto (ver perguntas).
2. Subir localmente as 3 APIs e fazer uma chamada de exemplo em cada (`docs/exemplos.md` dos repos Java).
3. Criar um cliente tipado (zod) para cada API em `src/lib/rtc/` + variáveis de ambiente para URLs.
4. Protótipo do fluxo: questionário → cálculo → resultado em linguagem simples (CBS/IBS por item).
5. Opcional: geração de DANFSe para prestadores de serviço.
6. Limpar o app atual (renomear pacote, fixar versões de React, ajustar README e `blueprint.md`).

## Perguntas abertas

- Quem é o usuário final: empresário direto, ou contador/consultoria (white-label da Notável)?
- Foco: simulador de impacto/precificação, emissão de nota, ou diagnóstico (questionário)?
- Regimes prioritários: Simples Nacional, regime regular, ou ambos?
- Reaproveitar o briefing/WhatsApp atual como captação de leads ou substituir?
- Hospedagem das APIs (próprio vs. serviço da Receita) e política de dados (LGPD).
