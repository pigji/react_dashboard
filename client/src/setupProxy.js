//주소 끝에 /api로 끝나면 서버 포트쪽으로 보내게 설정을 만들어준다
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api', //엔드포인트를 /api로 가면
    createProxyMiddleware(
      {
        target: 'http://localhost:80/api', //localhost:80경로로 가줘라
        changeOrigin:true,
      }
    )
  )
}