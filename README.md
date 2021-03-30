# Dashboard Brasil COVID-19 Equipe 1
Projeto da disciplina de Desenvolvimento Web que consiste em criar uma dashboard que mostra dados do Covid no Brasil atualizado diariamente.

## API e Dados

A API consumida é a Brasil.io COVID-19. Durante a inicialização da aplicação é feita a primeira requisição à API e é salva no Banco H2. As informações do banco de dados que são fornecidas à Dashboard.

## Telas

O Projeto possui uma dashboard possuindo:
  - Um Card com a soma de Casos Confirmados em todos os estados brasileiro no último dia;
  - Um Card com a soma de Óbitos em todos os estados brasileiros no último dia;
  - Um gráfico de colunas com os cinco estados brasileiro com maiores números de Casos Confirmados no último dia;
  - Um gráfico de colunas com os cinco estados brasileiros com maiores números de Óbitos no último dia;
  - Um gráfico de mapa de densidade do Brasil com o número de casos totais por estado;
  - Um gráfico de pizza com a porcentagem de Casos Confirmados totais e Óbitos totais.
