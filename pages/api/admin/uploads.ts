import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";

type Data = {
  message: string;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return UploadFile(req, res);

    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const saveFile = async (file: formidable.File) => {
  const data = fs.readFileSync(file.filepath); // lee el archivo temporal que tenemos en el servidor

  fs.writeFileSync(`./public/${file.originalFilename}`, data); // lo guardamos en la carpeta public con el nombre original
  fs.unlinkSync(file.filepath); // borramos el archivo temporal
};

const parseFiles = async (req: NextApiRequest): Promise<string> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      const filePath = await saveFile(files.file as formidable.File);
      resolve("true"); //enviar filePath
    });
  });
};

const UploadFile = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const imageUrl = await parseFiles(req);

  return res.status(200).json({ message: imageUrl });

  // await db.connect();

  // const user = await User;
};
