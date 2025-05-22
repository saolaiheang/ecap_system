// import formidable from "formidable";
// import { IncomingMessage } from "http";



// export const parseForm = async (req: IncomingMessage) => {
//     const form = formidable({
//         keepExtensions: true,
//         multiples: true
//     });

//     return new Promise<{ fields: any; files: any }>((resolve, reject) => {
//         form.parse(req, (err, fields, files) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve({ fields, files });
//             }
//         });
//     });
// };
