"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../../context/SessionContext';
import '../../style/Login.css';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        operativeId: '',
        teamName: '',
        password: '',
        leaderName: '',
        leaderGender: 'Male',
        member1: '',
        member1Gender: 'Male',
        member2: '',
        member2Gender: 'Male',
        member3: '',
        member3Gender: 'Male'
    });
    const [errors, setErrors] = useState({});
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleGenderChange = (name, gender) => {
        setFormData(prev => ({ ...prev, [name]: gender }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.operativeId) newErrors.operativeId = 'ID_REQUIRED';
        if (!formData.password) newErrors.password = 'PASSWORD_REQUIRED';
        if (!formData.teamName) newErrors.teamName = 'TEAM_UNDEFINED';
        if (!formData.leaderName) newErrors.leaderName = 'LEADER_MISSING';
        if (!formData.member1) newErrors.member1 = 'MEMBER_MISSING';
        if (!formData.member2) newErrors.member2 = 'MEMBER_MISSING';
        if (!formData.member3) newErrors.member3 = 'MEMBER_MISSING';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const router = useRouter();
    const { login, setToken } = useSession();

    const handleLogin = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoggingIn(true);

        // Submit registration to backend
        (async () => {
            try {
                const members = [
                    { fullName: formData.leaderName },
                    { fullName: formData.member1 },
                    { fullName: formData.member2 },
                    { fullName: formData.member3 }
                ];

                const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const res = await fetch(`${apiBase}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ operativeId: formData.operativeId, teamName: formData.teamName, password: formData.password, members })
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.msg || 'Registration failed');

                // Now login to receive auth token
                const loginRes = await fetch(`${apiBase}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ teamName: formData.teamName, password: formData.password })
                });
                const loginData = await loginRes.json();
                if (!loginRes.ok) throw new Error(loginData.msg || 'Login after register failed');

                // Save selection to local storage for the storyline page
                localStorage.setItem('squadData', JSON.stringify(formData));

                // Store token in session context
                setToken(loginData.token);
                login();
                router.push('/storyline');
            } catch (err) {
                setErrors({ form: err.message });
                setIsLoggingIn(false);
            }
        })();
    };

    const ErrorMessage = ({ message }) => (
        <div className="custom-error-bubble">
            <span className="error-icon">!</span>
            <span className="error-text">{message}</span>
        </div>
    );

    const GenderSelection = ({ name, currentGender, role }) => {
        const getImagePath = (gender) => `/characters/characterFace/${gender}-${role}.webp`;

        return (
            <div className="gender-selector">
                <div
                    className={`gender-option ${currentGender === 'Male' ? 'active' : ''}`}
                    onClick={() => handleGenderChange(name, 'Male')}
                    title="MALE_UNIT"
                >
                    <img src={getImagePath('Male')} alt="M" className="gender-preview" />
                    <span className="gender-label">M</span>
                </div>
                <div
                    className={`gender-option ${currentGender === 'Female' ? 'active' : ''}`}
                    onClick={() => handleGenderChange(name, 'Female')}
                    title="FEMALE_UNIT"
                >
                    <img src={getImagePath('Female')} alt="F" className="gender-preview" />
                    <span className="gender-label">F</span>
                </div>
            </div>
        );
    };

    return (
        <div className={`login-wrapper ${isLoggingIn ? 'system-override' : ''}`}>
            <div className="background-fx">
                <div className="scanlines"></div>
                <div className="noise"></div>
            </div>

            <div className="login-panel">
                <div className="panel-decor top-left"></div>
                <div className="panel-decor top-right"></div>
                <div className="panel-decor bottom-left"></div>
                <div className="panel-decor bottom-right"></div>

                <header className="protocol-header">
                    <h1 className="protocol-title glitch-text" data-text="THE OBLIVION PROTOCOL">
                        THE OBLIVION PROTOCOL
                    </h1>
                    <div className="protocol-subtitle">Operational Enrollment</div>
                </header>

                <form className="login-form" onSubmit={handleLogin} noValidate>
                    <div className="input-field-row">
                        <div className="input-group">
                            <label className="input-label">OPERATIVE_ID</label>
                            <div className="input-field-wrapper">
                                <input
                                    type="text"
                                    name="operativeId"
                                    className={`neon-input ${errors.operativeId ? 'input-error' : ''}`}
                                    placeholder="OP-XXXX"
                                    value={formData.operativeId}
                                    onChange={handleInputChange}
                                    autoComplete="off"
                                />
                                {errors.operativeId && <ErrorMessage message={errors.operativeId} />}
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">TEAM_NAME</label>
                            <div className="input-field-wrapper">
                                <input
                                    type="text"
                                    name="teamName"
                                    className={`neon-input ${errors.teamName ? 'input-error' : ''}`}
                                    placeholder="SQUAD_ALPHA"
                                    value={formData.teamName}
                                    onChange={handleInputChange}
                                    autoComplete="off"
                                />
                                {errors.teamName && <ErrorMessage message={errors.teamName} />}
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="input-label">TEAM_PASSWORD</label>
                            <div className="input-field-wrapper">
                                <input
                                    type="password"
                                    name="password"
                                    className={`neon-input ${errors.password ? 'input-error' : ''}`}
                                    placeholder="Choose a team password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                                {errors.password && <ErrorMessage message={errors.password} />}
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">TEAM_LEADER / REPRESENTATIVE</label>
                        <div className="input-field-wrapper leader-input-wrapper">
                            <input
                                type="text"
                                name="leaderName"
                                className={`neon-input ${errors.leaderName ? 'input-error' : ''}`}
                                placeholder="FULL NAME"
                                value={formData.leaderName}
                                onChange={handleInputChange}
                                autoComplete="off"
                            />
                            <GenderSelection
                                name="leaderGender"
                                currentGender={formData.leaderGender}
                                role="TeamLeader"
                            />
                            {errors.leaderName && <ErrorMessage message={errors.leaderName} />}
                        </div>
                    </div>

                    <div className="team-members-grid">
                        <div className="input-group">
                            <label className="input-label">MEMBER_01</label>
                            <div className="input-field-wrapper member-input-wrapper">
                                <input
                                    type="text"
                                    name="member1"
                                    className={`neon-input ${errors.member1 ? 'input-error' : ''}`}
                                    placeholder="NAME"
                                    value={formData.member1}
                                    onChange={handleInputChange}
                                />
                                <GenderSelection
                                    name="member1Gender"
                                    currentGender={formData.member1Gender}
                                    role="Member01"
                                />
                                {errors.member1 && <ErrorMessage message={errors.member1} />}
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="input-label">MEMBER_02</label>
                            <div className="input-field-wrapper member-input-wrapper">
                                <input
                                    type="text"
                                    name="member2"
                                    className={`neon-input ${errors.member2 ? 'input-error' : ''}`}
                                    placeholder="NAME"
                                    value={formData.member2}
                                    onChange={handleInputChange}
                                />
                                <GenderSelection
                                    name="member2Gender"
                                    currentGender={formData.member2Gender}
                                    role="Member02"
                                />
                                {errors.member2 && <ErrorMessage message={errors.member2} />}
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="input-label">MEMBER_03</label>
                            <div className="input-field-wrapper member-input-wrapper">
                                <input
                                    type="text"
                                    name="member3"
                                    className={`neon-input ${errors.member3 ? 'input-error' : ''}`}
                                    placeholder="NAME"
                                    value={formData.member3}
                                    onChange={handleInputChange}
                                />
                                <GenderSelection
                                    name="member3Gender"
                                    currentGender={formData.member3Gender}
                                    role="Member03"
                                />
                                {errors.member3 && <ErrorMessage message={errors.member3} />}
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="initiate-btn" disabled={isLoggingIn}>
                        <span className="btn-glitch-layer"></span>
                        {isLoggingIn ? 'INITIALIZING_STREAM...' : 'ENTER TO THE GAME'}
                    </button>
                </form>

                <footer className="status-footer">
                    <span>SECURE_NODE: AF-99</span>
                    <span>LATENCY: 12ms</span>
                </footer>
            </div>
        </div>
    );
}
