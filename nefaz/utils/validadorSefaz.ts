
export const validarDigitoVerificadorNFe = (chave: string): boolean => {

    const chaveLimpa = chave.replace(/\D/g, '');
    if (chaveLimpa.length !== 44) return false;

    let soma = 0;
    let peso = 2;


    for (let i = 42; i >= 0; i--) {
        soma += parseInt(chaveLimpa.charAt(i), 10) * peso;
        peso++;
        if (peso > 9) peso = 2;
    }

    const resto = soma % 11;
    const dvCalculado = resto === 0 || resto === 1 ? 0 : 11 - resto;
    const dvInformado = parseInt(chaveLimpa.charAt(43), 10);

    return dvCalculado === dvInformado;

};