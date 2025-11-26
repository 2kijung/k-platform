import React, { useState } from 'react';
import './Login.scss';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch (e) {
        // JSON 파싱 실패 시 빈 객체로 처리
      }

      if (res.ok) {
        console.log('로그인 성공:', data);
        localStorage.setItem('token', data.token);
        navigate('/home');
      } else {
        alert(`로그인 실패: ${data.message || '아이디 또는 비밀번호가 틀렸습니다.'}`);
      }
    } catch (err) {
      console.error(err);
      alert('서버 연결 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login ${loading ? 'loading' : ''}`}>
      <div className="form">
        <h2>Hello User</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="login-mail"><i className="fa fa-user"></i></label>
            <input
              id="login-mail"
              type="email"
              name="mail"
              placeholder="E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <svg><use href="#svg-check" /></svg>
          </div>

          <div className="form-field">
            <label htmlFor="login-password"><i className="fa fa-lock"></i></label>
            <input
              id="login-password"
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <svg><use href="#svg-check" /></svg>
          </div>

          <button type="submit" className="button" disabled={loading}>
            <div className="arrow-wrapper">
              <span className="arrow"></span>
            </div>
            <p className="button-text">SIGN IN</p>
          </button>
        </form>
      </div>

      <div className="finished">
        <svg><use href="#svg-check" /></svg>
      </div>
    </div>
  );
};

export default Login;
