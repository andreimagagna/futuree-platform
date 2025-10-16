#!/bin/bash

# Script para deploy da API opcional
# Execute: chmod +x deploy-api.sh && ./deploy-api.sh

echo "🚀 Deploy da API Futuree Solutions"
echo "=================================="

# Verificar se tem Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale o Node.js primeiro."
    exit 1
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install express cors

# Copiar arquivo de configuração se não existir
if [ ! -f .env ]; then
    echo "⚙️  Copiando configuração de exemplo..."
    cp .env.api.example .env
    echo "✏️  Edite o arquivo .env com suas configurações!"
fi

# Testar se a API funciona
echo "🧪 Testando API..."
node exemplo-api-rest.js &
API_PID=$!

sleep 3

if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ API funcionando!"
    echo "🌐 Acesse: http://localhost:3001/health"
else
    echo "❌ Erro na API"
fi

kill $API_PID 2>/dev/null

echo ""
echo "📋 Próximos passos:"
echo "1. Configure o .env com suas chaves"
echo "2. Execute: npm run dev"
echo "3. Configure o subdomínio se necessário"
echo "4. Atualize VITE_API_URL no frontend"