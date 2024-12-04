//터미널 -> express모듈 설치
//npm i -D nodemon = 코드를 수정하면 자동으로 서버를 껏다켜주는 라이브러리

//예전 문법 commonjs 모듈
//요즘 문법 es모듈(성능차이), express가 아직 es모듈로 작성했을때는 올바르게 동작하지 않는 경우가 있음

//import express from 'express';
const express = require('express');
const app = express();//app에 express모듈을 연결
//.env파일에 있는 환경변수를 실행중인 프로그램의 env객체 안에 넣는 방법으로 dotenv라이브러리를 활용합니다.
const dotenv = require('dotenv');
//dotenv.config()함수를 사용하면 기본적으로 .env안에 있는 변수들을 process.env안에 만들어 줍니다.
dotenv.config({path: '.env'});

const port = 80; //사용할 포트 번호(같은 컴퓨터안에서 실행되고 있는 서버(프로그램)들을 구분하기 위한 번호)

//mysql라이브러리를 연결, 비동기 처리를 위해 promise를 명시해 줘야 한다
const mysql = require('mysql2/promise');
//bcrypt 연결
const bcrypt = require('bcrypt');
//jwt 연결
const jwt = require('jsonwebtoken');
//jwt.sign({payload{데이터가 들어가야하는 부분},'tokenkey',{언제까지 유효한지 설정가능})

//mysql설정
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

//bodyParser는 express모듈에 내장되어있으니 바로 사용가능
app.use(express.json());

//api/login경로로 post요청이 들어오면 콜백함수가 실행
app.post('/api/login', async (req, res) => {
  const {email, password} = req.body; //클라이언트가 보낸 요청의 body에서 email과 password를 추출합니다.
  try{
    //주어진 이메일에 해당하는 사용자의 이메일과 비밀번호를 데이터베이스에서 선택합니다.
    let sql = `SELECT email, pw FROM tbl_users WHERE email = ?`;
    //rows에는 결과 행(실제 데이터)이 담기고, fields는 메타데이터 입니다.
    const [rows, fields] = await pool.query(sql, [email]);
    //console.log(rows)

    //사용자가 로그인할때 입력한 일반비밀번호랑 암호화되어 저장된 비밀번호랑 서로 같은지 .compareSync()를 사용하여 비교합니다.
    if(!bcrypt.compareSync(password, rows[0].pw)){//비밀번호가 일치하는 확인
      //이메일은 맞지만 비밀번호가 틀렸을때 실행
      res.status(404).json('로그인 실패')
      return;
    }
    //코드가 여기까지 실행됬다면 로그인이 성공
    //jwt 토큰 만들기
    //payload에는 {email:'로그인한 사용자의 이메일'}
    //비밀키 = 'secret'
    //1시간짜리 유효한 토큰으로 만들기
    const accessToken = jwt.sign({email: rows[0].email}, 'secret', {expiresIn: '1h'});
    console.log(accessToken)
    res.json({accessToken});//만든 토큰을 객체에 담아서 리액트로 전달(login.js로)
  }catch(err){
    res.status(500).json('mysql에서 오류 발생')
  }
});

//회원 추가(비동기로 변경)
app.post('/api/users', async (req, res) => {
  console.log(req.body);//req에 body안에 요청정보가 들어있음

  //sql쿼리문 분리
  const sql = `INSERT INTO tbl_users
    (email, pw, question, answer) 
    VALUES (?, ?, ?, ?)`;

  //비구조화 할당으로 요청 body로 전달된 데이터를 변수에 할당
  let { email, password, question, answer } = req.body;

  //비밀번호 암호화
  let enpw = bcrypt.hashSync(password, 10);//10번에 걸쳐서 암호화한다. 10보다 많이 할수 있지만 느려질수있다(10이면 충분하다)

  try{
    let [result, fields] = await pool.query(sql, [email, enpw, question, answer]);
    console.log(result)//데이터베이스에 삽입된 행에 대한 정보
    console.log(fields);//결과와 관련된 필드 정보
    res.json('성공이야~!!');//클라이언트에 성공 메시지를 json형식으로 반환한다
  } catch (err) {
    //아이디가 컬럼의 최대 허용 용량을 벗어났다 (1406)
    if(err.errno === 1406){
      //객체에 담어서 에러메시지를 보내줌
      res.status(400).json({errCode: 1, errMsg:"아이디가 너무 길어요"});
    }else if(err.errno === 1062){//중복된 아이디가 존재한다(1062)
      res.status(400).json({errCode: 2, errMsg:"중복된 아이디가 존재합니다"});
    }else{// 그외 에러
      res.status(400).json({errCode: 3, errMsg:"알수없는 에러가 발생했습니다"});
    }
  }
});

// '/api/loggedInEmail' 엔드포인트 처리, token을 전달받아서 로그인한 사람의 email주소를 되돌려주는 api
app.get('/api/loggedInEmail', (req, res) => {
  //리액트로 부터 전달받은 토큰이 정상적인지 확인,
  //정상적이지 않으면 오류로 응답, 정상적이면 email주소로 응답
  //토큰은 요청 header의 Authorization에 Bearer 토큰값
  // console.log(req.headers.authorization)

  //문자열로 받음(앞에 Bearer 빠지고 순수 토큰 만 token에 할당)
  const token = req.headers.authorization.replace('Bearer ','')
  // console.log(token)

  try{
    //jwt의 verify함수로 첫번째 인자는 토큰값, 두번째 인자는 시크릿코드를 전달 => 데이터베이스의 해당 회원정보로 접근할 수 있음
    let result = jwt.verify(token, 'secret')
    //console.log(result)
    res.send(result.email);//로그인한 회원의 이메일 정보를 react로 반환
  }catch(err){
    console.log(err);
    res.status(403).json('오류발생!')
  }
})

//:email이라고 쓰면 email이라는 변수로 사용가능(동적 요청)
app.get('/api/users/:email', async (req, res) => {
  console.log(req.params)
  const email = req.params.email;//파라미터로 전달받은 이메일을 변수에 할당

  let sql = `SELECT email, 
    DATE_FORMAT(created_date, '%Y년 %m월 %d일') created_date,
    DATE_FORMAT(updated_date, '%Y년 %m월 %d일') updated_date 
    FROM tbl_users
    WHERE email = ?`;
  try{
    //파라미터로 전달받은 이메일로 해당 유저의 이메일정보와 회원가입 날짜와 정보수정 날짜를 rows로 할당
    let [rows, fields] = await pool.query(sql, [email])
    res.json(rows[0]);//해당 정보를 react로 반환
  }catch(err){
    res.status(500).json('서보 오류 발생');
  }
})

//경력 요청
app.get('/api/career', async (req, res) => {
  try{
    let sql = `SELECT id, 
    email, 
    company, 
    position,
    DATE_FORMAT(start_date, '%Y년 %m월 %d일') start_date,
    DATE_FORMAT(end_date, '%Y년 %m월 %d일') end_date
    FROM tbl_careers`;
    //mysql가서 career리스트를 받아서 변수에 할당
    let [results, fields] = await pool.query(sql);
    //리액트한테 받아온 배열 응답하기
    res.json(results);
  }catch(err){
    console.log(err);
    res.status(500).json('서버쪽 오류 발생')
  }
});

//경력 추가
app.post('/api/career', async (req, res) => {
  //비구조할당으로 req.body로 받아온 데이터를 변수로 분해하여 할당
  const {company, position, startDate, endDate} = req.body;
  console.log(req.body)
  let sql =`INSERT INTO tbl_careers (email, company, position, start_date, end_date) 
  VALUES
  (
    'test@test.com',
    ?,
    ?,
    STR_TO_DATE(?, '%Y-%m-%d'),
    ${endDate === '' ? null : `STR_TO_DATE(?, '%Y-%m-%d')`}
  )`;//endDate는 값이 없을 경우 null을 전달해야 오류가 발생하지 않는다
  
  let values = [company, position, startDate];//받아온 데이터를 배열로 묶어줍니다
  if(endDate !== ''){
    values.push(endDate);//endDate는 값이 있을경우에만 배열에 추가
  }
  //console.log(values)
  try{
    //생성한 sql에 values값을 대입하여 sql쿼리를 데이터베이스로 전달
    let [results] = await pool.query(sql, values)
    //console.log(results)
    let [rows] = await pool.query('SELECT * FROM tbl_careers WHERE id=?', [results.insertId]);//results.insertId = 해당 게시글의 id값
    console.log(rows)//추가한 게시글을 콘솔에 출력
    //추가되는 커리어 정보는 배열에 담겨지므로 배열안의 객체만 전달하려면 해당 객체만 선택해야함
    res.json(rows[0]);
    
  }catch(err){//실패시
    console.log(err);
    res.status(500).json('서버에서 오류 발생함')
  }
})

//경력 삭제
app.delete('/api/career', async (req, res) => {
  const {id} = req.body;//react에서 받아온 body
  //삭제할 행 id는 id에 들어있음
  console.log(id)
  //데이터를 삭제하는 쿼리
  let sql = `DELETE FROM tbl_careers WHERE id=?`;

  try {
    await pool.query(sql, [id]); //해당 id값으로 데이터를 삭제
    res.json('삭제 완료!')
  } catch (err) {
    res.status(500).json('서버에서 오류 발생함');
  }
})

//모든 사원 조회
app.get('/emp',(req, res) => {
  //mysql에서 emp테이블의 모든 데이터(행,컬럼)를 조회
  pool.query('SELECT * FROM emp', (err, rows, fields) => {
    console.log(rows); //우리가 필요한 데이터
    console.log(fields); //메타 정보(거의 쓸일 없음)
    res.json(rows); //응답할래, json형태로 rows(데이터)를 넣어서
  })
})

// /는 경로를 의미
// 앞에 있는 req는 요청객체, res는 응답객체
// 함수안에 res는 응답객체, send는 응답객체의 메소드
app.get('/api', (req, res) => {
  //데이터베이스 가서 조회해줘
  //데이터베이스에서 가져온 데이터를 클라이언트에게 보내줌(이때 사용하는것이 res객체)
  res.send("Hello World!")
})

app.listen(port, () => {
  console.log(`서버가 구동 되었습니다 http://localhost:${port}`)
})
//listen함수 실행
//1.인자(두개) = 앞에는 숫자타입, 뒤에는 함수타입
//2. 동작 = 해당 프로그램이 앞쪽에 전달받은 숫자 포트에서 동작하게 만드는 함수.
//뒤쪽에 인자로 전달한 함수는 프로그램이 실행되었을때 최초 한번 실행되는 함수
//3. 결과값