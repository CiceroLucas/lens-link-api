<p align="center">
  <a href="" target="blank"><img src="https://zavxbzloccalzprhjzkt.supabase.co/storage/v1/object/public/lenslink/lens-link-logo.png" width="200" alt="Nest Logo" /></a>
</p>




## Descrição

Esta API é destinada a uma rede social de fotos, permitindo que os usuários façam upload, compartilhem e interajam com fotos. A API oferece recursos para gerenciar usuários, postagens e interações entre usuários.

## Recursos Principais

* Autenticação de Usuários: Suporte para registro, login e gerenciamento de contas de usuário.
* Postagens de Fotos: Funcionalidades para criar, visualizar, editar e excluir postagens de fotos.
* Feed de Usuários: Capacidade de visualizar o feed de postagens de todos os usuários.
* Interações Sociais: Curtir e comentar postagens de outros usuários.
* Pesquisa de Usuários: Recursos para pesquisar usuários por nome.

## Tecnologias Utilizadas

* NestJS: Framework Node.js para desenvolvimento de API com TypeScript.
* TypeORM: ORM para interagir com o banco de dados PostgreSQL.
* Supabase: Plataforma de backend como serviço para o armazenamento de imagens.

## Estrutura do Projeto

* Controllers: Responsáveis por definir os endpoints da API e chamar os serviços apropriados.
* Services: Lógica de negócios da aplicação, responsável por interagir com o banco de dados e executar operações específicas.
* Entidades: Definição das entidades de banco de dados usando TypeORM, como Usuário e Postagem.
* Middlewares: Funcionalidades intermediárias, como autenticação de usuários e manipulação de erros.
* Configuração: Arquivos de configuração para o ambiente de desenvolvimento, teste e produção.

## Instalação

```bash
$ npm install
```

## Rodando o app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
