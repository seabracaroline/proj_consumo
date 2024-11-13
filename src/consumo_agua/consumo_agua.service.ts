import { Injectable } from '@nestjs/common';
import { CreateConsumoDto } from './dto/create-consumo.dto';

@Injectable()
export class ConsumoAguaService {
  private consumos: CreateConsumoDto[] = []; 

  registrarConsumo(createConsumoDto: CreateConsumoDto): { message: string } {
    this.consumos.push(createConsumoDto);
    return { message: 'Consumo registrado com sucesso!' };
  }
  
  consultarHistorico(inicio: string, fim: string, userId: string): { historico?: CreateConsumoDto[], message?: string } {
    const inicioDate = new Date(inicio);
    const fimDate = new Date(fim);
  
    if (isNaN(inicioDate.getTime()) || isNaN(fimDate.getTime())) {
      return { message: 'Datas inválidas fornecidas.' };
    }
  
    const historico = this.consumos.filter((consumo) => {
      const consumoDate = new Date(consumo.data);
      return (
        consumo.userId === userId &&
        consumoDate >= inicioDate &&
        consumoDate <= fimDate
      );
    });
  
    return historico.length > 0
      ? { historico }
      : { message: 'Nenhum registro encontrado no período especificado.' };
  }
  
  verificarAlertaConsumoElevado(userId: string) {
    const consumosDoUsuario = this.consumos
      .filter((consumo) => consumo.userId === userId)
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

    if (consumosDoUsuario.length < 2) {
      return { message: 'Dados insuficientes para gerar alerta de consumo elevado.' };
    }

    // Pega os dois últimos meses
    const consumoMesPassado = consumosDoUsuario[consumosDoUsuario.length - 2];
    const consumoMesAtual = consumosDoUsuario[consumosDoUsuario.length - 1];

    // Compara o consumo atual com o do mês passado
    if (consumoMesAtual.quantidade > consumoMesPassado.quantidade) {
      return {
        alert: true,
        message: 'Consumo elevado! O consumo do mês atual é maior que o do mês passado.',
        consumoAnterior: consumoMesPassado.quantidade,
        consumoAtual: consumoMesAtual.quantidade,
      };
    } else {
      return { alert: false, message: 'Consumo dentro do limite em comparação ao mês passado.' };
    }
  }
}
  
