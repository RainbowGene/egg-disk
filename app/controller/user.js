'use strict';

const Controller = require('egg').Controller;
const crypto = require('crypto')

class HomeController extends Controller {
  // 注册
  async reg() {
    let { ctx, app } = this;
    // 参数验证
    ctx.validate({
      username: {
        type: 'string',
        required: true,
        range: {
          min: 5,
          max: 20
        },
        desc: '用户名'
      },
      password: {
        type: 'string',
        required: true,
        desc: '密码'
      },
      repassword: {
        type: 'string',
        required: true,
        desc: '确认密码'
      }
    }, {
      equals: [
        ['password', 'repassword']
      ]
    });
    let { username, password } = ctx.request.body;
    // 验证用户是否已经存在
    if (await app.model.User.findOne({
      where: {
        username,
      }
    })) {
      ctx.throw(400, '用户名已存在');
    }
    // 创建用户
    let user = await app.model.User.create({
      username,
      password
    });
    if (!user) {
      ctx.throw(400, '创建用户失败');
    }

    user = JSON.parse(JSON.stringify(user)); // 相当一次浅拷贝
    delete user.password;

    ctx.apiSuccess(user);
  }

  async login() {
    const { ctx, app } = this;
    // 参数验证
    ctx.validate({
      username: {
        required: true,
        type: "string",
        desc: "用户名"
      },
      password: {
        required: true,
        type: "string",
        desc: "密码"
      }
    });
    // 获取到数据
    let { username, password } = ctx.request.body;
    // 验证用户是否存在
    let user = await app.model.User.findOne({
      where: {
        username
      }
    });

    if (!user) {
      return ctx.apiFail('当前用户不存在');
    }
    // 验证密码
    this.checkPassword(password, user.password);

    user = JSON.parse(JSON.stringify(user));

    // 生成token
    user.token = ctx.getToken(user);
    delete user.password;

    // 加入缓存中
    if (!await this.service.cache.set('user_' + user.id, user.token)) {
      ctx.throw(400, '登录失败');
    }

    ctx.apiSuccess(user);
  }

  // 验证密码
  checkPassword(password, hash_password) {
    const hmac = crypto.createHash("sha256", this.app.config.crypto.secret);
    hmac.update(password);
    if (hmac.digest("hex") !== hash_password) {
      this.ctx.throw(400, '密码错误');
    }
    return true
  }

  // 退出登录
  async logout() {
    const { ctx, service } = this;
    const currentUserId = ctx.authUser.id;
    if (!await service.cache.remove('user_' + currentUserId)) {
      ctx.throw(400, '退出登录失败');
    }
    ctx.apiSuccess('退出登录成功');
  }

  // 获取剩余容量
  async getSize() {
    const { ctx, service } = this;
    ctx.apiSuccess({
      total_size: ctx.authUser.total_size,
      used_size: ctx.authUser.used_size,
    })
  }
}

module.exports = HomeController;
