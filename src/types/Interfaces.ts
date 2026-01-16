export interface NewWrData {
  tracking: string
  consignee: string
  shipper: string
  carrier: string
  baterias: string
  invoice: string
  wrExterno: string
  notaAdm: string
  notaGen: string
  paquetes: Paquetes
}

export interface Paquetes {
  cantidad: string
  tipo: string
  peso: string
  altura: string
  ancho: string
  largo: string
  descripcion: string
}
