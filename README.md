# NotaTrack

## Funcionalidades
- Importar notas fiscais emitidas no CPF
- Buscar dados de notas fiscais emitidas no CPF. Cadastrando lojas, produtos e seus preços
- Importar notas fiscais utilizando o QrCode da nota
- Em alguns casos o captcha é resolvido automaticamente sem a necessidade de intervenção manual ou utilização do 2Captcha

Add images

![](images/import.png)
![](images/manual_add.png)
![](images/notas.png)

## Rodando o projeto
- Clone o repositório
- Instale as dependências
  ```bash
  npm ci
  ```
- Inicialize o servidor
  ```bash
  make app
  ```
- Acesse o endereço `http://localhost:3000`

## Configurações

As configurações são feitas via variáveis de ambiente

|Nome|Descrição|
|---|---|
|NEXT_PUBLIC_DEBUG|Habilita logs de debug tanto no backend quanto no frontend|
|PUPPETEER_BROWSER_ENDPOINT|Endpoint do navegador para ser utilizado. Para utilizar o Google Chrome é necessário iniciá-lo com `--remote-debugging-port=9222`|
|PUPPETEER_WS_ENDPOINT||
|TWO_CAPTCHA_API_KEY|Api Key do serviço [2Captcha](http://2captcha.com/) para quebra automática do Captcha quando necessário. Caso não exista, será necessário o captcha manualmente* |

`PUPPETEER_BROWSER_ENDPOINT` e `PUPPETEER_WS_ENDPOINT` são variáveis de ambiente opcionais, porém seu uso é recomendado.
Quando uma das duas variáveis de ambiente é definida, a aplicação irá utilizar o navegador já existente. Caso contrário, um novo navegador será aberto.

## Limitações
### Tanto a importação de notas fiscais quanto a busca dos dados das mesmas são protegidas por captcha
Isso dificulta a automação desses processos ou requer a utilização de serviços de terceiros para quebrar o captcha (como o [2Captcha](https://2captcha.com/)).

### Apenas o estado de SP é suportado. Tanto a busca de notas fiscais emitidas no CPF e importação dos dados da nota
O suporte para novos estados pode ser adicionado conforme a necessidade

### As interfaces Web das notas fiscais não expõem dados identificadores, como o código de barras, portanto a correlação de produtos não é automatizável
Alguns provedores pagos, como o [InfoSimples](https://infosimples.com/) fornecem tais dados, porém é uma API paga.

### Utilizando o próprio navegador como browser da aplicação

#### Chrome

Inicialize o Chrome com a flag `--remote-debugging-port=9222` e configure a variável de ambiente `PUPPETEER_BROWSER_ENDPOINT` com o valor `http://localhost:9222`.

## TODOs
- [ ] Suportar outros bancos de dados (Postgres)
  - [ ] Suportar mais de 1 banco?
- [ ] Adicionar suporte para mais estados
- [ ] Permitir _merge_ de produtos
- [ ] Relatórios
  - [ ] Produtos comprados no mês (com valor total)
  - [ ] Lojas mais frequentadas
  - [ ] Produtos mais comprados
- [ ] Capacidade de rodar um browser como container que sirva uma interface web
- [ ] Permitir o uso de outros bancos de dados
