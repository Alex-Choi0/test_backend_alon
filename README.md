<p align="center">
  <a href="https://www.always-on.co.kr/" target="blank"><img src="https://img.notionusercontent.com/s3/prod-files-secure%2F5988ad93-bb7e-428d-97bf-08678d967189%2Fd172351b-1626-4057-8c1e-268a58a37b85%2FALON_symbol_green.png/size/w=250?exp=1773305854&sig=lIBXEL_sPJnwXSXElvc2jEwbxxO8mT66_vDmaEVKTpg&id=31ad73d6-a6e3-8087-bae0-dc525f7b333b&table=block" width="120" alt="아론 웹사이트 링크" /></a>
</p>

## 프로젝드 개요

해당 프로젝트는 "[아론] 소프트웨어 개발 채용\_코딩 과제"로 백엔드 파트를 진행하였습니다.

NestJS(NodeJS)를 이용하여 개발을 진행하였으며 현재 웹상에서 [배포](https://alon-test-backend.alex-choi.com/api-docs)되어있는 상태입니다.

해당 프로젝트에 대한 자세한 설명은 [아론 백엔드 과제 개발문서](https://docs.google.com/document/d/1cLCWiyr29opcE1YZENhP0E3IZSs50d1uHPjERNZptM8/edit?usp=sharing)를 참고해 주시기 바랍니다.

[과제링크](https://stone-conifer-1a0.notion.site/_-31ad73d6a6e38087bae0dc525f7b333b) 백엔드 과제

## 프로젝트 셋팅방법

우선사항

- .env.example 파일을 복사해서 .env파일로 추가합니다.
- postgres정보 및 메일을 보낼시 smtp정보를 입력합니다. ([배포](https://alon-test-backend.alex-choi.com/api-docs)사이트에는 구현되어 있음)
- postgres정보가 일치하지 않거나 접속이 불가능하면 백엔드 서버 자체가 실행되지 않습니다. (postgres와 함께 로컬에서 실행시 2번 또는 3번 참고)
- docker 및 docker-compose가 설치되어 있어야 합니다.
- 서버가 로컬에서 실행되면 Swagger의 문서를 확인할수 있습니다. http://localhost:3000/api-docs 에서 확인할수 있으며 외부 노출 포트에 따라 3000번은 변경할수 있습니다.

## 실행하는 방법(Ubuntu)

### 1. docker로 실행하는 방법

- Dockerfile.dev파일이 있는 경로에서 터미널 실행

```bash
이미지 빌드
$ docker build -f Dockerfile.dev -t [이미지 이름]:[버전] .
```

```bash
도커로 컨테이너 실행
$ docker run -p [원하는 출력 포트]:3000 -d [이미지 이름]:[버전]
```

### 2. docker-compose로 실행하는 방법

- Dockerfile.dev파일이 있는 경로에서 터미널 실행
- .env.example 파일을 .env파일로 변경.
- 이메일 알림을 받아야 하면 이메일 정보 입력
- 설정포트를 위해 .env파일의 DOCKER_PORT 입력
- docker-compsoe로 실행되는 postgres는 4001포트를 점유합니다.

```bash
도커 컴포즈로 실행
$ docker-compose -f docker-compose.test.yaml up -d --build
```

```bash
도커 컴포즈로 정지(볼륨 삭제안함)
$ docker-compose -f docker-compose.test.yaml down
```

```bash
도커 컴포즈로 정지(볼륨 삭제)
$ docker-compose -f docker-compose.test.yaml down -v
```

### 3. Bash파일로 실행하는 방법

- Dockerfile.dev파일이 있는 경로에서 터미널 실행
- .env.example 파일을 .env파일로 변경.
- 이메일 알림을 받아야 하면 이메일 정보 입력
- 설정포트를 위해 .env파일의 DOCKER_PORT 입력
- docker-compsoe로 실행며 postgres는 4001포트를 점유합니다.
- development_test_run.sh, development_down.sh파일의 chmod권한을 설정해야 합니다.

```bash
development_test_run.sh로 실행
$ ./development_test_run.sh
```

```bash
development_down.sh로 정지(볼륨 삭제안함)
$ ./development_down.sh
```

## 링크

- 과제 GitHub - [링크](https://github.com/Alex-Choi0/test_backend_alon)
- 배포 웹사이트 - [링크](https://alon-test-backend.alex-choi.com/api-docs)
- 데이터베이스 스키마 - [링크](https://dbdiagram.io/d/test_alon_schema-69ad5e80a44dc25f8b423993)
- 아론 백엔드 과제 개발문서 - [링크](https://docs.google.com/document/d/1cLCWiyr29opcE1YZENhP0E3IZSs50d1uHPjERNZptM8/edit?usp=sharing)
- 참고 기술 블로그 - [링크](https://engineeringshw.blogspot.com/)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
