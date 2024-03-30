import { Injectable } from '@nestjs/common';
import { CreateGithubDto } from './dto/create-github.dto';
import { UpdateGithubDto } from './dto/update-github.dto';
import { Octokit } from '@octokit/rest';
import simpleGit from 'simple-git';
import * as AdmZip from 'adm-zip'
import * as path from 'path';
const { execSync } = require('child_process');
const fs = require('fs');

@Injectable()
export class GithubService {

  private octokit: Octokit;

  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    })
  }

  // src/github/github.service.ts

  async createRepository(name: string, description: string): Promise<string> {
    try {
      // Existing code to create repository
      const response = await this.octokit.repos.createForAuthenticatedUser({
        name,
        description,
      });

      return response.data.clone_url;
    } catch (error) {
      if (error.status === 422 && error.response.data.message === "name already exists on this account") {
        console.log(`Repository with name '${name}' already exists.`);
        // Handle accordingly, e.g., return the existing repository URL
        return `https://github.com/your-username/${name}`;
      } else {
        // Re-throw the error for other cases
        throw error;
      }
    }
  }


  async extractCodeProject(rarFilePath: string, destinationPath: string): Promise<void> {
    try {
      const zip = new AdmZip(rarFilePath);
      zip.extractAllTo(destinationPath, /*overwrite*/ true);

      console.log('Code project extracted successfully.');
    } catch (error) {
      console.error('Error extracting code project:', error);
      throw error;
    }
  }

  async pushCodeToRepository(repoCloneUrl: string, codePath: string): Promise<void> {
    const git = simpleGit(codePath)

    await git.init();
    await git.add('./*');
    await git.commit('Initial commit');
    await git.addRemote('origin', repoCloneUrl)
    await git.push('origin', 'main', ['-u', 'origin/main'])
  }

  async doesRepositoryExist(name: string): Promise<boolean> {
    try {
      // Implementation to check if a repository exists on GitHub
      await this.octokit.repos.get({
        owner: 'gabrieldocs',
        repo: name,
      });
      return true;
    } catch (error) {
      if (error.status === 404) {
        // Repository not found, return false
        return false;
      }
      throw error; // Re-throw other errors 
    }
  }

  create(createGithubDto: CreateGithubDto) {
    return 'This action adds a new github';
  }

  findAll() {
    return `This action returns all github`;
  }

  findOne(id: number) {
    return `This action returns a #${id} github`;
  }

  update(id: number, updateGithubDto: UpdateGithubDto) {
    return `This action updates a #${id} github`;
  }

  remove(id: number) {
    return `This action removes a #${id} github`;
  }

  initializeGit(directory, remoteUrl) {
    try {
      // Ensure the directory exists
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }

      // Change to the specified directory
      process.chdir(directory);

      // Check if the directory is already a Git repository
      if (!fs.existsSync(path.join(directory, '.git'))) {
        // Initialize Git repository
        execSync('git init');

        // Add a remote origin
        execSync(`git remote add origin ${remoteUrl}`);

        console.log(`Git initialized in '${directory}' with remote origin set to '${remoteUrl}'.`);
      } else {
        console.error(`Directory '${directory}' is already a Git repository.`);
      }
    } catch (error) {
      console.error('Error initializing Git repository:', error.message);
    }
  }

  commitAndPushWithoutToken(directory, commitMessage) {
    try {
      // Change to the specified directory
      process.chdir(directory);

      // Add all files and create a commit
      execSync('git add .');
      execSync(`git commit -m "${commitMessage}"`);

      // Push to the remote origin
      execSync('git push origin master');

      console.log(`Committed and pushed to the remote origin in '${directory}'.`);
    } catch (error) {
      console.error('Error committing and pushing:', error.message);
    }
  }

  writeFileToTheDirectory( path: string, directory: string, content: string, commit_message: string): void {
    fs.writeFile(path, content, (err) => {
      if(err) {
        console.error('Error writing file to filepath')
      } else {
        console.log('Content successfully updated')
        this.commitAndPush(directory, commit_message)
      }
    })

  }

  commitAndPush(directory: string, commitMessage: string) {
    try {
      // Change to the specified directory
      process.chdir(directory);

      // Add all files and create a commit
      execSync(`git add .`);
      execSync(`git commit -m "${commitMessage}"`);

      // Read GitHub token from .env file
      const githubToken = process.env.GITHUB_TOKEN;

      // Push to the remote origin using the token
      execSync(`git push origin master`, {
        env: {
          ...process.env,
          GITHUB_TOKEN: githubToken,
        },
        stdio: 'inherit',
      });

      console.log(`Committed and pushed to the remote origin in '${directory}'.`);
    } catch (error) {
      console.error('Error committing and pushing:', error.message);
    }
  }

  async receiveAndPush(name: string, description: string, rarFilePath: string, destinationPath: string) {
    try {
      const repoCloneUrl = await this.createRepository(name, description);
      console.log('Clone URL:', repoCloneUrl);

      await this.extractCodeProject(rarFilePath, destinationPath);
      this.initializeGit(destinationPath + "/sample", repoCloneUrl);
      this.commitAndPush(destinationPath + "/sample", "Initial commit " + new Date().toLocaleDateString())

      return `Code successfully pushed to the repository at ${repoCloneUrl}`;
    } catch (error) {
      console.error('Error in receiveAndPushCode:', error);
      throw error;
    }
  }
}
