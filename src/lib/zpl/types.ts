export type ZplTextElement = {
  type: 'text';
  x: number;
  y: number;
  text: string;
  fontHeight: number;
  fontWidth: number;
  reverse: boolean;
  blockWidth?: number;
  maxLines?: number;
};

export type ZplBarcodeElement = {
  type: 'barcode';
  kind: 'code128' | 'qrcode';
  x: number;
  y: number;
  data: string;
  height: number;
  moduleWidth: number;
  showText: boolean;
};

export type ZplBoxElement = {
  type: 'box';
  x: number;
  y: number;
  width: number;
  height: number;
  thickness: number;
};

export type ZplElement = ZplTextElement | ZplBarcodeElement | ZplBoxElement;

export type ZplLabel = {
  widthDots: number;
  heightDots: number;
  dpi: number;
  elements: ZplElement[];
};
