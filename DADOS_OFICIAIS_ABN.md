# Dados Oficiais da ABN - Inventário para Actualização

Este documento lista todos os dados oficiais da ABN que precisam de ser fornecidos pela organização para completar o projecto com informação real e precisa.

---

## 1. Google Analytics e Search Console

**Estado Actual:** 
- Google Analytics: Placeholder (`G-XXXXXXXXXX`)
- Google Search Console: ✅ Verificado

**Localização:** `src/app/layout.tsx` (linhas 98-109)

```typescript
// ACTUAL
<meta name="google-site-verification" content="mvgmWQRkmaikckgseUhfIFk2WRR7AUDrUyiBbOTdgok" />
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
    // Nota: Substituir G-XXXXXXXXXX pelo ID real do Google Analytics
  `}
</Script>
```

**Necessário:**
- [x] Google Search Console Verification (✅ Concluído)
- [ ] Google Analytics ID real (formato: `G-XXXXXXXXXX` ou `UA-XXXXXXXXX-X`)
- [ ] Confirmar se deve ser Google Analytics 4 (GA4) ou Universal Analytics

---

## 2. Representantes Nacionais (Delegações)

**Estado Actual:** Apenas representante de exemplo para Guiné-Bissau
**Localização:** `src/lib/seed.ts` (linhas 368-373)

**Representante existente (exemplo):**
- Guiné-Bissau: Mamadu Baldé (Diretor de Delegação - ABN Guiné-Bissau)

**Necessário para os 5 países:**

### Moçambique (Sede)
- [ ] Nome do Representante Nacional
- [ ] Cargo/Função
- [ ] Email oficial
- [ ] Telefone
- [ ] Fotografia

### Angola
- [ ] Nome do Representante Nacional
- [ ] Cargo/Função
- [ ] Email oficial
- [ ] Telefone
- [ ] Fotografia

### Guiné-Bissau
- [ ] Nome do Representante Nacional (actualmente: Mamadu Baldé - confirmar se é real)
- [ ] Cargo/Função
- [ ] Email oficial
- [ ] Telefone
- [ ] Fotografia

### São Tomé e Príncipe
- [ ] Nome do Representante Nacional
- [ ] Cargo/Função
- [ ] Email oficial
- [ ] Telefone
- [ ] Fotografia

### Cabo Verde
- [ ] Nome do Representante Nacional
- [ ] Cargo/Função
- [ ] Email oficial
- [ ] Telefone
- [ ] Fotografia

---

## 3. Parceiros Oficiais

**Estado Actual:** Dados de exemplo nos hubs
**Localização:** `src/lib/seed.ts` (linhas 379-383)

**Parceiros de exemplo (Guiné-Bissau):**
- Startup Bissau
- Banco da Guiné
- Mentores GB

**Necessário:**
- [ ] Lista oficial de parceiros por país
- [ ] Logótipos dos parceiros (ficheiros de imagem)
- [ ] URLs dos sites dos parceiros
- [ ] Descrição breve da parceria

---

## 4. Equipa/Mentores Reais

**Estado Actual:** Dados de exemplo no seed.ts
**Localização:** `src/lib/seed.ts` (linhas 239-240)

**Mentores de exemplo:**
- João Silva (empreendedor)
- Maria Santos (startup)

**Necessário:**
- [ ] Lista oficial de mentores/especialistas
- [ ] Nomes reais completos
- [ ] Cargos/Especialidades
- [ ] Fotos profissionais
- [ ] Biografias curtas
- [ ] Contactos (email, LinkedIn)

---

## 5. Dados de Empresas/Startups Apoiadas

**Estado Actual:** Dados de exemplo
**Localização:** `src/lib/seed.ts`

**Necessário:**
- [ ] Lista de empresas/startups realmente apoiadas pela ABN
- [ ] Nomes oficiais
- [ ] Logótipos
- [ ] Descrições
- [ ] Sector de actividade
- [ ] País
- [ ] Ano de entrada no programa

---

## 6. Indicadores de Impacto Reais

**Estado Actual:** Indicadores genéricos no homepage
**Localização:** `src/app/page.tsx`

**Necessário:**
- [ ] Número real de startups apoiadas
- [ ] Número real de mentorias realizadas
- [ ] Número real de parceiros
- [ ] Número real de eventos realizados
- [ ] Número real de países com representação (confirmar se são 5)
- [ ] Valor de investimento captado (se aplicável)
- [ ] Número de empregos criados

---

## 7. Eventos Realizados

**Estado Actual:** Dados de exemplo
**Localização:** `src/lib/seed.ts`

**Necessário:**
- [ ] Lista de eventos realmente realizados
- [ ] Títulos oficiais
- [ ] Datas
- [ ] Localizações
- [ ] Número de participantes
- [ ] Fotos dos eventos
- [ ] Oradores reais

---

## 8. Programas Actuais

**Estado Actual:** Dados de exemplo
**Localização:** `src/lib/seed.ts`

**Necessário:**
- [ ] Lista de programas actualmente activos
- [ ] Nomes oficiais
- [ ] Descrições detalhadas
- [ ] Critérios de admissão por país
- [ ] Custos reais (ou confirmação de que são gratuitos)
- [ ] Patrocinadores reais (com logótipos)
- [ ] Mentores reais associados a cada programa
- [ ] Calendários reais

---

## 9. Contactos Oficiais

**Estado Actual:** Email oficial `info@afrobiznetwork.com`
**Localização:** 
- `src/lib/seed.ts` (super admin)
- `src/app/contacto/page.tsx` (página de contacto)

**Confirmado:**
- [x] Email oficial: `info@afrobiznetwork.com`

**Necessário:**
- [ ] Telefone oficial (se existir)
- [ ] Endereço físico da sede
- [ ] Outros emails departamentais (se aplicável)

---

## 10. Redes Sociais Oficiais

**Estado Actual:** Twitter handle placeholder `@afrobiznetwork`
**Localização:** `src/app/layout.tsx` (linha 71)

**Necessário:**
- [ ] Confirmar Twitter/X handle: `@afrobiznetwork`
- [ ] LinkedIn URL oficial
- [ ] Instagram URL oficial
- [ ] Facebook URL oficial (se aplicável)
- [ ] YouTube URL oficial (se aplicável)

---

## 11. Logótipos e Imagens

**Estado Actual:** Alguns logótipos placeholder
**Localização:** `/public/` e referências no código

**Necessário:**
- [ ] Logótipo oficial ABN (versão PNG e SVG)
- [ ] Logótipos dos parceiros
- [ ] Fotos dos representantes
- [ ] Fotos dos mentores
- [ ] Fotos dos eventos
- [ ] Banner principal (hero image)

---

## 12. Termos e Condições da Loja

**Estado Actual:** Texto genérico criado
**Localização:** `src/app/loja/termos/page.tsx`

**Necessário:**
- [ ] Revisão legal dos Termos e Condições da Loja
- [ ] Confirmar se o texto actual está correcto
- [ ] Adicionar cláusulas específicas se necessário

---

## Prioridade de Actualização

### Alta Prioridade (Para funcionamento básico)
1. ~~Google Analytics ID~~
2. ~~Email oficial confirmado~~ ✅
3. Representantes nacionais (pelo menos nome e email)
4. Twitter handle confirmado

### Média Prioridade (Para credibilidade)
5. Parceiros oficiais
6. Mentores reais
7. Indicadores de impacto reais
8. Eventos realizados

### Baixa Prioridade (Para enriquecimento)
9. Programas actuais detalhados
10. Startups apoiadas
11. Fotos e logótipos adicionais

---

## Notas

- Todos os dados fornecidos devem ser oficiais e verificados pela ABN
- As imagens devem ter boa qualidade e optimizadas para web
- Os textos devem estar em português correcto e profissional
- Recomenda-se a revisão por departamento jurídico para termos e condições

---

**Documento gerado em:** 27 de Setembro de 2026
**Versão:** 1.0
