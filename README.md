<h1 align="center"> Nest-Cognito </h1>

## 📄 Descrição do projeto

Este repositório tem a proposta de mostrar um projeto utilizando o framework nest abordando vários conceitos de Clean Code, SOLID, terraform para geração da infraestrutura, cognito para autenticação, controle de usuários e testes.

## 🛠 Funcionalidades do Projeto

- Cadastro de usuários
- Exclusão de usuários
- Listar informações do usuário
- Login
- Autenticação MFA no login
- Alteração de senha

## 🚩 Requisitos

- [Git](https://www.git-scm.com/downloads);
- [NodeJS](https://nodejs.org/en/);
- [Nest](https://docs.nestjs.com/);
- [Terraform](https://www.terraform.io/);
- Instalação [terraform Windows](https://nodejs.org/en/);
- Instalação(Recomendado) [terraform WSL Windows/Linux](https://nodejs.org/en/)
- Conta na [AWS](https://aws.amazon.com/pt/free/?gclid=CjwKCAjwyJqzBhBaEiwAWDRJVG7KfaYfc-gsL5jxvEllnRK8yfZHKsFUzKN2FdtJFTm9ciMAo4XQxhoCJrYQAvD_BwE&trk=eb5111a8-7144-44a0-b89b-294d1572e79e&sc_channel=ps&ef_id=CjwKCAjwyJqzBhBaEiwAWDRJVG7KfaYfc-gsL5jxvEllnRK8yfZHKsFUzKN2FdtJFTm9ciMAo4XQxhoCJrYQAvD_BwE:G:s&s_kwcid=AL!4422!3!507891927284!p!!g!!aws%20amazon%20com!12582854283!122410197809&all-free-tier.sort-by=item.additionalFields.SortRank&all-free-tier.sort-order=asc&awsf.Free%20Tier%20Types=*all&awsf.Free%20Tier%20Categories=*all) (Recomendado plano gratuíto para não ter possíveis custos adicionais)

## 📺 Playlist no Youtube sobre o projeto

- [Youtube](https://www.youtube.com/watch?v=5WLbfX_QF7Q&list=PLOUmSdyfY1NYRpi1lXvPPP4Rm73I828L3)

## 💻 Como iniciar

- Para iniciar execute os seguintes comandos
- Recomendado usar o terminar do WSL/linux ou Git Bash para funcionar corretamente todos os comandos
- Abrir terminal

- Clone o repositorio na sua máquina local.

```sh
git clone https://github.com/JeanCarlosDelai/Nest-Cognito.git
```

- Acesse a pasta clonada

```sh
cd Nest-Cognito
```

- Rode o comando para instalar as dependências

```sh
npm install
```

- Criar arquivo .env com base no arquivo de exemplo, para configuração de variáveis de ambiente:

```sh
cp .env.example .env
```

- Adicionar AWS_ACCESS_KEY_ID e AWS_SECRET_KEY no arquivo .env
- [Como gerar chaves AWS](https://www.git-scm.com/downloads)

```sh
#AWS
AWS_REGION=sa-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_KEY=
```

- Adicionar chaves da AWS no terminar para pode criar os recursos na AWS

```sh
export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=
```

- Iniciar o terraform

```sh
cd terraformCognito
terraform init
```

- Rodar o comando para criar o serviço do cognito e toda a sua estrutura

```sh
terraform apply -auto-approve
```

- Ao finalizar com sucesso irá gerar dois arquivos .txt
- Os dois arquivos estarão no diretório terraformCognito
- Primeiro arquivo será o user_pool_id.txt
- Pegar o id que foi salvo no arquivo e colocar no arquivo . env na variável COGNITO_CLIENT_ID=

```sh
#Cognito
COGNITO_CLIENT_ID=
```

- Segundo arquivo será o cognito_client_id.txt
- Pegar o id que foi salvo no arquivo e colocar no arquivo . env na variável COGNITO_USER_POOL_ID=

```sh
#Cognito
COGNITO_USER_POOL_ID=
```

- Agora é só iniciar o servidor em modo de produção

```sh
cd ..
npm run build
npm run start:prod
```

- Se optar por modo de desenvolvimento

```sh
npm run start:dev
```

## 🧪 Rodando os testes

- Para rodas os testes unitários:

```sh
npm run test
```

- Para rodar os testes de integração:

```sh
npm run test:integration
```

- Para rodas os testes e2e:

```sh
npm run test:e2e
```

- Para rodas os testes de mutação:

```sh
npm run test:mutation
```

### Verificar Cobertura

- Para verificar a cobertura dos testes unitários, execute o seguinte comando:

```sh
npm run test:cov
```

## ❌ Remover recursos

- Se desejar exluir os recursos criados na AWS para evitar custos

```sh
terraform destroy -auto-approve
```

## ✅ Tecnologias utilizadas

- Linguagem: `Typescript`
- Ambiente te execução: `Node.js`
- Framework BackEnd: `Nest.js`
- Serviço de cloud: `AWS`
- Geração dos recursos da AWS (IAC): `terraform`
- Serviço de autenticação: `Cognito`
- Testes: `Vitest | Supertest`

## 👨🏻‍💻 Desenvolvedor

[<img src="https://avatars.githubusercontent.com/u/112594276?v=4" width="80px;"/>](https://github.com/JeanCarlosDelai)
