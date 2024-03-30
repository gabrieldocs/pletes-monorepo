import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { CreateCompletitionDto } from './dto/create-completition.dto';
import { UpdateCompletitionDto } from './dto/update-completition.dto';
import { randomUUID } from 'crypto';
import amqp from "amqplib";
@Injectable()
export class CompletitionsService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async completition(input: string) {
    const completitions = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'generate a JUnit test case for the received source code',
        },
        {
          role: 'assistant',
          content: 'this is a sample generated from the provided input',
        },
        {
          role: 'user',
          content: input,
        },
      ],
      // model: 'gpt-3.5-turbo',
      model: 'gpt-4',
    });

    return { text: completitions };
  }

  create(createCompletitionDto: CreateCompletitionDto) {
    return 'This action adds a new completition';
  }

  findAll() {
    return `This action returns all completitions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} completition`;
  }

  update(id: number, updateCompletitionDto: UpdateCompletitionDto) {
    return `This action updates a #${id} completition`;
  }

  remove(id: number) {
    return `This action removes a #${id} completition`;
  }

  async publish(payload: any) {
    const queue = process.env.queue || "completition_topic";
    const text = {
      id: randomUUID(),
      ...payload
    }
    let connection: any;
    try {
      connection = await amqp.connect(process.env.queue_host || "amqp://localhost")

      const channel = await connection.createChannel()

      await channel.assertQueue(queue, { durable: false })
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(text)))
      console.log(" [x] sent  to the queue '%s'", text)
      await channel.close()
    } catch (err: any) {
      console.error(err)
    } finally {
      if (connection) await connection.close()
    }
  }

  async consumer() {
    const queue = process.env.queue || "completition_topic";
    try {
      const connection = await amqp.connect(process.env.queue_host || "amqp://localhost");
      const channel = await connection.createChannel();

      process.once("SIGINT", async () => {
        await channel.close()
        await connection.close()
      })

      await channel.assertQueue(queue, { durable: false })
      await channel.consume(
        queue,
        (message) => {
          if (message) {
            console.log("[x] received '%s'", JSON.parse(message.content.toString()))
          }
        },
        { noAck: true }
      )

      console.log("[*] waiting for messages. To exit press CTRL+C")
    } catch (err) {
      console.error(err)
    }
  }
}
