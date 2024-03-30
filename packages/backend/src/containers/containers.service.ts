import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { CreateContainerDto } from './dto/create-container.dto';
import { UpdateContainerDto } from './dto/update-container.dto';
import * as fs from 'fs';
import * as Docker from 'dockerode';

import { Response, response } from 'express';

@Injectable()
export class ContainersService {
  create(createContainerDto: CreateContainerDto) {
    return 'This action adds a new container';
  }

  findAll() {
    return `This action returns all containers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} container`;
  }

  update(id: number, updateContainerDto: UpdateContainerDto) {
    return `This action updates a #${id} container`;
  }

  remove(id: number) {
    return `This action removes a #${id} container`;
  }

  async build_and_run() {
    try {
      const docker = new Docker();
      // const contextPath = 'C://Users/lucgb/Developer/code-api-mestrado/public/unzipped/1693959366583_sample/sample'; // Path to the directory containing the Dockerfile
      const contextPath = './public/unzipped/1693959366583_sample/sample'; // Path to the directory containing the Dockerfile
      const dockerfilePath = `${contextPath}/Dockerfile`;

      // Check if the Dockerfile exists
      if (!fs.existsSync(dockerfilePath)) {
        throw new Error('Dockerfile not found');
      }

      const buildStream = await docker.buildImage({
        context: contextPath,
        src: ['Dockerfile', 'pom.xml', 'src'], // List of files to include in the build context
      }, {
        t: 'mutants:latest',
      });

      // Attach event listeners to capture build progress
      buildStream.on('data', (data) => {
        const message = data.toString().trim();
        console.log(message);
      });

      buildStream.on('end', async () => {
        console.log('Image build completed.');
        // Now, you can run the Docker container
        const container = await docker.createContainer({
          Image: 'mutants:latest',
          AttachStdout: true,
          AttachStderr: true,
          Cmd: ['cat', 'test-output.txt'],
        });

        await container.start();

        // Attach to the container's output stream (stdout and stderr)
        const logsStream = await container.logs({
          follow: true,
          stdout: true,
          stderr: true,
        });

        // Forward container logs to your response or log as needed
        logsStream.pipe(process.stdout);
      });

      return 'Building and running Docker image...';
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to build and run Docker image');
    }
  }

  async build_and_run_sync() {
    try {
      const docker = new Docker();
      // const contextPath = 'C://Users/lucgb/Developer/code-api-mestrado/public/unzipped/1693959366583_sample/sample'; // Path to the directory containing the Dockerfile
      const contextPath = './public/unzipped/1693959366583_sample/sample'; // Path to the directory containing the Dockerfile
      const dockerfilePath = `${contextPath}/Dockerfile`;

      // Check if the Dockerfile exists
      if (!fs.existsSync(dockerfilePath)) {
        throw new Error('Dockerfile not found');
      }

      const buildStream = await docker.buildImage(
        {
          context: contextPath,
          src: ['Dockerfile'], // List of files to include in the build context
        },
        {
          t: 'javalista:latest',
        }
      );

      // Wait for the image build to complete
      await new Promise<void>((resolve, reject) => {
        buildStream.on('end', () => {
          console.log('Image build completed.');
          resolve();
        });
        buildStream.on('error', (err) => {
          console.error('Error during image build:', err);
          reject(err);
        });
      });

      // Create and start the Docker container
      const container = await docker.createContainer({
        Image: 'javalista:latest',
        AttachStdout: true,
        AttachStderr: true,
        Cmd: ['cat', 'test-output.txt'],
      });

      await container.start();

      // Attach to the container's output stream (stdout and stderr)
      const logsStream = await container.logs({
        follow: true,
        stdout: true,
        stderr: true,
      });

      // Forward container logs to your response or log as needed
      logsStream.pipe(process.stdout);

      return 'Docker image built and container started successfully.';
    } catch (error) {
      console.error('Error:', error);
      throw new HttpException('Failed to build and run Docker image', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async retrieve() {
    const docker = new Docker(); // Create a Dockerode instance

    // Define the options for running the container
    const containerOptions = {
      Image: 'mutants:latest', // Specify the Docker image to run
      Tty: true, // Enable TTY to capture the output
      Cmd: ['cat', '/app/test-output.txt'], // Command to execute
    };

    try {
      // Create and start the container
      const container = await docker.createContainer(containerOptions);
      await container.start();

      // Wait for the container to exit
      const stream = await container.logs({ follow: true, stdout: true, stderr: true });

      return new Promise<{ content: string }>((resolve, reject) => {
        let output = '';

        // Capture the container's output
        stream.on('data', (chunk) => {
          output += chunk.toString();
        });

        // Handle the end of the output stream
        stream.on('end', () => {
          resolve({ content: output });
        });

        // Handle any errors
        stream.on('error', (err) => {
          reject(err);
        });
        
      });
    } catch (error) {
      throw new Error(`Error retrieving text: ${error.message}`);
    }
  }

  async retrieve_pit() {
    const docker = new Docker(); // Create a Dockerode instance

    // Define the options for running the container
    const containerOptions = {
      Image: 'mutants:latest', // Specify the Docker image to run
      Tty: true, // Enable TTY to capture the output
      Cmd: ['cat', '/app/pit-reports/mutations.xml'], // Command to execute
    };

    try {
      // Create and start the container
      const container = await docker.createContainer(containerOptions);
      await container.start();

      // Wait for the container to exit
      const stream = await container.logs({ follow: true, stdout: true, stderr: true });

      let output = '';

      // Capture the container's output
      stream.on('data', (chunk) => {
        output += chunk.toString();
      });

      // Handle the end of the output stream
      stream.on('end', () => {
        console.log(output)
        // Set the Content-Type header to indicate XML
        response.set('Content-Type', 'application/xml');

        // Send the XML content as the response
        return response.send(output);
      });
    } catch (error) {
      response.status(500).send(`Error retrieving text: ${error.message}`);
    }
  }
}
