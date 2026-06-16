const API_URL = 'http://localhost/vkufood/api';
let allDishes = []; 
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentDetailDishId = null; 

document.addEventListener('DOMContentLoaded', () => {
    fetchMenu();
    updateCartUI();
    
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (sortSelect) sortSelect.addEventListener('change', applyFilters);
});

async function fetchMenu() {
    try {
        const response = await fetch(`${API_URL}/get_dishes.php`);
        const data = await response.json();
        allDishes = data;
        renderMenu(allDishes); 
    } catch (error) {
        document.getElementById('menuList').innerHTML = '<p style="text-align:center; color:red">Không thể kết nối đến máy chủ.</p>';
    }
}

function renderMenu(items) {
    const container = document.getElementById('menuList');
    container.innerHTML = '';

    if (items.length === 0) {
        container.innerHTML = '<p style="text-align:center; width:100%">Không tìm thấy món nào.</p>';
        return;
    }

    items.forEach(item => {
        let imgPath = item.image || 'css/logo.png';
        if (imgPath && !imgPath.startsWith('http') && !imgPath.startsWith('css/') && !imgPath.startsWith('images/')) {
             imgPath = 'css/' + imgPath;
        }

        container.innerHTML += `
            <div class="food-card">
                <img src="${imgPath}" alt="${item.name}" onclick="showItemDetail(${item.id})" style="cursor:pointer;" onerror="this.src='css/logo.png'">
                <div class="food-info">
                    <h4>${item.name}</h4>
                    <p class="food-price">${parseInt(item.price).toLocaleString('vi-VN')}đ</p>
                    <div style="display:flex; gap:10px; justify-content:center; margin-top:5px;">
                        <button class="btn-secondary" onclick="showItemDetail(${item.id})" style="padding:8px 12px; background:#eee; border:none; border-radius:5px; cursor:pointer;">Chi tiết</button>
                        <button class="btn-primary" onclick="addToCart(${item.id})" style="padding:8px 12px; background:#ff4d00; color:white; border:none; border-radius:5px; cursor:pointer;">Đặt ngay</button>
                    </div>
                </div>
            </div>
        `;
    });
}

function applyFilters() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    const sortType = document.getElementById('sortSelect').value;

    let filtered = allDishes.filter(item => item.name.toLowerCase().includes(keyword));

    if (sortType === 'asc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortType === 'desc') {
        filtered.sort((a, b) => b.price - a.price);
    }

    renderMenu(filtered);
}

/* ==============================================
   LOGIC CHI TIẾT & GIỎ HÀNG
============================================== */

function showItemDetail(dishId) {
    const item = allDishes.find(d => d.id == dishId);
    if (!item) return alert("Không tìm thấy món ăn!");

    currentDetailDishId = dishId; 
    
    let imgPath = item.image || 'css/logo.png';
    if (imgPath && !imgPath.startsWith('http') && !imgPath.startsWith('css/')) imgPath = 'css/' + imgPath;

    document.getElementById('detailImage').src = imgPath;
    document.getElementById('detailName').textContent = item.name;
    document.getElementById('detailPrice').textContent = parseInt(item.price).toLocaleString('vi-VN') + 'đ';
    document.getElementById('detailDesc').textContent = item.description || 'Đang cập nhật...';
    
    const ingList = item.ingredients ? item.ingredients.split(',').map(ing => `<li>${ing.trim()}</li>`).join('') : '<li>Không có thông tin thành phần.</li>';
    document.getElementById('detailIngredients').innerHTML = ingList;
    
    document.getElementById('detailQty').value = 1; 
    document.getElementById('itemDetailModal').style.display = 'block';
}

function closeItemDetail() {
    document.getElementById('itemDetailModal').style.display = 'none';
    currentDetailDishId = null;
}

function addDetailToCart() {
    if (currentDetailDishId === null) return;
    const qty = parseInt(document.getElementById('detailQty').value) || 1;
    addToCart(currentDetailDishId, qty); 
    closeItemDetail();
}

function addToCart(dishId, quantity = 1) {
    const dish = allDishes.find(d => d.id == dishId);
    if (!dish) return;

    const existingItem = cart.find(item => item.id == dishId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: dish.id,
            name: dish.name,
            price: parseInt(dish.price),
            quantity: quantity
        });
    }

    saveCart();
    updateCartUI();
}

function updateCartUI() {
    const list = document.getElementById('cartItems');
    const totalEl = document.getElementById('totalPrice');
    const countEl = document.getElementById('cartCount');
    const finalTotalEl = document.getElementById('finalTotal'); // Trong Modal

    if(!list) return; 

    list.innerHTML = '';
    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        count += item.quantity;

        list.innerHTML += `
            <div class="cart-item">
                <div>
                    <div style="font-weight:bold">${item.name}</div>
                    <div style="font-size:12px; color:#666">${item.price.toLocaleString('vi-VN')}đ x ${item.quantity}</div>
                </div>
                <div class="cart-controls">
                    <button onclick="changeQty(${index}, -1)">-</button>
                    <button onclick="changeQty(${index}, 1)">+</button>
                    <button onclick="removeItem(${index})" style="color:red; border-color:red">x</button>
                </div>
            </div>
        `;
    });

    if (cart.length === 0) {
        list.innerHTML = '<p style="text-align:center; font-size:14px;">Giỏ hàng trống</p>';
    }

    if(countEl) countEl.innerText = count;
    if(totalEl) totalEl.innerText = total.toLocaleString('vi-VN');
    
    // Cập nhật cả tổng tiền trong Modal nếu đang mở
    if(finalTotalEl) finalTotalEl.innerText = total.toLocaleString('vi-VN') + 'đ';
}

function changeQty(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    saveCart();
    updateCartUI();
    // Nếu đang mở modal thanh toán, cần render lại list trong modal
    if(document.getElementById('checkoutModal').style.display === 'block') {
        renderCheckoutList();
    }
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
    if(document.getElementById('checkoutModal').style.display === 'block') {
        renderCheckoutList();
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function toggleCart() {
    const popup = document.getElementById('cartPopup');
    if (popup) popup.style.display = (popup.style.display === 'block') ? 'none' : 'block';
}

/* ==============================================
   4. THANH TOÁN (CHECKOUT)
============================================== */

// Hàm hiển thị Modal Thanh toán & Render danh sách món
function showCheckoutModal() {
    if (cart.length === 0) {
        alert("Giỏ hàng trống! Vui lòng chọn món trước.");
        return;
    }
    
    // 1. Điền thông tin người dùng
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('orderName').value = user.fullname || '';
        document.getElementById('orderPhone').value = user.phone || '';
        document.getElementById('orderAddress').value = user.address || '';
    }

    // 2. Render danh sách món ăn vào Modal (MỚI THÊM)
    renderCheckoutList();

    // 3. Hiển thị Modal
    document.getElementById('cartPopup').style.display = 'none'; 
    document.getElementById('checkoutModal').style.display = 'block'; 
}

// Hàm phụ trợ render danh sách trong modal checkout
function renderCheckoutList() {
    const checkoutList = document.getElementById('checkoutCartList');
    if (!checkoutList) return;

    checkoutList.innerHTML = '';
    if (cart.length === 0) {
        checkoutList.innerHTML = '<p>Giỏ hàng trống</p>';
        document.getElementById('finalTotal').innerText = '0đ';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        let itemTotal = item.price * item.quantity;
        total += itemTotal;
        checkoutList.innerHTML += `
            <div class="checkout-item">
                <strong>${item.name}</strong>
                <span>x${item.quantity} = ${itemTotal.toLocaleString('vi-VN')}đ</span>
            </div>
        `;
    });
    
    document.getElementById('finalTotal').innerText = total.toLocaleString('vi-VN') + 'đ';
}

async function submitOrder() {
    const nameInput = document.getElementById('orderName').value.trim();
    const phoneInput = document.getElementById('orderPhone').value.trim();
    const addressInput = document.getElementById('orderAddress').value.trim();
    
    if (!nameInput || !phoneInput || !addressInput) {
        alert("Vui lòng điền đầy đủ thông tin giao hàng!");
        return;
    }

    if (cart.length === 0) {
        alert("Giỏ hàng trống!");
        return;
    }

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const orderData = {
        name: nameInput,
        phone: phoneInput,
        address: addressInput,
        total: totalAmount,
        cart: cart
    };

    try {
        const response = await fetch(`${API_URL}/place_order.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        
        const result = await response.json();

        if (result.success) {
            alert("✅ Đặt hàng thành công! Mã: " + result.order_code);
            cart = []; 
            saveCart();
            updateCartUI(); 
            document.getElementById('checkoutModal').style.display = 'none';
        } else {
            alert("❌ Lỗi Database: " + result.message);
        }
    } catch (error) {
        alert("❌ Lỗi kết nối đến Server.");
    }
}