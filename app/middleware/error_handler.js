module.exports = (option, app) => {
    return async function errorHandler(ctx, next) {
        try {
            await next();

            if (ctx.status === 404 && !ctx.body) {
                ctx.body = {
                    msg: "fail",
                    data: '404'
                }
            }
        } catch (err) {
            // 记录一条错误日志
            app.emit('error', err, ctx);

            const status = err.status || 500;

            // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
            let error = status === 500 && app.config.env === 'prod'
                ? 'Internal Server Error'
                : err.message;

            if (status === 422 && error === 'Validation Failed') {
                if (err.errors && Array.isArray(err.errors)) {
                    error = err.errors[0].err[0] ? err.errors[0].err[0] : '参数错误'
                }
            }

            ctx.body = {
                msg: "fail",
                data: error
            };

            ctx.status = status;
        }
    }
}