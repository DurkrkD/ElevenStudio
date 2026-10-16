# Eleven Studio · site

Site da Eleven Studio (social media e design, Betim/MG, atendimento para todo o Brasil).
HTML, CSS e JavaScript puro, sem build. No ar em https://eleven-studio-bes1.onrender.com

## Editar o conteúdo: painel

Abra https://eleven-studio-bes1.onrender.com/admin/ e entre com **Entrar Usando Token de Acesso**.

No painel você edita: depoimentos, portfólio, pacotes e preços, serviços, abertura da
página inicial, página Sobre (foto, texto e valores) e contato (WhatsApp e Instagram).

Cada "Salvar" vira um commit no GitHub e o Render atualiza o site sozinho em 1 ou 2 minutos.

- Depoimentos: a seção só aparece na página inicial quando houver pelo menos 1.
- Portfólio: o link "Portfólio" do menu só aparece quando houver pelo menos 1 trabalho.
- Imagens enviadas pelo painel são convertidas para WebP e reduzidas automaticamente
  (ficam em `assets/uploads/`).

### Token do GitHub (uma vez só)

GitHub → foto do perfil → Settings → Developer settings → Personal access tokens →
Fine-grained tokens → Generate new token:

- Repository access: Only select repositories → `DurkrkD/ElevenStudio`
- Permissions → Repository permissions → Contents: **Read and write**
- Gere, copie e cole no painel. O token fica salvo só no navegador onde você entrou.

Não compartilhe o token: quem tiver ele consegue alterar o site.

## Arquivos

- `index.html`, `servicos.html`, `precos.html`, `portfolio.html`, `sobre.html`: páginas
- `content/*.json`: conteúdo editado pelo painel (o site lê daqui)
- `admin/`: painel de edição (Sveltia CMS); os formulários estão em `admin/config.yml`
- `style.css`: visual de todas as páginas
- `script.js`: menu mobile, header, animações, filtro do portfólio e aplicação do conteúdo
- `assets/`: fontes, ícones, imagem de prévia (`og-image.jpg`) e `uploads/` (imagens do painel)
- `render.yaml`: configuração do Render

O texto escrito dentro dos `.html` é uma cópia de segurança. O que vale é o que está
salvo no painel.

## Mexer no código pelo computador

Como o painel salva direto no GitHub, **sempre comece com `git pull`** para baixar
o que foi editado pelo painel:

```bash
git pull
python3 -m http.server 8000
```

Abra http://localhost:8000. Para publicar:

```bash
git add -A
git commit -m "Descreva a mudança"
git push
```

Se mudou `style.css` ou `script.js`, aumente o número em `?v=` em todas as páginas.
