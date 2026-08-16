# ── Etapa de build ────────────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Copia só os manifestos primeiro: enquanto as dependências não mudarem,
# o Docker reaproveita a camada do npm ci e o build fica bem mais rápido.
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration=production

# ── Etapa de produção ─────────────────────────────────────────────────
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# O builder "application" do Angular 19 separa a saída do browser em um
# subdiretório: dist/<projeto>/browser. Copiar dist/unihack-frontend
# direto serviria a pasta errada e daria 404 em tudo.
COPY --from=build /app/dist/unihack-frontend/browser /usr/share/nginx/html

EXPOSE 80
