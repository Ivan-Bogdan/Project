import React, { useState } from 'react';
import Layout from '../core/Layout';
import { Redirect, Link } from 'react-router-dom';
import { signin, authenticate, isAuthenticated } from '../auth';

const Signin = () => {

    const [values, setValues] = useState({
        email: '',
        password: '',
        error: '',
        loading: false,
        redirectToRefer: false
    });

    const { email, password, loading, error, redirectToRefer } = values;
    const { user } = isAuthenticated();

    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value })
    }


    const handleSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: false, loading: true })
        signin({ email, password })
            .then(data => {
                if (data.error) {
                    setValues({ ...values, error: data.error, loading: false });
                } else {
                    authenticate(data, () => {
                        setValues({
                            ...values,
                            redirectToReferrer: true
                        });
                    });
                }
            });
    };

    const signInForm = () => (
        <>
        <form>

            <div className="form-group">
                <label className="text-muted">Логин</label>
                <input onChange={handleChange('email')} type='email' className="form-control" value={email} required />
            </div>
            <div className="form-group">
                <label className="text-muted">Пароль</label>
                <input onChange={handleChange('password')} type='password' className="form-control" value={password} required />
            </div>
            <button onClick={handleSubmit} type='submit' className="btn btn-primary">Войти</button>
            <hr/>
            <div className='form-group'>
        <label className="text-muted">Уже зарегистрированы?</label> 
        <Link to='/signup' > Войти</Link>
        </div>

        </form>
        
        </>
    );

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }} > {error}</div>
    )

    const showLoading = () => (
        loading && (<div className="alert alert-info"> <h2>Loading..</h2> </div>)
    );

    const redirectUser = () => {
        if (redirectToRefer) {
            if (user && user.role === 1) {
                return <Redirect to="/admin/dashboard" />;
            } else {
                return <Redirect to="/user/dashboard" />;
            }
        }
        if (isAuthenticated()) {
            return <Redirect to="/" />;
        }
    };

    return (
        <Layout title='Вход в кабинет' description="" className='container col-md-8 offset-md-2'>
            {showLoading()}
            {showError()}
            {signInForm()}
            {redirectUser()}

        </Layout>
    )

}

export default Signin;