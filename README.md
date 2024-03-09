# Gestão (Backoffice)
The Gestão app has been designed to streamline the back office team's work within the company, enabling efficient registration of new clients and users on the main platform, regardless of its nature. The system provides comprehensive functionalities, allowing for the updating, deletion, and addition of records, offering complete and effective management of registered users.

## :white_check_mark: Requirements ##

- [Node](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/lang/en/)
- [Docker](https://docs.docker.com/compose/)

## 💻 How to run the application

```bash
# Run the git clone command to clone the repository
$ git clone git@github.com:GabriellCastro/Backoffice_backend.git

# Enter the cloned repository folder
$ cd Backoffice_backend

# Run yarn to install dependencies
$ yarn

# At the root of the project (Backoffice_backend)
# Change the name from .env.example to .env

# Run docker in the root of the project (Backoffice_backend)
$ sudo docker compose up -d

# Run prism migrate on the root of the project (Backoffice_backend)
$ yarn prisma migrate dev

# run the seed and generate an ADM accoun (see the log in the terminal)
$ yarn seed

# To start the application
$ yarn dev

```

Okay, now you can access the application from the route: <a href="https://localhost:3001/docs">https://localhost:3001/docs</a>

## :rocket: Technologies ##

The following technologies were used in the project:

- [NestJs](https://docs.nestjs.com/)
- [JWT](https://jwt.io)
- [Postgres](https://www.postgresql.org/)
- [PrismaORM](https://www.prisma.io/)
- [Swagger](https://swagger.io)


## Autor

Made by Gabriel Castro 👋🏽 Get in touch!

[![Linkedin Badge](https://img.shields.io/badge/-Gabriel-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/eugabrielcastro/)](https://www.linkedin.com/in/eugabrielcastro/)
[![Gmail Badge](https://img.shields.io/badge/-contatodevgabriel@gmail.com-red?style=flat-square&link=mailto:contatodevgabriel@gmail.com)](mailto:contatodevgabriel@gmail.com)

