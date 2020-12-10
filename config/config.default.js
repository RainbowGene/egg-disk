/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1607514150649_4930';

  // add your middleware config here
  config.middleware = ['errorHandler', 'auth'];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  // 需要auth中间件来判断的路由
  config.auth = {
    match: [
      '/logout',
      '/upload',
      '/getSize',
      '/file',
      '/share'
    ]
  };

  config.security = {
    // 关闭 csrf
    csrf: {
      enable: false,
    },
    // 跨域白名单
    domainWhiteList: ['http://localhost:3000'],
  };

  // 允许跨域的方法
  config.cors = {
    origin: '*',
    allowMethods: 'GET, PUT, POST, DELETE, PATCH'
  };

  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    username: "root",
    password: 'H9MvYSqY3JmAC4aj',
    port: 3306,
    database: 'egg-weidisk',
    // 中国时区
    timezone: '+08:00',
    define: {
      // 取消数据表名复数
      freezeTableName: true,
      // 自动写入时间戳 created_at updated_at
      timestamps: true,
      // 字段生成软删除时间戳 deleted_at
      // paranoid: true,
      createdAt: 'created_time',
      updatedAt: 'updated_time',
      // deletedAt: 'deleted_time',
      // 所有驼峰命名格式化
      underscored: true
    }
  };

  config.valparams = {
    locale: 'zh-cn',
    throwError: true
  };

  config.crypto = {
    secret: 'qhdgw@45ncashdaksh2!#@3nxjdas*_672'
  };

  exports.jwt = {
    secret: 'qhdgw@45ncashdaksh2!#@3nxjdas*_672'
  };

  config.redis = {
    client: {
      port: 6379,          // Redis port
      host: '127.0.0.1',   // Redis host
      password: '',
      db: 3,
    },
  };

  config.oss = {
    client: {
      accessKeyId: '**',
      accessKeySecret: '**',
      bucket: '**',
      endpoint: '**',
      timeout: '60s',
    },
  };

  // 上传格式和大小限制
  config.multipart = {
    // fileSize: '50mb',
    fileSize: 1048576000,
    // mode: 'stream',
    mode: "file",
    fileExtensions: [
      // images
      '.jpg', '.jpeg', // image/jpeg
      '.png', // image/png, image/x-png
      '.gif', // image/gif
      '.bmp', // image/bmp
      '.wbmp', // image/vnd.wap.wbmp
      '.webp',
      '.tif',
      '.psd',
      // text
      '.svg',
      '.js', '.jsx',
      '.json',
      '.css', '.less',
      '.html', '.htm',
      '.xml',
      // tar
      '.zip',
      '.gz', '.tgz', '.gzip',
      // video
      '.mp3',
      '.mp4',
      '.avi',
    ],
  };

  return {
    ...config,
    ...userConfig,
  };
};
