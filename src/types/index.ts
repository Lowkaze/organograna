export interface Transacao {
  id?: string
  data: Date | string
  categoria: Categoria | string
  tipo: TipoTransacao | string
  descricao: string
  formaPagamento: FormaPagamento | string
  valor: number | string
  usuarioId?: string
}

export enum TipoTransacao {
  RECEITA = 'Receita',
  DESPESA = 'Despesa',
}

export enum FormaPagamento {
  CARTAO_DEBITO = 'Cartão de débito',
  CARTAO_CREDITO = 'Cartão de crédito',
  DINHEIRO = 'Dinheiro',
  PIX = 'Pix',
  TRANSFERENCIA = 'Transferência',
}

export enum Categoria {
  ALIMENTACAO = 'Alimentação',
  EDUCACAO = 'Educação',
  LAZER = 'Lazer',
  MORADIA = 'Moradia',
  TRANSPORTE = 'Transporte',
  SAUDE = 'Saúde',
  OUTROS = 'Outros',
}
