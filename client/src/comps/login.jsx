import React, { useState } from 'react';
import './login.css';
import { registerUser, loginUser } from '../useGetAxios';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const navigate = useNavigate();
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);
    const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '', phone: '', phone_other: '' });
    const [signInData, setSignInData] = useState({ email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // --- פונקציות ולידציה ---
    const isValidEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email.toLowerCase());
    };

    const isValidPhone = (phone) => {
        const re = /^0[2-9]\d{7,8}$/;
        return re.test(phone);
    };

    // --- פונקציות טיפול באירועים ---
    const handleSignUp = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setLoading(true);

        if (!isValidEmail(signUpData.email)) {
            setErrorMessage('מייל לא תקין');
            setLoading(false);
            return;
        }

        if (!isValidPhone(signUpData.phone)) {
            setErrorMessage('מספר טלפון לא תקין');
            setLoading(false);
            return;
        }

        if (signUpData.phone_other && !isValidPhone(signUpData.phone_other)) {
            setErrorMessage('מספר טלפון נוסף לא תקין');
            setLoading(false);
            return;
        }

        try {
            const response = await registerUser(signUpData);
            const token = response?.data?.token;
            const advertiser = response?.data?.advertiser;

            if (token && advertiser) {
                localStorage.setItem('Authorization', token);
                localStorage.setItem('user', JSON.stringify(advertiser));
                navigate('/addApartment');
            } else {
                setErrorMessage('ההרשמה נכשלה');
            }
        } catch (error) {
            setErrorMessage('שגיאה במהלך ההרשמה');
            console.error(error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setLoading(true);

        if (!isValidEmail(signInData.email)) {
            setErrorMessage('מייל לא תקין');
            setLoading(false);
            return;
        }

        try {
            const response = await loginUser(signInData);
            const token = response?.data?.token;
            const advertiser = response?.data?.advertiser;

            if (token && advertiser) {
                localStorage.setItem('Authorization', token);
                localStorage.setItem('user', JSON.stringify(advertiser));
                navigate('/');
            } else {
                setErrorMessage('הכניסה נכשלה');
            }
        } catch (error) {
            setErrorMessage('שגיאה במהלך הכניסה');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-form">
            <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`}>
                <div className="form-container sign-up-container">
                    <form onSubmit={handleSignUp}>
                        <h1>הרשמה</h1>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <input
                            type="text" placeholder="שם"
                            value={signUpData.name}
                            onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                        />
                        <input
                            type="email" placeholder="מייל"
                            value={signUpData.email}
                            onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        />
                        <input
                            type="password" placeholder="קוד"
                            value={signUpData.password}
                            onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        />
                        <input
                            type="tel" placeholder="טלפון"
                            value={signUpData.phone}
                            onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                        />
                        <input
                            type="tel"
                            placeholder="טלפון נוסף"
                            value={signUpData.phone_other}
                            onChange={(e) =>
                                setSignUpData({ ...signUpData, phone_other: e.target.value })
                            }
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? 'מרשם...' : 'הרשמה'}
                        </button>
                    </form>
                </div>

                <div className="form-container sign-in-container">
                    <form onSubmit={handleSignIn}>
                        <h1>כניסה</h1>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <input
                            type="email" placeholder="מייל"
                            value={signInData.email}
                            onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                        />
                        <input
                            type="password" placeholder="סיסמא"
                            value={signInData.password}
                            onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? 'מתחבר...' : 'כניסה'}
                        </button>
                    </form>
                </div>

                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>ברוך שובך!</h1>
                            <p>התחבר עם הסיסמא האישית שלך</p>
                            <button className="ghost" onClick={() => setIsRightPanelActive(false)} disabled={loading}>
                                היכנס
                            </button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>שלום וברוך הבא!</h1>
                            <p>הכניסו פרטים אישיים והתחילו לפרסם</p>
                            <button className="ghost" onClick={() => setIsRightPanelActive(true)} disabled={loading}>
                                הירשם
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
