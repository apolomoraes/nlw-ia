import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { createReadStream } from "fs";
import { openai } from "../lib/openai";
import { json } from "stream/consumers";

export async function generateAICompletionRoute(app: FastifyInstance) {
  app.post('/videos/:videoId/transcription', async (request) => {
    const bodySchema = z.object({
      prompt: z.string(),
    })

    const { prompt } = bodySchema.parse(request.body);
  })
}