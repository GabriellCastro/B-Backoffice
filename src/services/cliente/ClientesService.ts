import { Injectable } from '@nestjs/common';
import * as DistanceMatrix from 'google-distance-matrix';
import * as graphlib from 'graphlib';

import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  async obterCoordenadasClientes(): Promise<any[]> {
    return await this.prisma.coordinates.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            whatsApp: true,
            address: true,
          },
        },
      },
    });
  }

  async calcularRotaOtimizada(coordenadasClientes: any[]): Promise<any[]> {
    // Filtrar para garantir que temos coordenadas e userId
    const coordenadasClientesFiltradas = coordenadasClientes.filter(
      (coordenada) =>
        coordenada.latitude && coordenada.longitude && coordenada.userId,
    );

    if (coordenadasClientesFiltradas.length === 0) {
      console.error('Coordenadas inválidas ou faltando userId.');
      return [];
    }

    const coordenadas = coordenadasClientesFiltradas.map((coordenada) => ({
      lat: coordenada.latitude,
      lng: coordenada.longitude,
    }));

    // Calcula as distâncias entre as coordenadas usando a API Distance Matrix do Google
    const { elements } = await this.calcularDistancias(coordenadas);

    if (!elements) {
      console.error(
        "O objeto 'elements' é undefined. Certifique-se de que a API Distance Matrix está retornando resultados corretos.",
      );
      return [];
    }

    // Cria um grafo ponderado das distâncias
    const grafo = this.criarGrafoPonderado(
      coordenadasClientesFiltradas,
      elements,
    );

    // Usa o algoritmo Dijkstra para obter a ordem otimizada
    const ordemOtimizada = graphlib.alg.dijkstra(grafo, 'empresa');

    if (!ordemOtimizada) {
      console.error('Falha ao calcular a ordem otimizada.');
      return [];
    }

    // Mapeia a ordem otimizada para incluir detalhes dos clientes
    const ordemVisita = Object.keys(ordemOtimizada).map((key) => {
      const cliente = coordenadasClientesFiltradas.find(
        (c) => c.userId === key,
      );

      if (!cliente) {
        console.error('Cliente não encontrado para a chave:', key);
        return null;
      }

      // Ajuste para acessar os detalhes corretos
      const detalhesCliente = cliente.user || {};

      return {
        clienteId: cliente.userId,
        nome: detalhesCliente.name || '',
        endereco: detalhesCliente.address || '',
        numeroWhatsApp: detalhesCliente.whatsApp || '',
        latitude: cliente.latitude || 0,
        longitude: cliente.longitude || 0,
      };
    });

    // Filtrar para remover elementos nulos
    const ordemVisitaFiltrada = ordemVisita.filter(
      (cliente) => cliente !== null,
    );

    return ordemVisitaFiltrada;
  }

  private async calcularDistancias(
    coordenadas: { lat: number; lng: number }[],
  ): Promise<any> {
    DistanceMatrix.key('AIzaSyAP6To_3SQv8AvCF_HK0_8Sz6OsQxourB0');
    DistanceMatrix.mode('driving');
    DistanceMatrix.units('metric');

    return new Promise((resolve, reject) => {
      DistanceMatrix.matrix(
        [coordenadas[0]],
        coordenadas,
        async (err, distances) => {
          if (err) {
            console.error('Erro ao calcular distâncias:', err);
            reject(err);
          } else {
            const elements = distances.rows.map((row) => row.elements);

            resolve({ elements });
          }
        },
      );
    });
  }

  private criarGrafoPonderado(
    coordenadasClientes: any[],
    elements: any[],
  ): graphlib.Graph {
    const grafo = new graphlib.Graph({ directed: true });

    // Adiciona os nós ao grafo
    coordenadasClientes.forEach((cliente, i) => {
      const nodeId = cliente.user.id;
      grafo.setNode(nodeId, {
        label: `Cliente${cliente.user.id}`,
      });

      // Verifica se 'elements' não é undefined
      if (elements && elements[i] && elements[i].elements) {
        // Adiciona as arestas ao grafo
        elements[i].elements.forEach((element, j) => {
          const distancia = element.distance.value;
          const targetNodeId = coordenadasClientes[j].user.id;
          grafo.setEdge(nodeId, targetNodeId, distancia);
        });
      } else {
        console.error(
          "O objeto 'elements' não está na estrutura esperada. Certifique-se de que a API Distance Matrix está retornando resultados corretos.",
        );
      }
    });

    return grafo;
  }
}
