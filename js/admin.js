const API_URL = 'http://localhost/vkufood/api';
let allDishes = [];
let allOrders = [];
let filters = { search: '', min: '', max: '', sort: 'name_asc' }; 
let announcements = []; 

// Hàm tiện ích hiển thị Toast Message
function showToast(text) {
    const container = document.body;
    const el = document.createElement('div');
    el.style.cssText = 'position:fixed; bottom:20px; right:20px; background:#333; color:#fff; padding:10px 14px; border-radius:8px; z-index:9999; opacity:0.95; transition: opacity 0.5s;';
    el.textContent = text;
    container.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 500); }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchDishes();
    fetchOrders();
    fetchNotes();

    const dishForm = document.getElementById('dishForm');
    if (dishForm) dishForm.addEventListener('submit', handleDishSubmit);

    const noteForm = document.getElementById('noteForm');
    if (noteForm) noteForm.addEventListener('submit', handleNoteSubmit);

    // Logic xử lý Filter
    const dishSearch = document.getElementById('dishSearch');
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const dishSort = document.getElementById('dishSort');

    function applyAndRenderFilters(){
        filters.search = (dishSearch && dishSearch.value.trim().toLowerCase()) || '';
        filters.min = priceMin && priceMin.value ? priceMin.value : '';
        filters.max = priceMax && priceMax.value ? priceMax.value : '';
        filters.sort = (dishSort && dishSort.value) || 'name_asc';
        renderDishes(allDishes);
    }
    if (dishSearch) dishSearch.addEventListener('input', applyAndRenderFilters);
    if (priceMin) priceMin.addEventListener('input', applyAndRenderFilters);
    if (priceMax) priceMax.addEventListener('input', applyAndRenderFilters);
    if (dishSort) dishSort.addEventListener('change', applyAndRenderFilters);

    // Gán các hàm vào window
    window.editDish = editDish;
    window.updateDish = updateDish;
    window.deleteDish = deleteDish;
    window.deleteNote = deleteNote;
    window.adminLogout = adminLogout;
});

/* ==============================================
   1. QUẢN LÝ MÓN ĂN (CRUD - GỌI FILE RIÊNG LẺ)
============================================== */

async function fetchDishes() {
    try {
        const response = await fetch(`${API_URL}/get_dishes.php`);
        const data = await response.json();
        allDishes = data;
        renderDishes(allDishes);
    } catch (error) {
        document.getElementById('dishList').innerHTML = '<p>Lỗi tải món ăn.</p>';
    }
}

function renderDishes(dishes) {
    const container = document.getElementById('dishList');
    container.innerHTML = '';
    let list = [...dishes];
    
    // Áp dụng bộ lọc
    if (filters.search) list = list.filter(d => (d.name || '').toLowerCase().includes(filters.search));
    if (filters.min) list = list.filter(d => Number(d.price || 0) >= parseInt(filters.min, 10));
    if (filters.max) list = list.filter(d => Number(d.price || 0) <= parseInt(filters.max, 10));
    
    // Sắp xếp
    if (filters.sort === 'name_asc') list.sort((a,b) => (a.name||'').localeCompare(b.name||''));
    else if (filters.sort === 'price_asc') list.sort((a,b) => Number(a.price||0) - Number(b.price||0));
    else if (filters.sort === 'price_desc') list.sort((a,b) => Number(b.price||0) - Number(a.price||0));
    
    if (list.length === 0) {
        container.innerHTML = '<p>Không tìm thấy món phù hợp.</p>';
        return;
    }
    
    list.forEach(dish => {
        // Xử lý ảnh
        let imgPath = dish.image || 'css/logo.png';
        if (imgPath && !imgPath.startsWith('http') && !imgPath.startsWith('css/') && !imgPath.startsWith('images/')) {
             imgPath = 'css/' + imgPath;
        }

        container.innerHTML += `
            <div class="food-card">
                <img src="${imgPath}" alt="${dish.name}" style="width:100%; height:100px; object-fit:cover; border-radius:5px;" onerror="this.src='css/logo.png'">
                <h4>${dish.name}</h4>
                <p>${parseInt(dish.price).toLocaleString('vi-VN')}đ</p>
                <div style="display:flex; justify-content:space-around; gap:5px; margin-top:10px;">
                    <button onclick="editDish(${dish.id})" class="btn-secondary" style="background:#007bff; color:white; padding:5px 10px;">Sửa</button>
                    <button onclick="deleteDish(${dish.id})" class="btn-secondary" style="background:red; color:white; padding:5px 10px;">Xóa</button>
                </div>
            </div>
        `;
    });
}

// [C] CREATE: THÊM MÓN -> Gọi add_dish.php
async function handleDishSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('dishName').value.trim();
    const price = document.getElementById('dishPrice').value.trim();
    const desc = document.getElementById('dishDesc').value.trim();
    const ingredients = document.getElementById('dishIngredients').value.trim();
    
    // Xử lý Input File
    const fileInput = document.getElementById('dishImage');
    let imageUrl = 'css/logo.png';
    if (fileInput.files.length > 0) {
        imageUrl = 'css/' + fileInput.files[0].name;
    } else {
        // Nếu nhập URL tay (fallback)
        const textInput = document.getElementById('dishImage').value; // Trường hợp input type text cũ
        if(textInput) imageUrl = textInput;
    }

    if (!name || !price) {
        alert('Vui lòng nhập Tên và Giá món ăn.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/add_dish.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price, image: imageUrl, description: desc, ingredients })
        });
        const result = await response.json();
        if (result.success) {
            showToast('Thêm món ăn thành công');
            document.getElementById('dishForm').reset();
            fetchDishes();
        } else {
            alert("Lỗi khi thêm món: " + result.message);
        }
    } catch (error) {
        alert("Lỗi kết nối Server.");
    }
}

// [U] UPDATE: MỞ MODAL
function editDish(dishId) {
    const dish = allDishes.find(d => d.id == dishId);
    if (!dish) return alert("Không tìm thấy món ăn!");

    document.getElementById('editDishId').value = dish.id;
    document.getElementById('editDishName').value = dish.name;
    document.getElementById('editDishPrice').value = dish.price;
    document.getElementById('editDishDesc').value = dish.description;
    document.getElementById('editDishIngredients').value = dish.ingredients;

    // Hiển thị ảnh cũ
    let currentImg = dish.image || 'css/logo.png';
    document.getElementById('editDishOldImage').value = currentImg;
    
    if (currentImg && !currentImg.startsWith('http') && !currentImg.startsWith('css/')) {
         currentImg = 'css/' + currentImg;
    }
    document.getElementById('editDishPreview').src = currentImg;
    
    // Reset file input mới
    const fileInput = document.getElementById('editDishImageFile');
    if(fileInput) fileInput.value = '';

    document.getElementById('editDishModal').style.display = 'block';
}

// [U] UPDATE: GỬI DỮ LIỆU -> Gọi update_dish.php
window.updateDish = async function() {
    const id = document.getElementById('editDishId').value;
    const name = document.getElementById('editDishName').value.trim();
    const price = document.getElementById('editDishPrice').value.trim();
    const desc = document.getElementById('editDishDesc').value.trim();
    const ingredients = document.getElementById('editDishIngredients').value.trim();
    
    // Chọn ảnh
    const fileInput = document.getElementById('editDishImageFile');
    const oldImage = document.getElementById('editDishOldImage').value;
    let imageUrl = oldImage;

    if (fileInput && fileInput.files.length > 0) {
        imageUrl = 'css/' + fileInput.files[0].name;
    }
    
    if (!name || !price) {
        alert('Vui lòng nhập Tên và Giá món ăn.');
        return;
    }
    
    const dishData = { id, name, price, image: imageUrl, description: desc, ingredients };

    try {
        const response = await fetch(`${API_URL}/update_dish.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dishData) 
        });
        
        const result = await response.json();

        if (result.success) {
            showToast('Cập nhật món ăn thành công');
            document.getElementById('editDishModal').style.display = 'none';
            fetchDishes();
        } else {
            alert("Lỗi khi cập nhật: " + result.message);
        }
    } catch (error) {
        alert("Lỗi kết nối Server.");
    }
}

// [D] DELETE -> Gọi delete_dish.php
window.deleteDish = async function(dishId) {
    if (!confirm("Bạn có chắc chắn muốn xóa món ăn này không?")) return;

    try {
        const response = await fetch(`${API_URL}/delete_dish.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: dishId })
        });
        const result = await response.json();

        if (result.success) {
            showToast('Xóa món ăn thành công');
            fetchDishes();
        } else {
            alert("Lỗi khi xóa: " + result.message);
        }
    } catch (error) {
        alert("Lỗi kết nối Server.");
    }
}


/* ==============================================
   2. QUẢN LÝ ĐƠN HÀNG (READ)
============================================== */
async function fetchOrders() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    try {
        const response = await fetch(`${API_URL}/get_orders.php`);
        const orders = await response.json();
        allOrders = orders;
        renderOrders(allOrders);
    } catch (error) {
        document.getElementById('historyList').innerHTML = '<p>Lỗi tải đơn hàng.</p>';
    }
}

function renderOrders(orders) {
    const container = document.getElementById('historyList');
    container.innerHTML = '';

    if (orders.length === 0) {
        container.innerHTML = '<p>Chưa có đơn hàng nào.</p>';
        return;
    }

    orders.forEach(order => {
        const itemsList = (order.items || []).map(item => 
            `<li>${(item.name || item.dish_name)} x ${item.quantity} (${parseInt(item.price || 0).toLocaleString()}đ)</li>`
        ).join('');
        
        const total = Number(order.total_money || 0); 
        const code = order.code || 'N/A';
        const address = order.customer_address || 'Không rõ'; 
        const name = order.customer_name || 'Khách vãng lai';
        const phone = order.customer_phone || 'N/A';
        const created = new Date(order.order_date || order.created_at).toLocaleString('vi-VN');

        container.innerHTML += `
            <div class="card" style="border: 1px solid #ccc; margin-bottom: 10px;">
                <p><strong>Mã ĐH: ${code}</strong></p>
                <p><strong>Khách hàng:</strong> ${name} (${phone})</p>
                <p><strong>Địa chỉ:</strong> ${address}</p>
                <p><strong>Tổng tiền:</strong> <span style="color:red; font-weight:bold">${total.toLocaleString('vi-VN')}đ</span></p>
                <p><strong>Ngày đặt:</strong> ${created}</p>
                <ul style="margin-left: -15px;">${itemsList}</ul>
            </div>
        `;
    });
}


/* ==============================================
   3. QUẢN LÝ THÔNG BÁO (DATABASE)
============================================== */
async function fetchNotes() {
    const listContainer = document.getElementById('noteList');
    if (!listContainer) return;

    try {
        const response = await fetch(`${API_URL}/announcements.php`);
        const data = await response.json(); 
        announcements = Array.isArray(data) ? data : []; 
        renderNotes();
    } catch (error) {
        listContainer.innerHTML = '<li style="color:red;">Lỗi tải thông báo.</li>';
    }
}

function renderNotes() {
    const listContainer = document.getElementById('noteList');
    listContainer.innerHTML = '';
    
    if (announcements.length === 0) {
        listContainer.innerHTML = '<li>Chưa có thông báo nào.</li>';
        return;
    }
    
    announcements.forEach((note) => {
        const li = document.createElement('li');
        li.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;';
        li.innerHTML = `
            <span>📣 ${note.content}</span>
            <button onclick="deleteNote(${note.id})" style="background:red; color:white; border:none; padding:4px 8px; border-radius:3px; cursor:pointer;">Xóa</button>
        `;
        listContainer.appendChild(li);
    });
}

async function handleNoteSubmit(e) {
    e.preventDefault();
    const noteText = document.getElementById('noteText').value.trim();
    if (!noteText) return;

    try {
        const response = await fetch(`${API_URL}/announcements.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'add', content: noteText })
        });
        const result = await response.json();
        
        if (result.success) {
            showToast('Thêm thông báo thành công');
            document.getElementById('noteForm').reset();
            fetchNotes(); 
        } else {
            alert("Lỗi: " + result.message);
        }
    } catch(e) { alert("Lỗi kết nối Server."); }
}

window.deleteNote = async function(noteId) {
    if (!confirm("Bạn có chắc chắn muốn xóa thông báo này không?")) return;
    
    try {
        const response = await fetch(`${API_URL}/announcements.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete', id: noteId })
        });
        const result = await response.json();
        
        if (result.success) {
            showToast('Xóa thông báo thành công');
            fetchNotes(); 
        } else {
            alert("Lỗi: " + result.message);
        }
    } catch(e) { alert("Lỗi kết nối Server."); }
}

/* ==============================================
   4. CHỨC NĂNG TIỆN ÍCH (ĐĂNG XUẤT)
============================================== */
window.adminLogout = function() {
    localStorage.removeItem('user'); 
    fetch(`${API_URL}/logout.php`) 
        .then(() => {
            window.location.href = 'index.html';
        })
        .catch(error => {
            console.error("Lỗi gọi API logout:", error);
            showToast('Đã đăng xuất');
            window.location.href = 'index.html';
        });
}