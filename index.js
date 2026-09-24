const allSampleProducts = [
    { 
        id: "inside-1", 
        name: "Quần Lót Nam Seamless Không Đường May Brief", 
        category: "INSIDE", 
        path: "INSIDE/inside.html", 
        image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=1200" 
    },
    { 
        id: "inside-2", 
        name: "Quần Lót Nam Sợi Tre Bamboo Premium Boxer", 
        category: "INSIDE", 
        path: "INSIDE/inside.html", 
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200" 
    },
    { 
        id: "sock-1", 
        name: "Tất Cổ Ngắn Bamboo Kháng Khuẩn SlimFit", 
        category: "SOCK", 
        path: "SOCK/sock.html", 
        image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&q=80&w=1200" 
    },
    { 
        id: "tshirt-1", 
        name: "Áo Phông Nam Cotton Compact Premium T-Shirt", 
        category: "TSHIRT", 
        path: "TSHIRT/tshirt.html", 
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1200" 
    }
];

window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    if (window.scrollY > 50) { 
        header.classList.add('scrolled'); 
    } else { 
        header.classList.remove('scrolled'); 
    }
});

function toggleMobileNav() {
    const navMenu = document.getElementById('mobile-nav-menu');
    navMenu.classList.toggle('hidden');
}

function openSearchModal() {
    document.getElementById('search-modal').classList.remove('hidden');
    const input = document.getElementById('search-input');
    input.value = '';
    handleSearchInput('');
    if (window.lucide) lucide.createIcons();
}

function closeSearchModal() { 
    document.getElementById('search-modal').classList.add('hidden'); 
}

function fillSearch(keyword) { 
    const input = document.getElementById('search-input'); 
    input.value = keyword; 
    handleSearchInput(keyword); 
}

function clearViewedProducts() { 
    localStorage.removeItem('viewed_products'); 
    renderViewedProducts(); 
}

function handleSearchInput(query) {
    const titleEl = document.getElementById('search-results-title');
    const clearBtn = document.getElementById('btn-clear-history');
    const container = document.getElementById('viewed-products-container');

    if (!query.trim()) {
        titleEl.innerHTML = `<i data-lucide="history" class="w-4 h-4 text-slate-400"></i> Sản phẩm đã xem`;
        clearBtn.classList.remove('hidden');
        renderViewedProducts();
        return;
    }

    titleEl.innerHTML = `<i data-lucide="search" class="w-4 h-4 text-slate-400"></i> Kết quả tìm kiếm cho "${query}"`;
    clearBtn.classList.add('hidden');

    const matches = allSampleProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    if (matches.length === 0) {
        container.innerHTML = `<p class="col-span-full text-center text-xs text-slate-400 font-bold uppercase tracking-wider py-8">Không tìm thấy sản phẩm nào.</p>`;
        return;
    }

    container.innerHTML = matches.map(p => `
        <div class="group cursor-pointer" onclick="window.location.href='${p.path}'">
            <div class="relative aspect-[3/4] bg-slate-100 overflow-hidden border border-slate-100">
                <img src="${p.image}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                <span class="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[9px] font-black uppercase tracking-widest text-slate-900 px-2 py-0.5">${p.category}</span>
            </div>
        </div>
    `).join('');
    if (window.lucide) lucide.createIcons();
}

function renderViewedProducts() {
    const viewed = JSON.parse(localStorage.getItem('viewed_products') || '[]');
    const container = document.getElementById('viewed-products-container');
    if (!container) return;

    if (viewed.length === 0) {
        container.innerHTML = `<p class="col-span-full text-center text-xs text-slate-400 font-bold uppercase tracking-wider py-8">Bạn chưa xem sản phẩm nào gần đây.</p>`;
        return;
    }

    container.innerHTML = viewed.map(p => {
        let path = `${p.category.toUpperCase()}/${p.category.toLowerCase()}.html`;
        return `
        <div class="group cursor-pointer" onclick="window.location.href='${path}'">
            <div class="relative aspect-[3/4] bg-slate-100 overflow-hidden border border-slate-100">
                <img src="${p.images ? p.images[0] : p.image}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                <span class="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[9px] font-black uppercase tracking-widest text-slate-900 px-2 py-0.5">${p.category}</span>
            </div>
        </div>
    `}).join('');
    if (window.lucide) lucide.createIcons();
}

function toggleChatMenu() {
    const group = document.getElementById('social-links-group');
    const icon = document.getElementById('chat-icon');
    group.classList.toggle('hidden');
    if (!group.classList.contains('hidden')) {
        icon.setAttribute('data-lucide', 'x');
    } else {
        icon.setAttribute('data-lucide', 'message-circle');
    }
    if (window.lucide) lucide.createIcons();
}

function scrollToTop() { 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
}

document.addEventListener('DOMContentLoaded', () => { 
    if (window.lucide) lucide.createIcons(); 
});