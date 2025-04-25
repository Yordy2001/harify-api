import { Content, StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";
// import logo from 'src/assets/logo.jpg';

// const billProducts = [
//     {
//         ID: 1,
//         service: 'Computadora portátil',
//         price: 1200,
//         Cantidad: 10,
//         Total: 1200 * 10,
//     },
//     {
//         ID: 2,
//         service: 'Mouse inalámbrico',
//         price: 25,
//         Cantidad: 50,
//         Total: 25 * 50,
//     },
//     {
//         ID: 3,
//         service: 'Teclado mecánico',
//         price: 70,
//         Cantidad: 30,
//         Total: 70 * 30,
//     },
//     {
//         ID: 4,
//         service: 'Monitor 24 pulgadas',
//         price: 150,
//         Cantidad: 20,
//         Total: 150 * 20,
//     },
//     {
//         ID: 5,
//         service: 'Disco duro externo 1TB',
//         price: 60,
//         Cantidad: 40,
//         Total: 60 * 40,
//     },
//     {
//         ID: 6,
//         service: 'Impresora multifunción',
//         price: 200,
//         Cantidad: 15,
//         Total: 200 * 15,
//     },
//     {
//         ID: 7,
//         service: 'Altavoces Bluetooth',
//         price: 45,
//         Cantidad: 25,
//         Total: 45 * 25,
//     },
//     {
//         ID: 8,
//         service: 'Webcam HD',
//         price: 35,
//         Cantidad: 30,
//         Total: 35 * 30,
//     },
//     {
//         ID: 9,
//         service: 'Micrófono USB',
//         price: 80,
//         Cantidad: 20,
//         Total: 80 * 20,
//     },
//     {
//         ID: 10,
//         service: 'Tablet 10 pulgadas',
//         price: 300,
//         Cantidad: 18,
//         Total: 300 * 18,
//     },
// ];

// const logo: Content = {
//     image: 'src/assets/logo.jpg',
//     width: 200,
// }

// const styles: StyleDictionary = {
//     h1: {
//         fontSize: 20,
//         bold: true,
//         margin: [0, 0, 0, 10],
//     },
// };

// const Formatter = {
//     currency: (value: number): string => {
//         return `$${value.toFixed(2)}`;
//     },
// };

// export const invoiceReport = (): TDocumentDefinitions => {
//     const subTotal = billProducts.reduce(
//         (acc, product) => acc + product.Total,
//         0,
//     );

//     const granTotal = subTotal * 1.16;
//     return {
//         header: {
//             text: 'Invoice Report',
//             style: 'header',
//             alignment: 'right',
//             margin: [0, 10, 10, 10],
//         },
//         content: [
//             {
//                 text: 'Mi Cliente',
//                 style: 'h1',
//                 alignment: 'left',
//             },

//             // Address - date 
//             {
//                 columns: ['Empleado: Juan Perez\n cliente: Jose - 8294558758558', {
//                     text: 'Num: 814DBR\n Fecha: 2023-10-01',
//                     alignment: 'right',
//                     fontSize: 15,
//                 }],
//             },

//             // Service table

//             {
//                 margin: [0, 20],
//                 layout: 'lightHorizontalLines',
//                 // style: 'tableExample',
//                 table: {
//                     widths: ['*', '*', '*'],
//                     body: [
//                         ['Servicio', 'price', 'Cantidad'],
//                         ['Servicio 1', '$100.00', '2'],
//                         ['Servicio 2', '$50.00', '1'],
//                         ['Servicio 3', '$25.00', '3'],
//                     ]
//                 },
//             },

//             // Totales de la tabla
//             [
//                 {
//                     table: {
//                         widths: ['*', '*', '*', '*', '*'],
//                         body: [
//                             [
//                                 { text: 'Subtotal', colSpan: 4, alignment: 'right', border: [false, false, false, false] },
//                                 {}, {}, {},
//                                 {
//                                     text: Formatter.currency(subTotal),
//                                     bold: true,
//                                     alignment: 'right',
//                                     border: [false, false, false, false],
//                                 },
//                             ],
//                         ],
//                     },
//                     layout: 'noBorders',
//                 },
//             ],
//             [
//                 { text: 'IVA 16%', alignment: 'right' },
//                 {
//                     text: Formatter.currency(subTotal * 0.16),
//                     bold: true,
//                     alignment: 'right',
//                 },
//             ],
//             [
//                 {
//                     text: 'Gran Total',
//                     alignment: 'right',
//                     fillColor: 'black',
//                     color: 'white',
//                     bold: true,
//                     margin: [5, 5],
//                     fontSize: 14,
//                 },
//                 {
//                     text: Formatter.currency(granTotal),
//                     bold: true,
//                     alignment: 'right',
//                     fillColor: 'black',
//                     color: 'white',
//                     margin: [5, 5],
//                     fontSize: 14,
//                 },
//             ],
//         ],
//         styles: styles,
//     }
// };

export const invoiceReport = (client, invoice, createInvoiceDto): TDocumentDefinitions => {
    return {
        content: [
            { text: 'Factura', style: 'header' },
            { text: `Fecha: ${new Date().toLocaleDateString()}` },
            { text: `Cliente: ${client?.name}` },
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
