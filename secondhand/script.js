document.addEventListener('DOMContentLoaded', () => {
    emailjs.init('OH0LoS0WeYIjlxych');

    let generatedCode = '';

    const signupBtn = document.getElementById('signup-btn');
    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            const name = document.getElementById('user-name').value.trim();
            const email = document.getElementById('user-email').value.trim();
            const userId = document.getElementById('user-id').value.trim();
            const password = document.getElementById('user-password').value.trim();
            const confirmPassword = document.getElementById('confirm-password').value.trim();
            const campus = document.getElementById('user-campus').value;

            if (!email.endsWith('@g.skku.edu')) {
                alert('학교 이메일(@g.skku.edu)만 사용 가능합니다.');
                return;
            }
            if (!name || !email || !userId || !password || !campus) {
                alert('모든 필드를 입력해주세요.');
                return;
            }
            if (password.length < 8) {
                alert('비밀번호는 최소 8자 이상이어야 합니다.');
                return;
            }
            if (!/^[a-zA-Z0-9]+$/.test(userId)) {
                alert('ID는 영어와 숫자로만 구성되어야 합니다.');
                return;
            }
            if (password !== confirmPassword) {
                alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
                return;
            }

            const existingUser = JSON.parse(localStorage.getItem('user'));
            if (existingUser && existingUser.id === userId) {
                alert('이미 사용 중인 ID입니다. 다른 ID를 선택해주세요.');
                return;
            }

            generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

            emailjs.send('service_i21m3w7', 'template_6v67zai', {
                to_email: email,
                to_name: name,
                verification_code: generatedCode,
            })
                .then(() => {
                    alert('인증 메일이 발송되었습니다. 확인해 주세요.');
                    document.getElementById('verification-section').style.display = 'block';
                })
                .catch((error) => {
                    console.error('Failed to send email:', error);
                    alert('인증메일 발송 실패. 다시 시도해 주세요.');
                });
        });
    }

    const verifyBtn = document.getElementById('verify-btn');
    if (verifyBtn) {
        verifyBtn.addEventListener('click', () => {
            const enteredCode = document.getElementById('verification-code').value.trim();

            if (enteredCode === generatedCode) {
                alert('이메일 인증을 성공하였습니다! 계정이 생성되었습니다.');
                const user = {
                    name: document.getElementById('user-name').value.trim(),
                    email: document.getElementById('user-email').value.trim(),
                    id: document.getElementById('user-id').value.trim(),
                    password: document.getElementById('user-password').value.trim(),
                    campus: document.getElementById('user-campus').value,
                };
                localStorage.setItem('user', JSON.stringify(user));
                window.location.href = 'index.html';
            } else {
                alert('인증코드가 틀립니다. 다시 시도해 주세요.');
            }
        });
    }

    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const enteredUserId = document.getElementById('user-id').value.trim();
            const enteredPassword = document.getElementById('user-password').value.trim();
            const storedUser = JSON.parse(localStorage.getItem('user'));

            if (!storedUser || storedUser.id !== enteredUserId || storedUser.password !== enteredPassword) {
                alert('아이디 또는 비밀번호가 올바르지 않습니다.');
                return;
            }

            alert('로그인 성공!');
            window.location.href = 'main.html';
        });
    }

    const findIdBtn = document.getElementById('find-id-btn');
    if (findIdBtn) {
        findIdBtn.addEventListener('click', () => {
            const emailPrefix = document.getElementById('find-email-prefix').value.trim();
            const fullEmail = emailPrefix + '@g.skku.edu';
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const resultDiv = document.getElementById('id-result');
            const resultMessage = document.getElementById('result-message');

            if (!emailPrefix) {
                resultMessage.textContent = '이메일을 입력해주세요.';
                resultMessage.style.color = 'red';
                resultDiv.style.display = 'block';
                return;
            }

            if (!storedUser || storedUser.email !== fullEmail) {
                resultMessage.textContent = '사용자 정보가 없습니다.';
                resultMessage.style.color = 'red';
                resultDiv.style.display = 'block';
            } else {
                resultMessage.textContent = `Your ID is: ${storedUser.id}`;
                resultMessage.style.color = 'green';
                resultDiv.style.display = 'block';
            }
        });
    }

    const findPasswordBtn = document.getElementById('find-password-btn');
    if (findPasswordBtn) {
        findPasswordBtn.addEventListener('click', () => {
            const enteredId = document.getElementById('find-id').value.trim();
            const emailPrefix = document.getElementById('find-email-prefix').value.trim();
            const fullEmail = emailPrefix + '@g.skku.edu';
            const storedUser = JSON.parse(localStorage.getItem('user'));

            if (!storedUser || storedUser.id !== enteredId || storedUser.email !== fullEmail) {
                alert('등록된 정보와 일치하는 사용자가 없습니다.');
                return;
            }

            const maskedPassword = storedUser.password.substring(0, 3) + '*'.repeat(storedUser.password.length - 3);

            emailjs.send('service_i21m3w7', 'template_y6nkphb', {
                to_email: fullEmail,
                to_name: storedUser.name,
                masked_password: maskedPassword,
            })
                .then(() => {
                    alert('비밀번호 정보가 이메일로 발송되었습니다. 확인해주세요.');
                })
                .catch((error) => {
                    console.error('Failed to send email:', error);
                    alert('비밀번호 정보 보내기 실패. 다시 시도해 주세요.');
                });
        });
    }
});
