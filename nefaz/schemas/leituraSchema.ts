import { z } from 'zod';
import { validarDigitoVerificadorNFe } from '../utils/validadorSefaz';

export const chaveNFeSchema = z.string()
    .min(1, 'A chave é obrigatória')
    .transform(valor => valor.replace(/\D/g, ''))
    .refine(valor => valor.length === 44, {
        message: 'A chave deve ter exatamente 44 números.',
    })
    .refine(valor => validarDigitoVerificadorNFe(valor), {
        message: 'Chave inválida. Verifique se digitou algum número errado.',
    });