# intern-nestjs

- Node.js 버전: v20.11.0
- nest 버전: 10.3.2

- yarn으로 Nest.JS 설치
```bash
yarn global add @nestjs/cli
```

- Nest.JS 프로젝트 생성
```bash
nest new ./
```

- Nest.JS 프로젝트 실행
```bash
yarn run start:dev
```

- module 생성 & controller 생성 & service 생성
```bash
nest g module {모듈명}
nest g controller {컨트롤러명} --no-spec
nest g service {서비스명} --no-spec
```

- 설치한 외부 모듈 & 라이브러리
```bash
yarn add prisma @prisma/client
yarn add @fightmegg/riot-api
yarn add @nestjs/config
```