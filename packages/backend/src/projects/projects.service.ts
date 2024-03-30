import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as unrar from 'unrar-js';
import { Response } from 'express';
@Injectable()
export class ProjectsService {
  create(createProjectDto: CreateProjectDto) {
    return 'This action adds a new project';
  }

  findAll() {
    return `This action returns all projects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }

  async folder_structure(): Promise<any> {
    const folderPath = './public/unzipped/1693959366583_sample/sample';
    try {
      const folderStructure = await this.get_folder_structure(folderPath);
      return { success: true, data: folderStructure };
    } catch (error) {
      return { success: false, error: 'Failed to retrieve folder structure' };
    }
  }

  async get_folder_structure(folder_path: string): Promise<any> {
    const stat = fs.statSync(folder_path);

    if (stat.isDirectory()) {
      const folderItems = fs.readdirSync(folder_path);
      const structure = {};

      for (const item of folderItems) {
        const itemPath = path.join(folder_path, item);
        structure[item] = await this.get_folder_structure(itemPath);
      }

      return structure;
    } else {
      return null;
    }
  }

  async upload(file: Express.Multer.File, userPath: string) {
    if (!fs.existsSync(userPath)) {
      fs.mkdirSync(userPath, { recursive: true });
    }
  
    const destination = path.join(userPath, file.originalname);
    fs.writeFileSync(destination, file.buffer);
  
    console.log(`File saved to: ${destination}`);
  }
  

  async upload_to_local_storage(file) {
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

  async v1_contents(res: Response) {
    try {
      const filePath = `./public/unzipped/1693959366583_sample/sample/src/test/java/com/example/CalculatorTest.java`;
      const fileContent = fs.readFileSync(filePath, 'utf8');

      res.header('Content-Type', 'text/plain');
      res.send(fileContent);
    } catch (err) {
      res.status(404).send('File not found');
    }
  }

  async contents(filePath, res) {
    const file_path = __dirname + `./public/unzipped/1693959366583_sample/sample/src/test/java/com/example/CalculatorTest.java`;

    console.log(file_path)

    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      res.header('Content-Type', 'text/plain');
      res.send(fileContent);
    } catch (err) {
      res.status(404).send('File not found');
    }
  }

  async write_to_file(body:  {textContent: string}) {
    try {
      const filePath = __dirname + `./public/unzipped/1693959366583_sample/sample/src/test/java/com/example/CalculatorTest.java`;
      const newContent = body.textContent; // Get the posted text content

      fs.writeFileSync(filePath, newContent); // Write the new content to the file

      return 'File updated successfully';
    } catch (error) {
      throw new Error('Unable to update the file');
    }
  }
}
