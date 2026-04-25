// 0. Database Initialization (IndexedDB)
const DB_NAME = 'RedStudioDB';
const DB_VERSION = 1;
const STORE_NAME = 'portfolio_media';

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
        
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject('Database error: ' + event.target.errorCode);
    });
}

const dbPromise = initDB();

async function getAllMedia() {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
    });
}

async function getMediaById(id) {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(Number(id));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function saveMedia(item) {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(item);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

async function deleteMedia(id) {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(Number(id));
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

async function initRedState() {
    if (!localStorage.getItem('red_studio_status')) {
        localStorage.setItem('red_studio_status', JSON.stringify({ kokkada: true, mysuru: true }));
    }
    
    try {
        const existingMedia = await getAllMedia();
        if (existingMedia.length === 0) {
            const defaultMedia = [
                { id: 1, title: 'Neon Dreams', category: 'Photography', type: 'image', mediaUrl: 'assets/Banner.png', coverUrl: 'assets/Banner.png', dateAdded: new Date() },
                { id: 2, title: 'Midnight Run', category: 'Videography', type: 'image', mediaUrl: 'assets/ACT.png', coverUrl: 'assets/ACT.png', dateAdded: new Date() },
                { id: 3, title: 'Shadowplay', category: 'Photography', type: 'image', mediaUrl: 'assets/Banner.png', coverUrl: 'assets/Banner.png', dateAdded: new Date() },
                { id: 4, title: 'Sonic Aesthetic', category: 'Reels', type: 'image', mediaUrl: 'assets/ACT.png', coverUrl: 'assets/ACT.png', dateAdded: new Date() },
                { id: 5, title: 'Lumina', category: 'Photography', type: 'image', mediaUrl: 'assets/Banner.png', coverUrl: 'assets/Banner.png', dateAdded: new Date() },
                { id: 6, title: 'The Artisan', category: 'Videography', type: 'image', mediaUrl: 'assets/ACT.png', coverUrl: 'assets/ACT.png', dateAdded: new Date() }
            ];
            for(let item of defaultMedia) {
                await saveMedia(item);
            }
        }
    } catch(e) { console.error('DB Init Error', e); }
}

document.addEventListener('DOMContentLoaded', async () => {
    await initRedState();
    // 0. Dynamic Rendering Logic
    const studioStatus = JSON.parse(localStorage.getItem('red_studio_status') || '{"kokkada":true, "mysuru":true}');
    
    // Render Studio Open/Closed Statuses if elements exist
    const statusKokkada = document.getElementById('status-kokkada');
    const statusMysuru = document.getElementById('status-mysuru');
    
    const updateStatusTag = (el, isOpen) => {
        if (!el) return;
        if (isOpen) {
            el.innerHTML = '<i class="fas fa-circle" style="margin-right: 4px;"></i> OPEN';
            el.style.color = '#25d366';
        } else {
            el.innerHTML = '<i class="fas fa-circle" style="margin-right: 4px;"></i> CLOSED';
            el.style.color = 'var(--accent-red)';
        }
    };
    
    updateStatusTag(statusKokkada, studioStatus.kokkada);
    updateStatusTag(statusMysuru, studioStatus.mysuru);
    
    // Render Admin Studio Panel statuses
    const adminStatusKokkada = document.getElementById('admin-status-kokkada');
    const adminStatusMysuru = document.getElementById('admin-status-mysuru');
    updateStatusTag(adminStatusKokkada, studioStatus.kokkada);
    updateStatusTag(adminStatusMysuru, studioStatus.mysuru);
    
    // Global array for tracking blob URLs for cleanup to prevent memory leaks
    window.activeObjectURLs = window.activeObjectURLs || [];





    // 1. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active') ? '&times;' : '&#9776;';
        });
    }

    // Close menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if(navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if(hamburger) hamburger.innerHTML = '&#9776;';
            }
        });
    });

    // 2. Sticky Header Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Precision Scroll Reveal Engine
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target); // Trigger once only
            }
        });
    }, observerOptions);

    const elementsToReveal = new Set(document.querySelectorAll('.fade-in, [data-reveal]'));

    // Stagger .card-grid children and include them in the observer
    document.querySelectorAll('.card-grid').forEach(grid => {
        Array.from(grid.children).forEach((child, index) => {
            child.style.transitionDelay = `${index * 0.1}s`;
            elementsToReveal.add(child);
        });
    });

    elementsToReveal.forEach(el => revealObserver.observe(el));

    // Custom CSS Variables for Card Glow hover effect
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 4. Portfolio Filter logic
    const filterBtns = document.querySelectorAll('.filter-btn');

    if(filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.id === 'btn-code-red') {
                    triggerCodeRedTransition();
                    return;
                }
                
                // Remove active class
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filterValue = btn.getAttribute('data-filter');
                const masonryItems = document.querySelectorAll('.masonry-item');
                
                masonryItems.forEach(item => {
                    if(filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => { item.style.display = 'none'; }, 300);
                    }
                });
            });
        });
    }

    function triggerCodeRedTransition() {
        const overlay = document.createElement('div');
        overlay.id = 'code-red-overlay';
        overlay.innerHTML = `
            <div class="code-red-content">
                <div class="scan-line"></div>
                <h1 class="code-red-text">CODE <span class="text-accent">RED</span></h1>
            </div>
        `;
        document.body.appendChild(overlay);

        // Force reflow
        void overlay.offsetWidth;
        
        // Add active class to start animation
        overlay.classList.add('active');
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = 'code-red.html';
        }, 2400); // 2.4s delay for full dramatic effect
    }

    // 5. Lightbox / Modal for Portfolio with Image & Video Support
    const modal = document.getElementById('portfolio-modal');
    const modalMediaContainer = document.getElementById('modal-media-container');
    const modalTitle = document.getElementById('modal-title');
    const modalCategory = document.getElementById('modal-category');
    const closeModal = document.querySelector('.close-modal');

    if(modal) {
        document.addEventListener('click', (e) => {
            const item = e.target.closest('.masonry-item');
            if(item) {
                const type = item.getAttribute('data-type');
                const src = item.getAttribute('data-src');
                const title = item.querySelector('h3') ? item.querySelector('h3').innerText : '';
                const category = item.querySelector('p') ? item.querySelector('p').innerText : '';

                // Clear previous content
                if (modalMediaContainer) modalMediaContainer.innerHTML = '';

                if (type === 'image') {
                    const img = document.createElement('img');
                    img.src = src;
                    img.alt = title;
                    modalMediaContainer.appendChild(img);
                } else if (type === 'video') {
                    const video = document.createElement('video');
                    video.src = src;
                    video.controls = true;
                    video.autoplay = true;
                    video.muted = true;
                    if (item.getAttribute('data-category') === 'reels') {
                        video.loop = true;
                    }
                    modalMediaContainer.appendChild(video);
                }

                if (modalTitle) modalTitle.innerText = title;
                if (modalCategory) modalCategory.innerText = category;

                modal.classList.add('open');
                
                // Prevent scrolling on body
                document.body.style.overflow = 'hidden';
            }
        });

        const closeHandler = () => {
            modal.classList.remove('open');
            document.body.style.overflow = '';
            
            // Stop video playing after close animation
            setTimeout(() => {
                if (modalMediaContainer) modalMediaContainer.innerHTML = '';
            }, 400); 
        };

        if (closeModal) {
            closeModal.addEventListener('click', closeHandler);
        }

        modal.addEventListener('click', (e) => {
            if(e.target === modal || e.target === modalMediaContainer) {
                closeHandler();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) {
                closeHandler();
            }
        });
    }

    // 7. Team Member Modal Logic — REMOVED
    // All team member info is now rendered inline via editorial panels in team.html

    // 8. Admin Portal Logic
    const adminTrigger = document.getElementById('admin-trigger');
    const adminLoginModal = document.getElementById('admin-login-modal');
    
    if (adminTrigger && adminLoginModal) {
        const closeAdminModal = document.getElementById('close-admin-modal');
        const adminLoginForm = document.getElementById('admin-login-form');
        const adminError = document.getElementById('admin-error');

        // Check if already logged in
        if (localStorage.getItem('red_admin_logged_in') === 'true') {
            adminTrigger.title = 'Access Dashboard';
            adminTrigger.addEventListener('click', () => {
                window.location.href = 'admin.html';
            });
        } else {
            adminTrigger.addEventListener('click', () => {
                adminLoginModal.classList.add('open');
                document.body.style.overflow = 'hidden';
                adminError.style.display = 'none'; // reset error state
            });
        }

        const closeAdmin = () => {
            adminLoginModal.classList.remove('open');
            document.body.style.overflow = '';
        };

        if(closeAdminModal) closeAdminModal.addEventListener('click', closeAdmin);
        adminLoginModal.addEventListener('click', (e) => {
            if(e.target === adminLoginModal) closeAdmin();
        });

        // Master Credential Hashes
        const CHRIS_HASH = '30bfe59958dda580346133bd37a81b39f27445d9108d1dc7756a7b3f2418d336';
        const CIYANA_HASH = 'e2e22db0ce6fc2171e7b5a58b534d8510a534900ae976c3ac2330f5e7d6791b7';

        async function hashPassword(password) {
            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }

        if (adminLoginForm) {
            adminLoginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const user = document.getElementById('admin-user').value.trim();
                const pass = document.getElementById('admin-pass').value.trim();
                
                const btn = adminLoginForm.querySelector('button[type="submit"]');
                const originalText = btn.innerText;
                btn.innerText = 'Authorizing...';
                btn.disabled = true;

                try {
                    const inputHash = await hashPassword(pass);
                    
                    // Secure Validation
                    if ((user === 'zch07' && inputHash === CHRIS_HASH) || (user === 'Ciya07' && inputHash === CIYANA_HASH)) {
                        const adminName = user === 'zch07' ? 'Chris' : 'Ciyana';
                        localStorage.setItem('red_admin_logged_in', 'true');
                        localStorage.setItem('red_admin_name', adminName);
                        adminError.style.display = 'none';
                        window.location.href = 'admin.html';
                    } else {
                        adminError.style.display = 'block';
                    }
                } catch (error) {
                    console.error("Authentication Error", error);
                    adminError.innerText = "Secure authorization failed.";
                    adminError.style.display = 'block';
                }
                
                btn.innerText = originalText;
                btn.disabled = false;
            });
        }
    }

    // Logout handling (placed here so it covers admin.html if imported)
    const adminLogout = document.getElementById('admin-logout');
    if (adminLogout) {
        adminLogout.addEventListener('click', () => {
            localStorage.removeItem('red_admin_logged_in');
            localStorage.removeItem('red_admin_name');
            window.location.href = 'about.html';
        });
    }

    // 6. Contact Form Simulated Submit & Save
    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            data.id = Date.now();
            data.dateSubmitted = new Date().toLocaleString();
            
            const existingRequests = JSON.parse(localStorage.getItem('red_contact_requests') || '[]');
            existingRequests.unshift(data);
            localStorage.setItem('red_contact_requests', JSON.stringify(existingRequests));

            console.log('Form Submitted and Saved:', data);
            alert('Thank you! Your message has been saved and sent to RED Studio.');
            contactForm.reset();
        });
    }

    // 6.1 Admin Contact Requests Logic
    const viewRequestsBtn = document.getElementById('admin-view-requests-btn');
    const viewRequestsModal = document.getElementById('view-requests-modal');
    if(viewRequestsBtn && viewRequestsModal) {
        const renderRequestsTable = () => {
            const list = document.getElementById('requests-management-list');
            if(!list) return;
            const requests = JSON.parse(localStorage.getItem('red_contact_requests') || '[]');
            
            list.innerHTML = '';
            if(requests.length === 0) {
                list.innerHTML = '<p style="color:var(--text-muted);">No contact requests found.</p>';
                return;
            }

            requests.forEach(req => {
                list.innerHTML += `
                    <div style="background:rgba(255,255,255,0.02); padding:15px; border-radius:8px; border-left: 3px solid var(--accent-red); margin-bottom: 10px;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                            <strong style="font-size:1.1rem;">${req.name}</strong>
                            <div style="display:flex; gap: 10px; align-items:center;">
                                <span style="font-size:0.8rem; color:var(--text-muted);">${req.dateSubmitted}</span>
                                <button class="btn btn-primary delete-request-btn" data-id="${req.id}" style="padding:0.3rem 0.6rem; font-size:0.7rem; background:red; border:none;"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; font-size: 0.9rem;">
                            <div><i class="fas fa-envelope text-accent"></i> ${req.email}</div>
                            <div><i class="fas fa-phone text-accent"></i> ${req.phone}</div>
                            <div><i class="fas fa-camera text-accent"></i> ${req.service}</div>
                            <div><i class="fas fa-calendar text-accent"></i> ${req.date || 'Not specified'}</div>
                        </div>
                        <p style="font-size:0.9rem; margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">${req.message || 'No additional message.'}</p>
                    </div>
                `;
            });

            // Bind delete event listeners after rendering
            document.querySelectorAll('.delete-request-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    if(confirm('Are you sure you want to delete this contact request?')) {
                        const id = e.currentTarget.getAttribute('data-id');
                        const currentRequests = JSON.parse(localStorage.getItem('red_contact_requests') || '[]');
                        const updated = currentRequests.filter(r => String(r.id) !== id);
                        localStorage.setItem('red_contact_requests', JSON.stringify(updated));
                        renderRequestsTable(); // Re-render the list immediately
                    }
                });
            });
        };

        viewRequestsBtn.addEventListener('click', () => {
            renderRequestsTable();
            viewRequestsModal.classList.add('open');
            document.body.style.overflow = 'hidden';
        });

        document.getElementById('close-requests-modal').addEventListener('click', () => {
            viewRequestsModal.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    /* --- CINEMATIC ANIMATIONS --- */
    // 1. Page Loader
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    const loaderImg = document.createElement('img');
    loaderImg.src = 'assets/ACT.png';
    loaderImg.alt = 'RED Studio Loader';
    loaderImg.style.height = '100px';
    loader.appendChild(loaderImg);
    document.body.appendChild(loader);

    // Add loader fade out and trigger hero anims
    setTimeout(() => {
        loaderImg.style.opacity = '1';
        loaderImg.style.transform = 'scale(1)';
        
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.remove();
                startHeroAnimations();
            }, 500);
        }, 1200);
    }, 100);

    // 2. Custom Cursor (Removed as requested)

    // 3. Hero Animations
    function startHeroAnimations() {
        // Word Split h1 title logic
        const heroTitle = document.querySelector('h1.hero-title');
        if (heroTitle && !heroTitle.classList.contains('split-word-active')) {
            heroTitle.classList.add('split-word-active');
            
            const nodes = Array.from(heroTitle.childNodes);
            heroTitle.innerHTML = '';
            
            let wordIndex = 0;
            
            nodes.forEach(node => {
                if (node.nodeType === 3) {
                    const words = node.textContent.split(/(\s+)/);
                    words.forEach(word => {
                        if (word.trim() === '') {
                            heroTitle.appendChild(document.createTextNode(word));
                            return;
                        }
                        const wrapper = document.createElement('span');
                        wrapper.className = 'hero-word-wrapper';
                        
                        const inner = document.createElement('span');
                        inner.className = 'hero-word';
                        inner.innerText = word;
                        inner.style.animationDelay = `${wordIndex * 0.1}s`;
                        
                        wrapper.appendChild(inner);
                        heroTitle.appendChild(wrapper);
                        wordIndex++;
                    });
                } else if (node.nodeType === 1) {
                    const wrapper = document.createElement('span');
                    wrapper.className = 'hero-word-wrapper';
                    
                    const inner = document.createElement('span');
                    inner.className = 'hero-word';
                    if (node.classList.contains('text-accent')) {
                        node.classList.add('hero-accent-block');
                    }
                    inner.style.animationDelay = `${wordIndex * 0.1}s`;
                    inner.appendChild(node.cloneNode(true));
                    
                    wrapper.appendChild(inner);
                    heroTitle.appendChild(wrapper);
                    wordIndex++;
                }
            });
        }
        
        // Add subtitle & btn animations
        const subtitle = document.querySelector('.hero .subtitle');
        if(subtitle) subtitle.classList.add('hero-subtitle-anim');
        
        const btns = document.querySelectorAll('.hero .btn');
        btns.forEach(btn => btn.classList.add('hero-btn-anim'));
        
        // Add scanline
        const heroContainer = document.querySelector('.hero-full');
        if(heroContainer) {
            const scanline = document.createElement('div');
            scanline.className = 'scanline run';
            heroContainer.appendChild(scanline);
        }
    }

    // Smooth scroll for in-page anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY;
                const startPosition = window.scrollY;
                const distance = targetPosition - startPosition;
                const duration = 1000;
                let start = null;

                window.requestAnimationFrame(function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const ease = progress < duration / 2 
                        ? 4 * Math.pow(progress / duration, 3) 
                        : 1 - Math.pow(-2 * progress / duration + 2, 3) / 2;
                    window.scrollTo(0, startPosition + distance * ease);
                    if (progress < duration) window.requestAnimationFrame(step);
                });
            }
        });
    });

    // 4. Stagger Cards & Services adjustments
    document.querySelectorAll('.card-grid').forEach(grid => {
        grid.classList.add('services-grid'); // hook for css
        const cards = grid.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.15}s`;
        });
    });

    // 5. Section Observer adjustments (Stats & CTA)
    const ctaTitles = document.querySelectorAll('.hero:not(.hero-full) .section-title');
    ctaTitles.forEach(title => {
        title.classList.add('cta-reveal-text');
        title.innerHTML = `<span>${title.innerHTML}</span>`;
    });

    const redBtns = document.querySelectorAll('.btn-primary');
    redBtns.forEach(btn => btn.classList.add('btn-shimmer'));

    // Modify header 'Book a Shoot'
    const bookBtn = document.querySelector('.nav-actions .btn-primary');
    if(bookBtn) {
        bookBtn.classList.remove('btn-shimmer'); // Use liquid fill instead
        bookBtn.classList.add('book-shoot');
    }

    // Handle stats counting
    let counted = false;

    // 6. Advanced Cinematic Observer
    const cineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                // Stats Trigger
                if(entry.target.classList.contains('stats-container') && !counted) {
                    counted = true;
                    const counters = entry.target.querySelectorAll('h2.text-accent');
                    counters.forEach(counter => {
                        const originalText = counter.innerText;
                        const targetNum = parseInt(originalText.replace(/[^0-9]/g, '')) || 0;
                        if(targetNum > 0) {
                            let count = 0;
                            const duration = 2000;
                            const increment = targetNum / (duration / 16);
                            const loop = setInterval(() => {
                                count += increment;
                                if(count >= targetNum) {
                                    counter.innerText = originalText;
                                    clearInterval(loop);
                                } else {
                                    counter.innerText = Math.floor(count) + (originalText.includes('K') ? 'K+' : '');
                                }
                            }, 16);
                        }
                    });
                }
                
                // Footer trigger
                if(entry.target.tagName === 'FOOTER') {
                    entry.target.classList.add('visible');
                }

                // Services Title Trigger
                if(entry.target.classList.contains('services-heading-wrapper')) {
                    entry.target.classList.add('visible');
                }
                
                // CTA title trigger
                if(entry.target.querySelector('.cta-reveal-text')) {
                    entry.target.querySelector('.cta-reveal-text').classList.add('visible');
                }
            }
        });
    }, { threshold: 0.2 });

    // Observe Stats
    const statDiv = document.querySelector('section[style*="background: var(--bg-secondary)"] > div') || document.querySelector('section.container > div[style*="box-shadow:"]');
    if(statDiv) {
        statDiv.classList.add('stats-container');
        const cols = statDiv.querySelectorAll('.card-grid > div') || statDiv.querySelectorAll('div > div');
        cols.forEach(col => col.classList.add('stat-item'));
        cineObserver.observe(statDiv);
    }

    // Observe Footer
    cineObserver.observe(document.querySelector('footer'));

    // Observe Services Heading
    const servicesTitle = document.querySelector('.section-title');
    if(servicesTitle && servicesTitle.innerText.includes('Signature')) {
        const wrap = document.createElement('div');
        wrap.className = 'services-heading-wrapper';
        servicesTitle.parentNode.insertBefore(wrap, servicesTitle);
        wrap.appendChild(servicesTitle);
        cineObserver.observe(wrap);
    }

    // Observe CTA Section
    const ctaSection = document.querySelector('.hero:not(.hero-full)');
    if(ctaSection) {
        const ctaOverlay = document.createElement('div');
        ctaOverlay.className = 'cta-overlay';
        ctaSection.insertBefore(ctaOverlay, ctaSection.firstChild);
        cineObserver.observe(ctaSection);
    }

    // 7. Footer Email Magnetism
    const emailBtn = document.querySelector('a[href^="mailto:"]');
    if(emailBtn) {
        emailBtn.classList.add('email-magnet');
        emailBtn.addEventListener('mousemove', (e) => {
            const rect = emailBtn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const dist = e.clientX - centerX;
            const move = Math.max(-6, Math.min(6, dist * 0.1));
            emailBtn.style.transform = `translateX(${move}px)`;
        });
        emailBtn.addEventListener('mouseleave', () => {
            emailBtn.style.transform = `translateX(0)`;
        });
    }

    // 8. Magnetic Button Hover Effect
    const magnets = document.querySelectorAll('.btn-primary, .btn-outline');
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            magnets.forEach(btn => {
                const rect = btn.getBoundingClientRect();
                const btnX = rect.left + rect.width / 2;
                const btnY = rect.top + rect.height / 2;
                
                const distX = e.clientX - btnX;
                const distY = e.clientY - btnY;
                
                // Active area: within 60px of the button boundary
                if (Math.abs(distX) < (rect.width / 2 + 60) && Math.abs(distY) < (rect.height / 2 + 60)) {
                    // Maximum movement translates to X: up to 8px, Y: up to 5px
                    const moveX = (distX / (rect.width / 2 + 60)) * 8; 
                    const moveY = (distY / (rect.height / 2 + 60)) * 5; 
                    
                    btn.classList.add('magnetic-active');
                    btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
                } else {
                    if (btn.classList.contains('magnetic-active')) {
                        btn.classList.remove('magnetic-active');
                        btn.style.transform = '';
                    }
                }
            });
        });
    }

    // 9. Hero Particle System
    const heroCanvas = document.getElementById('hero-particles');
    if (heroCanvas) {
        const ctx = heroCanvas.getContext('2d');
        let width = heroCanvas.width = heroCanvas.offsetWidth;
        let height = heroCanvas.height = heroCanvas.offsetHeight;
        let particles = [];
        
        window.addEventListener('resize', () => {
            width = heroCanvas.width = heroCanvas.offsetWidth;
            height = heroCanvas.height = heroCanvas.offsetHeight;
        });

        // Track local mouse inside hero
        let heroMouseX = -1000;
        let heroMouseY = -1000;
        
        const heroSection = heroCanvas.parentElement;
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroCanvas.getBoundingClientRect();
            // Get local coordinates for the hover bounds
            heroMouseX = e.clientX - rect.left;
            heroMouseY = e.clientY - rect.top;
        });

        heroSection.addEventListener('mouseleave', () => {
            heroMouseX = -1000;
            heroMouseY = -1000;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.r = 1.5 + Math.random() * 1.5; // Size: 1.5 - 3px
                this.opacity = 0.4 + Math.random() * 0.3; // Opacity: 0.4 - 0.7
                this.speedY = 0.2 + Math.random() * 0.5;
                this.phase = Math.random() * Math.PI * 2;
                this.oscillationSpeed = 0.01 + Math.random() * 0.02;
                this.oscillationAmplitude = 0.5 + Math.random() * 1.5;
                this.baseX = this.x;
            }

            update() {
                // Upward drift and sine oscillation
                this.y -= this.speedY;
                this.phase += this.oscillationSpeed;
                this.baseX += Math.sin(this.phase) * this.oscillationAmplitude * 0.1; 
                this.x = this.baseX;

                // Mouse repel logic (120px radius)
                const dx = heroMouseX - this.x;
                const dy = heroMouseY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 120) {
                    const force = (120 - dist) / 120;
                    this.baseX -= (dx / dist) * force * 1.5;
                    this.y -= (dy / dist) * force * 1.5;
                }

                // Respawn at bottom
                if (this.y < -10 || this.x < -10 || this.x > width + 10) {
                    this.y = height + 10;
                    this.baseX = Math.random() * width;
                    this.x = this.baseX;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(227, 6, 19, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Init ~30 tiny particles
        for (let i = 0; i < 30; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }

        animateParticles();
    }
});
