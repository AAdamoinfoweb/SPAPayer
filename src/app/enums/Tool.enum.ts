export const tool = {
  INSERT: {value: 'insert'},
  UPDATE: {value: 'update'},
  DELETE: {value: 'delete'},
  EXPORT_PDF: {value: 'export_pdf'},
  EXPORT_XLS: {value: 'export_xls'}
};

export function parse(value: string) {
  switch (value) {
    case tool.INSERT.value:
      return tool.INSERT
      break;
    case tool.UPDATE.value:
      return tool.UPDATE
      break;
    case tool.DELETE.value:
      return tool.DELETE
      break;
    case tool.EXPORT_PDF.value:
      return tool.EXPORT_PDF
      break;
    case tool.EXPORT_XLS.value:
      return tool.EXPORT_XLS
      break;
    default:
      return null;
  }
}

