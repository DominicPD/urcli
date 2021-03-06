// node modules
import fs from 'fs';
// npm modules
import homedir from 'homedir';

const configFilePath = `${homedir()}/.urcli/config.json`;

class Config {
  constructor() {
    try {
      const config = JSON.parse(fs.readFileSync(configFilePath));
      Object.assign(this, config);
    } catch (e) {
      // We can ignore ENOENT and throw on everything else.
      if (e.code !== 'ENOENT') {
        console.error('Error reading from filesystem.');
        throw new Error(e);
      }
    }
  }
  save() {
    const newConfigs = JSON.stringify(this, null, 2);
    try {
      fs.writeFileSync(configFilePath, newConfigs);
    } catch (e) {
      // We can create both the config folder and file on ENOENT and throw on
      // everything else.
      if (e.code !== 'ENOENT') {
        console.error('Error while saving the config file.');
        throw new Error(e);
      }
      fs.mkdirSync(`${homedir()}/.urcli`);
      fs.writeFileSync(configFilePath, newConfigs);
    }
    return this;
  }
}

export const config = new Config();
