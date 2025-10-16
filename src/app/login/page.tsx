'use client';

import { useState } from 'react';
import { useAuth } from '@/core/hooks/useAuth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            setError('Email dan password harus diisi');
            return;
        }

        setError('');
        setLoading(true);
        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Login gagal');
            }
        } finally {
            setLoading(false);
        }
    };
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleLogin();
    };
  return (
    <div className="auth-main">
      <div className="auth-wrapper v2">
        <div className="auth-sidecontent">
          <Image width={500} height={100} src="/images/authentication/img-auth-sideimg.jpg" alt="images" className="img-fluid img-auth-side" />
        </div>
        <div className="auth-form">
          <div className="card my-5">
            <div className="card-body">
              <div className="text-center">
                <a href="#"><Image width={100} height={20} src="/images/logo-dark.svg" alt="img" /></a>
                <div className="d-grid my-3">
                  <button type="button" className="btn mt-2 btn-light-primary bg-light text-muted">
                    <Image width={10} height={10} src="/images/authentication/facebook.svg" alt="img" /> <span> Sign In with Facebook</span>
                  </button>
                  <button type="button" className="btn mt-2 btn-light-primary bg-light text-muted">
                    <Image width={10} height={10} src="/images/authentication/twitter.svg" alt="img" /> <span> Sign In with Twitter</span>
                  </button>
                  <button type="button" className="btn mt-2 btn-light-primary bg-light text-muted">
                    <Image width={10} height={10} src="/images/authentication/google.svg" alt="img" /> <span> Sign In with Google</span>
                  </button>
                </div>
              </div>
              <div className="saprator my-3">
                <span>OR</span>
              </div>
              <form onSubmit={handleSubmit}>
                <h4 className="text-center f-w-500 mb-3">Login with your email</h4>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-danger">{error}</p>}
                <div className="d-flex mt-1 justify-content-between align-items-center">
                  <div className="form-check">
                    <input className="form-check-input input-primary" type="checkbox" id="customCheckc1"/>
                    <label className="form-check-label text-muted">Remember me?</label>
                  </div>
                  <h6 className="text-secondary f-w-400 mb-0">
                    <a href="forgot-password-v2.html"> Forgot Password? </a>
                  </h6>
                </div>
                <div className="d-grid mt-4">
                  <button
                    type='submit'
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </div>
              </form>
              <div className="d-flex justify-content-between align-items-end mt-4">
                <h6 className="f-w-500 mb-0">Don&apos;t have an Account?</h6>
                <a href="register-v2.html" className="link-primary">Create Account</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
