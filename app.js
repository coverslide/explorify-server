#!/usr/bin/env node
const { join } = require('path');
const fs = require('mz/fs');
const Koa = require('koa');
const mount = require('koa-mount');
const cors = require('koa2-cors');
const koaStatic = require('koa-static');
const Yaml = require('js-yaml');
const { browse, dirList, sendFile, download, result } = require('koa-browse');
const { listFiles, extractFile } = require('koa-browse-sevenzip');
const crossOrigin = require('./cross-origin');


(async () => {
  const configFile = await fs.readFile('config.yml');
  const config = Yaml.load(configFile);

  const app = new Koa();
  const files = new Koa();

  files.use(browse({ root: config.root }))
    .use(dirList({
      hideDotFiles: true,
      sort: true,
    }))
    .use(listFiles({ action: 'list', sort: true }))
    .use(extractFile({ action: 'extract' }))
    .use(sendFile())
    .use(download())
    .use(result());

  app.use(cors({ origin: crossOrigin(config['cross-origin']) }));
  app.use(mount('/files', files));
  app.use(mount('/ping', (ctx) => { ctx.body = "1" }));

  app.use(koaStatic(join(__dirname, 'public')));

  app.listen(process.env.PORT || config.port, process.env.HOST || config.host, function onListen() {
    process.stdout.write(`Listening on ${this.address().port}\n`);
  });
})().catch(err => console.error(err.message));
