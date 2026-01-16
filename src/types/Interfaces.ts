export interface NewWrData{
  tracking: string;
  consignee: string
  shipper: string
  carrier: string
  prohibido: boolean
  baterias: string
  verificado: boolean
  fob: string
  invoice: string
  wrExterno: string
  instrucciones: string
  notaAdm: string
  notaGen: string
  paquetes: Paquetes
}

export interface Paquetes{
  cantidad: string
  tipo: string
  peso: string
  altura: string
  ancho: string
  largo: string
  descripcion: string
}