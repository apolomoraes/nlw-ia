import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { fastifyMultipart } from '@fastify/multipart'
import path from "node:path";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import util from "node:util";
import { pipeline } from "node:stream";

const pump = util.promisify(pipeline)

export async function uploadVideoRoute(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1048576 * 25,
    }
  })

  app.post('/videos', async (request, reply) => {
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ error: 'Missing file input' })
    }

    const extension = path.extname(data.filename); //retorna extensão do arquivo

    if (extension !== '.mp3') {
      return reply.status(400).send({ error: 'Invalid input type, please upload a MP3' });
    }

    const fileBaseName = path.basename(data.filename, extension); //retorna nome do arquivo sem extensão

    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`;

    const uploadDestination = path.resolve(__dirname, "../../tmp", fileUploadName);

    await pump(data.file, fs.createWriteStream(uploadDestination));

    const video = await prisma.video.create({
      data: {
        name: data.filename,
        path: uploadDestination,
      }
    })

    return {
      video,
    };
  })
}