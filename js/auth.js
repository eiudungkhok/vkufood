const API_URL = 'http://localhost/vkufood/api';

document.addEventListener('DOMContentLoaded', () => {
    // Tự động kiểm tra và hiển thị form
    if (document.querySelector('.login-page')) {
        const hasToken = localStorage.getItem('user');
        if (hasToken) {
            window.location.href = 'home.html';
        } else {
            showLogin(); // Gọi showLogin để form active
        }
    }
    // Gán các hàm vào window (đã có ở trên, không cần lặp lại)
});

/* ==============================================
   LOGIC CHUYỂN FORM (ĐÃ SỬA LỖI TÀNG HÌNH)
============================================== */
function showLogin(e) {
    if (e) e.preventDefault(); // NGĂN CHẶN NHẢY TRANG
    document.getElementById('login-form').classList.add('active');
    document.getElementById('register-form').classList.remove('active');
    document.getElementById('forgot-form').classList.remove('active');
    clearMessages();
}

function showRegister(e) {
    if (e) e.preventDefault(); // NGĂN CHẶN NHẢY TRANG
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('register-form').classList.add('active');
    document.getElementById('forgot-form').classList.remove('active');
    clearMessages();
}

function showForgot(e) {
    if (e) e.preventDefault(); // NGĂN CHẶN NHẢY TRANG
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('register-form').classList.remove('active');
    document.getElementById('forgot-form').classList.add('active');
    document.getElementById('email-section').style.display = 'block'; 
    document.getElementById('code-section').style.display = 'none';
    clearMessages();
}

function clearMessages() {
    const msgs = document.querySelectorAll('.form-message');
    msgs.forEach(m => m.textContent = '');
}

/* ==============================================
   LOGIC XỬ LÝ ĐĂNG NHẬP (LOGIN)
============================================== */

async function login() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const msgBox = document.getElementById('login-message');

    if (!email || !password) {
        msgBox.textContent = 'Vui lòng nhập đầy đủ email và mật khẩu.';
        msgBox.style.color = 'red';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        });
        
        const result = await response.json();

        if (result.success) {
            localStorage.setItem('user', JSON.stringify(result.user));
            
            msgBox.textContent = result.message;
            msgBox.style.color = 'green';

            // Chuyển hướng sau 1s
            setTimeout(() => {
                if (result.user.role === 'admin') {
                    window.location.href = 'admin.html'; 
                } else {
                    window.location.href = 'home.html';
                }
            }, 1000);
            
        } else {
            msgBox.textContent = result.message;
            msgBox.style.color = 'red';
        }
    } catch (error) {
        console.error("Lỗi kết nối Server:", error);
        msgBox.textContent = 'Lỗi kết nối đến máy chủ. Vui lòng kiểm tra XAMPP.';
        msgBox.style.color = 'red';
    }
}


/* ==============================================
   LOGIC XỬ LÝ ĐĂNG KÝ (REGISTER)
============================================== */
async function register() {
    // Lấy đúng ID từ index.html bạn cung cấp
    const fullname = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();
    
    const phone = document.getElementById('register-phone').value.trim();
    const address = document.getElementById('register-address').value.trim();
    const dob = document.getElementById('register-dob').value;

    const msgBox = document.getElementById('register-message');

    if (!fullname || !email || !password) {
        msgBox.textContent = 'Vui lòng điền đầy đủ các trường bắt buộc.';
        msgBox.style.color = 'red';
        return;
    }
    
    const userData = { fullname, email, password, phone, address, dob, role: 'user' }; 

    try {
        const response = await fetch(`${API_URL}/register.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        const result = await response.json();

        if (result.success) {
            msgBox.textContent = result.message;
            msgBox.style.color = 'green';
            setTimeout(() => {
                showLogin(); 
            }, 1500);
        } else {
            msgBox.textContent = "Lỗi đăng ký: " + result.message;
            msgBox.style.color = 'red';
        }
    } catch (error) {
        console.error("Lỗi kết nối Server:", error);
        msgBox.textContent = 'Lỗi kết nối đến máy chủ.';
        msgBox.style.color = 'red';
    }
}


/* ==============================================
   LOGIC QUÊN MẬT KHẨU (FORGOT PASSWORD) - Giả lập
============================================== */
let recoveryEmail = ''; 

function recoverPassword() {
    recoveryEmail = document.getElementById('recover-email').value.trim();
    const msgBox = document.getElementById('forgot-message');

    if (!recoveryEmail) {
        msgBox.textContent = 'Vui lòng nhập email.';
        msgBox.style.color = 'red';
        return;
    }
    
    // Gửi yêu cầu đến server (Giả lập)
    msgBox.textContent = `Mã khôi phục đã được gửi đến: ${recoveryEmail}. Mã là: 123456 (Giả lập)`;
    msgBox.style.color = 'green';

    document.getElementById('email-section').style.display = 'none';
    document.getElementById('code-section').style.display = 'block';
    
    // Reset và bắt đầu đếm ngược
    const expireEl = document.getElementById('code-expire');
    if(expireEl) expireEl.textContent = '05:00';
    startTimer(5 * 60); 
}

function resetPassword() {
    const code = document.getElementById('recover-code').value.trim();
    const newPassword = document.getElementById('new-password').value.trim();
    const msgBox = document.getElementById('forgot-message');
    
    if (code !== '123456') {
        msgBox.textContent = 'Mã khôi phục không đúng.';
        msgBox.style.color = 'red';
        return;
    }

    if (newPassword.length < 6) {
        msgBox.textContent = 'Mật khẩu mới phải có ít nhất 6 ký tự.';
        msgBox.style.color = 'red';
        return;
    }

    // Giả sử cập nhật thành công
    msgBox.textContent = 'Đặt lại mật khẩu thành công! Đang chuyển về trang đăng nhập...';
    msgBox.style.color = 'green';
    setTimeout(() => {
        showLogin();
    }, 1500);
}

function startTimer(duration) {
    let timer = duration, minutes, seconds;
    const display = document.getElementById('code-expire');
    const interval = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        if (display) display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(interval);
            if (display) display.textContent = "Hết hạn";
        }
    }, 1000);
}

/* ==============================================
   LOGIC TIỆN ÍCH
============================================== */
function togglePassword(id) {
    const input = document.getElementById(id);
    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}