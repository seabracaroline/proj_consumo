import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ConsumoAguaService } from './consumo_agua.service';
import { CreateConsumoDto } from './dto/create-consumo.dto';

@Controller('consumo-agua')
export class ConsumoAguaController {
  constructor(private readonly consumoAguaService: ConsumoAguaService) {}

  @Post()
  async registrarConsumo(@Body() createConsumoDto: CreateConsumoDto) {
    return this.consumoAguaService.registrarConsumo(createConsumoDto);
  }

  @Get('historico')
  async consultarHistorico(
    @Query('inicio') inicio: string,
    @Query('fim') fim: string,
    @Query('userId') userId: string
  ) {
    return this.consumoAguaService.consultarHistorico(inicio, fim, userId);
  }
  
  @Get('alerta')
  async verificarAlerta(@Query('userId') userId: string) {
    return this.consumoAguaService.verificarAlertaConsumoElevado(userId);
  }

}
