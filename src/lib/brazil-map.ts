// Generated from IBGE-based Brazil states GeoJSON (codeforgermany/click_that_hood), simplified.
export const MAP_W = 1000;
export const MAP_H = 901;
const C = Math.cos((-15 * Math.PI) / 180);
const K = 22.803440;
/** Same projection used to build the state outlines. */
export function project(lon: number, lat: number): [number, number] {
  return [(lon - (-74.0)) * C * K, (5.5 - lat) * K];
}
export const STATES: { uf: string; nome: string; d: string }[] = [{"uf": "AC", "nome": "Acre", "d": ""}, {"uf": "AL", "nome": "Alagoas", "d": ""}, {"uf": "AM", "nome": "Amazonas", "d": ""}, {"uf": "AP", "nome": "Amapá", "d": ""}, {"uf": "BA", "nome": "Bahia", "d": ""}, {"uf": "CE", "nome": "Ceará", "d": ""}, {"uf": "ES", "nome": "Espírito Santo", "d": ""}, {"uf": "GO", "nome": "Goiás", "d": ""}, {"uf": "MA", "nome": "Maranhão", "d": ""}, {"uf": "MG", "nome": "Minas Gerais", "d": ""}, {"uf": "MS", "nome": "Mato Grosso do Sul", "d": ""}, {"uf": "MT", "nome": "Mato Grosso", "d": ""}, {"uf": "PA", "nome": "Pará", "d": ""}, {"uf": "PB", "nome": "Paraíba", "d": ""}, {"uf": "PE", "nome": "Pernambuco", "d": ""}, {"uf": "PI", "nome": "Piauí", "d": ""}, {"uf": "PR", "nome": "Paraná", "d": ""}, {"uf": "RJ", "nome": "Rio de Janeiro", "d": ""}, {"uf": "RN", "nome": "Rio Grande do Norte", "d": ""}, {"uf": "RO", "nome": "Rondônia", "d": ""}, {"uf": "RR", "nome": "Roraima", "d": ""}, {"uf": "RS", "nome": "Rio Grande do Sul", "d": ""}, {"uf": "SC", "nome": "Santa Catarina", "d": ""}, {"uf": "SE", "nome": "Sergipe", "d": ""}, {"uf": "SP", "nome": "São Paulo", "d": ""}, {"uf": "TO", "nome": "Tocantins", "d": ""}, {"uf": "DF", "nome": "Distrito Federal", "d": ""}];
