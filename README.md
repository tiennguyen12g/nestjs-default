## Initial setup NestJS project
1. Install nestjs in global if it has not installed yet:
```
npm i -g @nestjs/cli
```
2. Create new project:
```
 nest new project-name
```
3. Install dependencies:
```
npm i
```
### 1. Add hot reload
** reference:
```
https://docs.nestjs.com/recipes/hot-reload#installation
```
1. Install
```
npm i --save-dev webpack-node-externals run-script-webpack-plugin webpack
```
2. Create file in root folder:
-- webpack-hmr.config.js
and add this code (Note: change "autoRestart": true)
```
const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');

module.exports = function (options, webpack) {
  return {
    ...options,
    entry: ['webpack/hot/poll?100', options.entry],
    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?100'],
      }),
    ],
    plugins: [
      ...options.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin({
        paths: [/\.js$/, /\.d\.ts$/],
      }),
      new RunScriptWebpackPlugin({ name: options.output.filename, autoRestart: false }),
    ],
  };
};
```
3. Go to main.ts and add:
```
declare const module: any;
```
and 
```
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
```
4. Go to package.json and add:
```
"start:dev": "nest build --webpack --webpackPath webpack-hmr.config.js --watch"
```
### 2. Config .evn
** Reference:
```
https://docs.nestjs.com/techniques/configuration#custom-env-file-path
```
1. Install
```
npm i --save @nestjs/config
```
2. Go to app.module.ts and add:
```
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(
      {isGlobal: true,} // Enable this to use .env for all module
    )
  ],
})
export class AppModule {}
```



## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

##

