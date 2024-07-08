import express, { Request, Response } from "express";
import session from "express-session";
const fileStore = require('session-file-store')(session);

const app = express();
const port = 5001;

// 세션 미들웨어 설정
app.use(
  session({
    secret: "your-secret-key", // 세션 암호화에 사용되는 비밀 키
    resave: false, // 세션이 수정되지 않아도 항상 저장되도록 설정
    saveUninitialized: true, // 초기화되지 않은 세션을 저장할지 여부 설정
    cookie: { secure: true, httpOnly: true, maxAge: 6000 }, // HTTPS를 사용할 경우 true로 설정
    store: new fileStore()
  })
);

// 홈 라우트
app.get("/", (req: Request, res: Response) => {
  // 세션에 방문자 카운트 저장 및 증가
  if (req.session.views) {
    req.session.views++;
  } else {
    req.session.views = 1;
  }

  res.send(req.session);
});

// 로그인 라우트
app.get("/login", (req: Request, res: Response) => {
  req.session.user = { username: "user1" };
  res.send(req.session);
});

// 로그아웃 라우트
app.get("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Failed to log out");
    }
    res.send(req.session);
  });
});

// 인증된 사용자만 접근 가능한 라우트
app.get("/protected", (req: Request, res: Response) => {
  if (req.session.user) {
    res.send(req.session);
  } else {
    res.status(401).send("Unauthorized");
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
