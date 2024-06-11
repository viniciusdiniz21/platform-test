# Documentação da API
Esta documentação fornece uma visão geral da API REST construída usando Flask, SQLAlchemy e JWT para autenticação. A API permite que os usuários registrem-se, façam login e gerenciem posições com coordenadas de latitude e longitude.

Modelos
## Usuario
Atributos:

id: Integer, Chave Primária
username: String, Único, Não Nulo
password_hash: String, Não Nulo
Métodos:

set_password(self, password): Define a senha criptografada.
check_password(self, password): Verifica a senha criptografada.

## Position
Atributos:
id: Integer, Chave Primária
date_time: DateTime, Pode ser Nulo
latitude: String, Não Nulo
longitude: String, Não Nulo

## Informações Adicionais
Configuração do Banco de Dados: A URL do banco de dados é configurada usando variáveis de ambiente.
CORS: Cross-Origin Resource Sharing (CORS) está habilitado.
Autenticação JWT: JWT é usado para proteger certos endpoints, com tokens expirando após 1 dia.
Inicialização
Para inicializar o banco de dados e importar dados se necessário, a aplicação verifica se há uma entrada existente na tabela Position e importa dados de um arquivo JSON localizado em ../positions.json se a tabela estiver vazia.

## Executando a Aplicação
Para executar a aplicação, execute o seguinte comando (Certifique-se de ter python instalado em sua máquina):
pip install -r requirements.txt
python app.py

## Container Front-end
Para gerar o container da aplicação frontend basta utilizar o seguinte comando:
docker compose build
docker-compose up

## URL Base
# http://localhost:5000

## Endpoints
Endpoints de Autenticação
# Registrar um novo usuário

URL: /register
Método: POST
Descrição: Registra um novo usuário no sistema.
## Corpo da requisição
{
  "username": "string",
  "password": "string"
}

Resposta: 
## 201 Created
{
  "message": "Usuário registrado com sucesso!"
}

## 400 Bad Request
{
  "message": "Usuário já existe!"
}

URL: /login
Método: POST
Descrição: Autentica um usuário e retorna um token JWT.
## Corpo da requisição
{
  "username": "string",
  "password": "string"
}
Resposta: 
## 200 Ok
{
  "access_token": "jwt-token"
}

## 401 Unauthorized
{
  "message": "Credenciais inválidas."
}

## Endpoints de Posição
Obter todas as posições (com JWT)

URL: /positions
Método: GET
Descrição: Recupera todas as posições. Requer autenticação JWT.
## 200 Ok
[
  {
    "id": "integer",
    "date_time": "YYYY-MM-DD HH:MM:SS",
    "latitude": "string",
    "longitude": "string"
  },
  ...
]

## 404 Not Found
{
  "message": "Nenhuma posição encontrada."
}

Criar uma nova posição

URL: /position
Método: POST
Descrição: Cria uma nova posição com a data e hora atual.
## Corpo da Requisição
{
  "latitude": "string",
  "longitude": "string"
}

Resposta
## 201 Created
{
  "message": "Posição adicionada!"
}

# Documentação do front-end

## Executando a Aplicação
Para executar a aplicação front-end, use o terminal para ir até a pasta frontend e utilize os seguintes comandos (certifique-se de ter node instalado)
npm install
npm run dev

## Container Front-end
Para gerar o container da aplicação frontend basta utilizar o seguinte comando:
npm run docker-build
Para rodar o container utilize:
npm run docker-run


