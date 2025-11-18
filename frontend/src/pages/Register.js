import React, { useState } from 'react';
import './Login.scss';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState(''); // ✅ name → username
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const res = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
          });
          

      if (res.ok) {
        alert('회원가입이 완료되었습니다!');
        navigate('/login');
      } else {
        const errorData = await res.json();
        alert(`회원가입 실패: ${errorData.message || '오류 발생'}`);
      }
    } catch (err) {
      console.error(err);
      alert('서버와의 통신 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login ${loading ? 'loading' : ''}`}>
      <div className="form">
        <h2>회원가입</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="register-username"><i className="fa fa-user"></i></label>
            <input
              id="register-username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <svg><use href="#svg-check" /></svg>
          </div>

          <div className="form-field">
            <label htmlFor="register-email"><i className="fa fa-envelope"></i></label>
            <input
              id="register-email"
              type="email"
              placeholder="E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <svg><use href="#svg-check" /></svg>
          </div>

          <div className="form-field">
            <label htmlFor="register-password"><i className="fa fa-lock"></i></label>
            <input
              id="register-password"
              type="password"
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
            <p className="button-text">SIGN UP</p>
          </button>
        </form>
      </div>

      <div className="finished">
        <svg><use href="#svg-check" /></svg>
      </div>
    </div>
  );
};

export default Register;
