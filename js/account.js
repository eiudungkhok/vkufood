const API_URL = 'http://localhost/vkufood/api';

document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();

    // Xử lý xem trước ảnh
    const avatarInput = document.getElementById('avatarInput');
    if (avatarInput) {
        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('avatarPreview').src = e.target.result;
                }
                reader.readAsDataURL(file);
            }
        });
    }

    const form = document.getElementById('accountForm');
    if (form) {
        form.addEventListener('submit', handleUpdateProfile);
    }
});

function loadUserProfile() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
        const user = JSON.parse(userJson);
        
        // 1. Hiển thị Header
        document.getElementById('userId').value = user.id || '';
        document.getElementById('displayName').textContent = user.fullname || 'Chưa đặt tên';
        document.getElementById('displayEmail').textContent = user.email || '';
        
        // 2. Điền Form
        document.getElementById('name').value = user.fullname || '';
        document.getElementById('email').value = user.email || ''; // Bây giờ sẽ có dữ liệu
        document.getElementById('phone').value = user.phone || '';
        document.getElementById('address').value = user.address || '';
        document.getElementById('dob').value = user.dob || '';

        // 3. Hiển thị Avatar
        if (user.avatar) {
            let avatarPath = user.avatar;
            if (!avatarPath.startsWith('http') && !avatarPath.startsWith('data:')) {
                avatarPath = 'css/' + avatarPath;
            }
            document.getElementById('avatarPreview').src = avatarPath;
        }
    }
}

async function handleUpdateProfile(e) {
    e.preventDefault();

    const id = document.getElementById('userId').value;
    const fullname = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const dob = document.getElementById('dob').value;
    
    const fileInput = document.getElementById('avatarInput');
    let avatar = '';
    const currentUser = JSON.parse(localStorage.getItem('user'));
    
    if (fileInput.files.length > 0) {
        avatar = fileInput.files[0].name; 
    } else {
        avatar = currentUser.avatar || '';
    }

    const updateData = {
        id: id, fullname, phone, address, dob, avatar
    };

    try {
        const response = await fetch(`${API_URL}/update_profile.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });

        const result = await response.json();

        if (result.success) {
            alert('✅ ' + result.message);
            // Cập nhật lại Local Storage để hiển thị ngay
            // Merge thông tin cũ với thông tin mới trả về
            const newUser = { ...currentUser, ...result.user };
            localStorage.setItem('user', JSON.stringify(newUser));
            
            location.reload(); 
        } else {
            alert('❌ Lỗi: ' + result.message);
        }
    } catch (error) {
        console.error(error);
        alert('Lỗi kết nối Server.');
    }
}