# Eleven Studio · site

Site de página única da Eleven Studio (social media e design em Betim, MG).
HTML, CSS e JavaScript puro, sem build.

## Arquivos

- `index.html`: conteúdo da página
- `style.css`: visual
- `script.js`: animações leves, header e botão flutuante
- `assets/`: fontes, favicon, imagem de prévia (`og-image.jpg`) e `portfolio/`
- `render.yaml`: configuração de publicação no Render

## Ver no computador

```bash
python3 -m http.server 8000
```

Abra http://localhost:8000 no navegador.

## O que falta preencher

Procure por `TODO` no `index.html`: preços dos pacotes, Instagram, fotos do portfólio,
sua foto e o endereço final do site (para a prévia do WhatsApp).

## Publicar uma alteração

```bash
git add .
git commit -m "Descreva a mudança"
git push
```

O Render atualiza o site sozinho em 1 ou 2 minutos.
Se mudou `style.css` ou `script.js`, aumente o número em `?v=` no `index.html`.
