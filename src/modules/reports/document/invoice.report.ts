import {  TDocumentDefinitions } from "pdfmake/interfaces";

export const invoiceReport = (client, employee, invoice, createInvoiceDto): TDocumentDefinitions => {
    return {
        content: [
            { text: 'Factura', style: 'header' },
            { text: `Fecha: ${new Date().toLocaleDateString()}` },
            { text: `Cliente: ${client?.name}` },
            { text: `Empleado: ${employee.name}` },
            { text: `Estado: ${invoice.status}` },
            { text: '\n' },
            {
                table: {
                    widths: ['*', 'auto', 'auto', 'auto'],
                    body: [
                        ['Servicio', 'Cantidad', 'Precio unitario', 'Total'],
                        ...createInvoiceDto.items.map(item => [
                            item.name || item.itemId, // Asegúrate de tener `name` si puedes
                            item.quantity,
                            `$${item.unitPrice.toFixed(2)}`,
                            `$${(item.unitPrice * item.quantity).toFixed(2)}`
                        ])
                    ]
                }
            },
            {
                text: `\nTotal:$ ${createInvoiceDto.items
                    .reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
                    .toFixed(2)}`,
                bold: true,
                alignment: 'right'
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10]
            }
        }
    }
};
