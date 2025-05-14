// import { IncomingMessage } from 'http';
// import { NextRequest } from 'next/server';
// import { PassThrough, Readable } from 'stream';

// export const requestToStream = (request: NextRequest): PassThrough => {
//     const reader = request.body?.getReader();
//     if (!reader) throw new Error("Request body is not readable");

//     const passThrough = new PassThrough();

//     // Read the stream in chunks and push to PassThrough
//     const pump = async () => {
//         while (true) {
//             const { done, value } = await reader.read();
//             if (done) {
//                 passThrough.end(); // End the stream gracefully
//                 break;
//             }
//             if (value) {
//                 passThrough.write(value); // Push each chunk to the stream
//             }
//         }
//     };

//     pump().catch(err => {
//         console.error("Stream Pump Error:", err);
//         passThrough.destroy(err); // Destroy the stream if there's an error
//     });

//     return passThrough;
// };

// export const requestToIncomingMessage = (request: Readable): IncomingMessage => {
//     // ✅ Create a mock socket
//     const socket = {
//         remoteAddress: "127.0.0.1",
//         remotePort: 8080,
//         localPort: 3000,
//         writable: true,
//         readable: true,
//         destroy: () => {},
//         on: () => {},
//         end: () => {}
//     };

//     // ✅ Create the IncomingMessage instance
//     const incomingMessage = new IncomingMessage(socket as any);

//     // 🔹 Manually pipe the data to the IncomingMessage
//     PassThrough.on("data", (chunk: any) => {
//         incomingMessage.push(chunk);
//     });

//     PassThrough.on("end", () => {
//         incomingMessage.push(null); // End of data
//     });

//     // Manually set the method and headers
//     incomingMessage.method = "POST";
//     incomingMessage.headers = {
//         "content-type": "multipart/form-data",
//     };

//     return incomingMessage;
// };