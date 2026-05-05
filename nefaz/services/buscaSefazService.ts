import { sefazApi } from '../utils/axios';

export const sefazService = {

  consultarNotaHtml: async (chave44Digitos: string): Promise<string> => {

    try {
      
      const response = await sefazApi.get('', {
        params: {
          p: `${chave44Digitos}|2|1|1|`
        }
      });

      return response.data;
      
    } catch (error) {
      throw new Error('Não foi possível obter os dados da nota. Verifique sua conexão ou tente novamente mais tarde.');
    }
    
  }
};