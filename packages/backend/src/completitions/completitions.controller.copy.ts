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
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CompletitionsService } from './completitions.service';
import { CreateCompletitionDto } from './dto/create-completition.dto';
import { UpdateCompletitionDto } from './dto/update-completition.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import * as unrar from 'unrar-js';
import * as Docker from 'dockerode';
import { Response } from 'express';


@Controller('completitions')
export class CompletitionsController {
  constructor(private readonly completitionsService: CompletitionsService) { }

  @Post('/generate')
  async completition(@Body('input') input: string) {
    return await this.completitionsService.completition(input.toString());
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body('path') userPath: string) {
    if (!fs.existsSync(userPath)) {
      // Create the directory if it doesn't exist
      fs.mkdirSync(userPath, { recursive: true });
    }

    // Determine the destination path for the file
    const destination = path.join(userPath, file.originalname);

    // Save the file to the specified path
    fs.writeFileSync(destination, file.buffer);

    console.log(`File saved to: ${destination}`);
  }

  @Post('store')
  @UseInterceptors(FileInterceptor('file', { dest: './public' }))
  async uploadToLocalStorage(@UploadedFile() file: Express.Multer.File) {
    if (file) {
      const rarFilePath = path.join('./public', file.filename);
      const outputFolder = path.join('./public', 'unzipped');

      try {
        // Ensure the output folder exists
        if (!fs.existsSync(outputFolder)) {
          fs.mkdirSync(outputFolder, { recursive: true });
        }

        // Generate a unique filename for the RAR file
        const uniqueFileName = `${Date.now()}_${file.originalname}`;
        const uniqueRarFilePath = path.join(outputFolder, uniqueFileName);

        // Move the uploaded file to the unique path
        fs.renameSync(rarFilePath, uniqueRarFilePath);

        // Extract the RAR archive
        await unrar.extract(uniqueRarFilePath, outputFolder);

        return {
          message: 'RAR file extracted successfully!',
          outputFolder,
        };
      } catch (error) {
        return {
          error: 'Error extracting RAR file.',
        };
      }
    } else {
      return {
        error: 'No file uploaded.',
      };
    }
  }

  @Get('/v1/contents')
  async contents(@Res() res: Response) {
    try {
      const filePath = `./public/unzipped/1693959366583_sample/sample/src/test/java/com/example/CalculatorTest.java`;
      const fileContent = fs.readFileSync(filePath, 'utf8');

      res.header('Content-Type', 'text/plain');
      res.send(fileContent);
    } catch (err) {
      res.status(404).send('File not found');
    }
  }

  @Get('/contents')
  async getFileContents(@Query('filePath') filePath: string, @Res() res: Response) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      res.header('Content-Type', 'text/plain');
      res.send(fileContent);
    } catch (err) {
      res.status(404).send('File not found');
    }
  }

  @Post('/write-to-file')
  async writter(@Body() body: { textContent: string }) {
    try {
      const filePath = `./public/unzipped/1693959366583_sample/sample/src/test/java/com/example/CalculatorTest.java`;
      const newContent = body.textContent; // Get the posted text content

      fs.writeFileSync(filePath, newContent); // Write the new content to the file

      return 'File updated successfully';
    } catch (error) {
      throw new Error('Unable to update the file');
    }
  }

  @Post('/build-and-run')
  async buildAndRun() {
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

  @Post('/build-and-run-sync')
  async buildAndRunSync() {
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
  /**
   * Retrieves the output of the container execution
   */
  @Get('/retrieve')
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

  @Get('/retrieve-pit')
  async retrievePit(@Res() response: Response) {
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
        // Set the Content-Type header to indicate XML
        response.set('Content-Type', 'application/xml');

        // Send the XML content as the response
        response.send(output);
      });
    } catch (error) {
      response.status(500).send(`Error retrieving text: ${error.message}`);
    }
  }

  @Get('/folder-structure')
  async folder_structure() {
    const folderPath = './public/unzipped/1693959366583_sample/sample'; // Change this to the path of the folder you want to retrieve the structure for

    try {
      const folderStructure = await this.getFolderStructure(folderPath);
      return { success: true, data: folderStructure };
    } catch (error) {
      return { success: false, error: 'Failed to retrieve folder structure' };
    }
  }

  async getFolderStructure(folderPath: string): Promise<any> {
    const stat = fs.statSync(folderPath);

    if (stat.isDirectory()) {
      const folderItems = fs.readdirSync(folderPath);
      const structure = {};

      for (const item of folderItems) {
        const itemPath = path.join(folderPath, item);
        structure[item] = await this.getFolderStructure(itemPath);
      }

      return structure;
    } else {
      return null; // Return null for files
    }
  }
}
