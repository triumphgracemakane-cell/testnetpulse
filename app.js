/**
 * NetPulse Frontend Controller - Zero-Scroll Landing, Rich Content & Free Tiers
 */

// Application State
const state = {
    currentRoute: 'landing', 
    accountType: localStorage.getItem('accountType') || 'INDIVIDUAL',
    role: localStorage.getItem('role') || 'OWNER', 
    userEmail: localStorage.getItem('userEmail') || '',
    userName: localStorage.getItem('userName') || 'Triumph-Grace',
    activeSubPage: 'overview',
    activeIndustrySub: 'dashboard',
    liveInterval: null,
    modalContent: null
};

document.addEventListener('DOMContentLoaded', () => {
    router();
});

function navigate(route) {
    if (state.liveInterval) {
        clearInterval(state.liveInterval);
        state.liveInterval = null;
    }
    state.currentRoute = route;
    state.modalContent = null;
    window.scrollTo(0, 0);
    router();
}

function router() {
    const app = document.getElementById('app');
    app.innerHTML = '';

    switch (state.currentRoute) {
        case 'landing':
            app.innerHTML = renderLandingPage();
            break;
        case 'signup-choice':
            app.innerHTML = renderSignupChoice();
            break;
        case 'signup-form':
            app.innerHTML = renderSignupForm();
            break;
        case 'login':
            app.innerHTML = renderLoginPage();
            break;
        case 'verify':
            app.innerHTML = renderVerifyPage();
            break;
        case 'dashboard':
            if (state.accountType === 'INDIVIDUAL') {
                app.innerHTML = renderIndividualLayout();
                initIndividualDashboard();
            } else {
                app.innerHTML = renderIndustryLayout();
                initIndustryDashboard();
            }
            break;
        default:
            app.innerHTML = renderLandingPage();
    }
    lucide.createIcons();
}

// ==================== 1. ZERO-SCROLL LANDING PAGE ====================
function renderLandingPage() {
    return `
        <div class="relative h-screen w-screen text-slate-900 overflow-hidden flex flex-col justify-between bg-slate-100" style="background-image: url('IMG2.jpg'); background-size: cover; background-position: center; background-repeat: no-repeat;">
            <!-- Light Glass Overlay for Contrast -->
            <div class="absolute inset-0 bg-slate-50/90 backdrop-blur-[2px] pointer-events-none"></div>

            <!-- Top Header Navbar -->
            <header class="relative z-20 w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div class="flex items-center space-x-3 cursor-pointer" onclick="navigate('landing')">
                    <img src="logo.jpg" alt="NetPulse Logo" class="w-10 h-10 rounded-xl object-cover shadow-sm border border-slate-300">
                    <span class="text-2xl font-bold tracking-tight text-slate-900">NetPulse</span>
                </div>
                
                <nav class="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
                    <button onclick="openModal('features')" class="hover:text-slate-900 transition flex items-center gap-1.5"><i data-lucide="zap" class="w-4 h-4 text-sky-600"></i> Features</button>
                    <button onclick="openModal('pricing')" class="hover:text-slate-900 transition flex items-center gap-1.5"><i data-lucide="tag" class="w-4 h-4 text-emerald-600"></i> Pricing (Free)</button>
                    <button onclick="openModal('docs')" class="hover:text-slate-900 transition flex items-center gap-1.5"><i data-lucide="book-open" class="w-4 h-4 text-amber-600"></i> Docs</button>
                </nav>

                <div class="flex items-center space-x-3">
                    <button onclick="navigate('login')" class="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium px-4 py-2 rounded-xl text-sm shadow-sm transition">Login</button>
                    <button onclick="navigate('signup-choice')" class="bg-sky-600 hover:bg-sky-500 text-white font-medium px-4 py-2 rounded-xl text-sm shadow-md shadow-sky-600/20 transition">Get Started Free</button>
                </div>
            </header>

            <!-- Hero Main Section -->
            <section class="relative z-20 max-w-5xl mx-auto px-6 text-center my-auto">
                <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 text-xs font-semibold text-sky-600 mb-4 border border-sky-200">
                    <span class="w-2 h-2 rounded-full bg-sky-600 animate-ping"></span> Real-Time Telemetry & Network Diagnostics
                </div>
                <h1 class="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                    Instant Network Intelligence <br>In Your Pocket
                </h1>
                <p class="text-sm sm:text-base text-slate-600 mb-8 max-w-2xl mx-auto font-normal leading-relaxed">
                    Monitor latency, packet loss, bandwidth, and CPU utilization live. Completely free infrastructure monitoring built for modern engineers and individuals.
                </p>
                <div class="flex flex-wrap justify-center gap-4">
                    <button onclick="navigate('signup-choice')" class="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-sky-600/20 transition flex items-center space-x-2 text-sm">
                        <i data-lucide="shield-check" class="w-4 h-4"></i><span>Start Monitoring Free</span>
                    </button>
                    <button onclick="openModal('features')" class="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-6 py-3.5 rounded-xl transition text-sm flex items-center space-x-2 shadow-sm">
                        <i data-lucide="info" class="w-4 h-4 text-slate-500"></i><span>Explore Capabilities</span>
                    </button>
                </div>
            </section>

            <!-- Footer info bar -->
            <footer class="relative z-20 w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 border-t border-slate-200 bg-white/60 backdrop-blur-sm">
                <div class="flex items-center gap-2">
                    <img src="logo.jpg" alt="Logo" class="w-5 h-5 rounded object-cover">
                    <span>© 2026 NetPulse Systems. All rights reserved.</span>
                </div>
                <div class="flex gap-6 mt-2 sm:mt-0">
                    <button onclick="openModal('docs')" class="hover:text-slate-900 transition">Privacy Policy</button>
                    <button onclick="openModal('docs')" class="hover:text-slate-900 transition">Terms of Service</button>
                    <button onclick="openModal('pricing')" class="hover:text-slate-900 transition">100% Free Guarantee</button>
                </div>
            </footer>

            <!-- Modal Overlay -->
            ${state.modalContent ? renderModal() : ''}
        </div>
    `;
}

function openModal(type) {
    state.modalContent = type;
    router();
}

function closeModal() {
    state.modalContent = null;
    router();
}

function renderModal() {
    let title = '';
    let body = '';

    if (state.modalContent === 'features') {
        title = 'NetPulse Core Features & Capabilities';
        body = `
            <div class="grid sm:grid-cols-2 gap-4">
                <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <i data-lucide="activity" class="w-6 h-6 text-sky-600 mb-2"></i>
                    <h4 class="font-bold text-slate-900 text-sm">Live Telemetry Streams</h4>
                    <p class="text-xs text-slate-600 mt-1">Real-time charting of download speed, jitter, ping, and TCP/UDP connections updated every 3 seconds.</p>
                </div>
                <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <i data-lucide="shield" class="w-6 h-6 text-emerald-600 mb-2"></i>
                    <h4 class="font-bold text-slate-900 text-sm">Role-Based Access (RBAC)</h4>
                    <p class="text-xs text-slate-600 mt-1">Granular controls for Admins, NOC Engineers, and Viewers with secure multi-tenant isolation.</p>
                </div>
                <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <i data-lucide="cpu" class="w-6 h-6 text-amber-600 mb-2"></i>
                    <h4 class="font-bold text-slate-900 text-sm">Server & CPU Diagnostics</h4>
                    <p class="text-xs text-slate-600 mt-1">Track server node uptime, hardware health, and resource thresholds instantly.</p>
                </div>
                <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <i data-lucide="file-text" class="w-6 h-6 text-purple-600 mb-2"></i>
                    <h4 class="font-bold text-slate-900 text-sm">Instant PDF & Print Reports</h4>
                    <p class="text-xs text-slate-600 mt-1">Generate automated audit executive summaries with jsPDF and AutoTable in one click.</p>
                </div>
            </div>
        `;
    } else if (state.modalContent === 'pricing') {
        title = '100% Free Tier Pricing Plan';
        body = `
            <div class="text-center p-6 rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 shadow-sm">
                <span class="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-bold uppercase tracking-wider">Forever Free</span>
                <h3 class="text-4xl font-extrabold text-slate-900 mt-4">$0 <span class="text-sm font-normal text-slate-500">/ month</span></h3>
                <p class="text-sm text-slate-600 mt-2">No credit card required. Full access to individual and industry NOC diagnostics.</p>
                <ul class="text-left text-xs text-slate-700 space-y-2 my-6 max-w-sm mx-auto">
                    <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-emerald-600"></i> Unlimited live streaming telemetry</li>
                    <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-emerald-600"></i> Up to 12 monitored nodes & devices</li>
                    <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-emerald-600"></i> PDF Report generator & printer</li>
                    <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-emerald-600"></i> Role-Based Access Control (RBAC)</li>
                </ul>
                <button onclick="navigate('signup-choice'); closeModal();" class="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-3 rounded-xl shadow-md transition text-sm">Get Started Free Now</button>
            </div>
        `;
    } else if (state.modalContent === 'docs') {
        title = 'NetPulse Documentation & Quick Start';
        body = `
            <div class="space-y-4 text-xs text-slate-700">
                <div class="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <h5 class="font-bold text-slate-900 mb-1">1. Account Setup</h5>
                    <p>Choose between <strong>Individual</strong> mode for home Wi-Fi and speed tests, or <strong>Industry (NOC)</strong> mode for team device management.</p>
                </div>
                <div class="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <h5 class="font-bold text-slate-900 mb-1">2. RBAC Permissions</h5>
                    <p>Admins have full write and configuration rights. NOC Engineers can restart nodes and view telemetry. Viewers have read-only report access.</p>
                </div>
                <div class="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <h5 class="font-bold text-slate-900 mb-1">3. Exporting Reports</h5>
                    <p>Navigate to PDF Reports & Print inside your industry dashboard to export professional client audit reports instantly.</p>
                </div>
            </div>
        `;
    }

    return `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div class="max-w-xl w-full bg-white p-6 rounded-2xl border border-slate-200 shadow-2xl relative max-h-[85vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                    <div class="flex items-center gap-2">
                        <img src="logo.jpg" alt="Logo" class="w-6 h-6 rounded object-cover">
                        <h3 class="font-bold text-slate-900 text-lg">${title}</h3>
                    </div>
                    <button onclick="closeModal()" class="text-slate-500 hover:text-slate-900 p-1 rounded-lg bg-slate-100"><i data-lucide="x" class="w-5 h-5"></i></button>
                </div>
                ${body}
            </div>
        </div>
    `;
}

function selectAccountType(type) {
    state.accountType = type;
    localStorage.setItem('accountType', type);
    navigate('signup-form');
}

// ==================== 2. SIGN UP / AUTH ====================
function renderSignupChoice() {
    return `
        <div class="h-screen w-screen flex items-center justify-center p-6 bg-slate-100 overflow-hidden" style="background-image: url('img.jpg'); background-size: cover; background-position: center;">
            <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-[3px] pointer-events-none"></div>
            <div class="relative z-10 max-w-xl w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-2xl">
                <div class="text-center mb-6">
                    <div class="flex justify-center mb-3">
                        <img src="logo.jpg" alt="NetPulse Logo" class="w-12 h-12 rounded-xl object-cover shadow border border-slate-200">
                    </div>
                    <h2 class="text-2xl font-bold text-slate-900">Choose Your Account Type</h2>
                    <p class="text-slate-500 text-xs mt-1">Select how you plan to use NetPulse (100% Free)</p>
                </div>
                <div class="grid sm:grid-cols-2 gap-4 mb-6">
                    <div onclick="selectAccountType('INDIVIDUAL')" class="p-5 border-2 border-slate-200 hover:border-sky-600 rounded-xl cursor-pointer transition flex flex-col items-center text-center bg-slate-50 shadow-sm">
                        <i data-lucide="laptop" class="w-8 h-8 text-sky-600 mb-2"></i>
                        <h4 class="font-bold text-slate-900 text-sm">Individual</h4>
                        <p class="text-[11px] text-slate-500 mt-1">Personal use, home Wi-Fi & laptop speed tests.</p>
                    </div>
                    <div onclick="selectAccountType('INDUSTRY')" class="p-5 border-2 border-slate-200 hover:border-emerald-600 rounded-xl cursor-pointer transition flex flex-col items-center text-center bg-slate-50 shadow-sm">
                        <i data-lucide="building" class="w-8 h-8 text-emerald-600 mb-2"></i>
                        <h4 class="font-bold text-slate-900 text-sm">Industry (NOC)</h4>
                        <p class="text-[11px] text-slate-500 mt-1">Teams, RBAC roles, 12+ node monitoring.</p>
                    </div>
                </div>
                <div class="text-center">
                    <button onclick="navigate('landing')" class="text-xs text-slate-500 hover:text-slate-900 font-medium">← Back to Home</button>
                </div>
            </div>
        </div>
    `;
}

function renderSignupForm() {
    const isIndustry = state.accountType === 'INDUSTRY';
    return `
        <div class="h-screen w-screen flex items-center justify-center p-6 bg-slate-100 overflow-hidden" style="background-image: url('img.jpg'); background-size: cover; background-position: center;">
            <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-[3px] pointer-events-none"></div>
            <div class="relative z-10 max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-2xl">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-2">
                        <img src="logo.jpg" alt="Logo" class="w-7 h-7 rounded-lg object-cover">
                        <h2 class="text-lg font-bold text-slate-900">Create Free Account</h2>
                    </div>
                    <button onclick="navigate('signup-choice')" class="text-xs text-sky-600 font-semibold hover:underline">Change Mode</button>
                </div>
                <form onsubmit="handleSignup(event)" class="space-y-3 text-xs">
                    <div>
                        <label class="block font-semibold uppercase text-slate-500 mb-1">Full Name</label>
                        <input type="text" id="signup-name" required value="${state.userName}" class="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none" placeholder="Triumph-Grace">
                    </div>
                    ${isIndustry ? `
                    <div>
                        <label class="block font-semibold uppercase text-slate-500 mb-1">Company / Organization</label>
                        <input type="text" id="signup-company" class="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none" placeholder="Acme Networks">
                    </div>
                    <div>
                        <label class="block font-semibold uppercase text-slate-500 mb-1">Assigned Role (RBAC)</label>
                        <select id="signup-role" class="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none">
                            <option value="ADMIN">ADMIN (Full Access)</option>
                            <option value="NOC_ENGINEER">NOC Engineer (Monitoring & Diagnostics)</option>
                            <option value="VIEWER">VIEWER (Read-Only Reports)</option>
                        </select>
                    </div>
                    ` : ''}
                    <div>
                        <label class="block font-semibold uppercase text-slate-500 mb-1">Email Address</label>
                        <input type="email" id="signup-email" required class="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none" placeholder="triumph@example.com">
                    </div>
                    <div>
                        <label class="block font-semibold uppercase text-slate-500 mb-1">Password</label>
                        <input type="password" id="signup-pass" required class="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none" placeholder="••••••••">
                    </div>
                    <button type="submit" class="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-3 rounded-xl transition mt-2 shadow-sm">
                        Register Free Account
                    </button>
                </form>
            </div>
        </div>
    `;
}

function handleSignup(e) {
    e.preventDefault();
    state.userEmail = document.getElementById('signup-email').value;
    state.userName = document.getElementById('signup-name').value;
    if (state.accountType === 'INDUSTRY') {
        state.role = document.getElementById('signup-role').value;
    } else {
        state.role = 'OWNER';
    }
    localStorage.setItem('userEmail', state.userEmail);
    localStorage.setItem('userName', state.userName);
    localStorage.setItem('role', state.role);
    navigate('verify');
}

function renderLoginPage() {
    return `
        <div class="h-screen w-screen flex items-center justify-center p-6 bg-slate-100 overflow-hidden" style="background-image: url('img.jpg'); background-size: cover; background-position: center;">
            <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-[3px] pointer-events-none"></div>
            <div class="relative z-10 max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-2xl">
                <div class="text-center mb-6">
                    <div class="flex justify-center mb-3">
                        <img src="logo.jpg" alt="Logo" class="w-12 h-12 rounded-xl object-cover shadow border border-slate-200">
                    </div>
                    <h2 class="text-2xl font-bold text-slate-900">Welcome Back</h2>
                    <p class="text-slate-500 text-xs mt-1">Sign in to your NetPulse dashboard</p>
                </div>
                <form onsubmit="handleLogin(event)" class="space-y-3 text-xs">
                    <div>
                        <label class="block font-semibold uppercase text-slate-500 mb-1">Email Address</label>
                        <input type="email" id="login-email" required class="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none" placeholder="triumph@example.com">
                    </div>
                    <div>
                        <label class="block font-semibold uppercase text-slate-500 mb-1">Password</label>
                        <input type="password" id="login-pass" required class="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none" placeholder="••••••••">
                    </div>
                    <button type="submit" class="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-3 rounded-xl transition mt-2 shadow-sm">
                        Sign In
                    </button>
                </form>
                <div class="text-center mt-4">
                    <p class="text-xs text-slate-500">Don't have an account? <a href="#" onclick="navigate('signup-choice')" class="text-sky-600 font-semibold hover:underline">Sign up free</a></p>
                </div>
            </div>
        </div>
    `;
}

function handleLogin(e) {
    e.preventDefault();
    navigate('dashboard');
}

function renderVerifyPage() {
    return `
        <div class="h-screen w-screen flex items-center justify-center p-6 bg-slate-100 overflow-hidden" style="background-image: url('img.jpg'); background-size: cover; background-position: center;">
            <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-[3px] pointer-events-none"></div>
            <div class="relative z-10 max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-2xl text-center">
                <div class="w-12 h-12 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-sky-200">
                    <i data-lucide="shield-check"></i>
                </div>
                <h2 class="text-xl font-bold text-slate-900 mb-1">Verify Your Email</h2>
                <p class="text-slate-500 text-xs mb-6">Enter demo verification code <span class="text-sky-600 font-mono font-bold">123456</span></p>
                <form onsubmit="handleVerify(event)" class="space-y-4">
                    <input type="text" maxlength="6" required value="123456" class="w-full text-center tracking-widest text-2xl font-mono py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none">
                    <button type="submit" class="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-3 rounded-xl transition text-xs shadow-sm">
                        Confirm & Enter Dashboard
                    </button>
                </form>
            </div>
        </div>
    `;
}

function handleVerify(e) {
    e.preventDefault();
    navigate('dashboard');
}

// ==================== 3. INDIVIDUAL DASHBOARD ====================
function renderIndividualLayout() {
    return `
        <div class="flex h-screen bg-slate-50 overflow-hidden text-slate-800">
            <aside class="w-64 bg-white border-r border-slate-200 flex flex-col justify-between">
                <div>
                    <div class="h-20 flex items-center px-6 border-b border-slate-200 space-x-3">
                        <img src="logo.jpg" alt="Logo" class="w-8 h-8 rounded-lg object-cover">
                        <span class="text-xl font-bold text-slate-900">Net<span class="text-sky-600">Pulse</span></span>
                    </div>
                    <nav class="p-4 space-y-1">
                        <a href="#" onclick="setIndividualSub('overview')" class="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 font-medium text-sm"><i data-lucide="layout-dashboard" class="w-5 h-5"></i><span>My Health</span></a>
                        <a href="#" onclick="setIndividualSub('speed')" class="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 font-medium text-sm"><i data-lucide="gauge" class="w-5 h-5"></i><span>Internet Speed</span></a>
                    </nav>
                </div>
                <div class="p-4 border-t border-slate-200">
                    <button onclick="navigate('landing')" class="w-full flex items-center space-x-2 text-slate-600 hover:bg-slate-100 p-2.5 rounded-xl transition text-sm font-medium">
                        <i data-lucide="log-out" class="w-4 h-4"></i><span>Log Out</span>
                    </button>
                </div>
            </aside>
            <main class="flex-1 overflow-y-auto p-8 bg-slate-50" id="individual-main-content"></main>
        </div>
    `;
}

function setIndividualSub(sub) {
    state.activeSubPage = sub;
    initIndividualDashboard();
}

function initIndividualDashboard() {
    const container = document.getElementById('individual-main-content');
    if (!container) return;

    if (state.liveInterval) { clearInterval(state.liveInterval); state.liveInterval = null; }

    if (state.activeSubPage === 'speed') {
        container.innerHTML = `
            <div class="max-w-4xl mx-auto">
                <h1 class="text-2xl font-bold text-slate-900 mb-6">Internet Speed Test</h1>
                <div class="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
                    <div id="speed-meter" class="w-36 h-36 rounded-full border-4 border-sky-600 mx-auto flex items-center justify-center text-3xl font-extrabold text-sky-600 mb-6 animate-pulse shadow-inner bg-sky-50">
                        94.2 Mb/s
                    </div>
                    <button onclick="runLiveSpeedTest()" class="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition text-sm">Run Live Speed Test</button>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="max-w-6xl mx-auto space-y-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-bold text-slate-900">My Network Health</h1>
                        <p class="text-slate-500 text-xs">Real-time live telemetry stream (${state.userName})</p>
                    </div>
                    <span class="bg-emerald-50 text-emerald-600 font-semibold px-4 py-1.5 rounded-full text-xs border border-emerald-200 flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span> Live Streaming
                    </span>
                </div>
                <div class="grid md:grid-cols-3 gap-6">
                    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"><span class="text-xs font-semibold uppercase text-slate-400">Download Speed</span><h3 id="stat-dl" class="text-2xl font-bold text-slate-900 mt-2">88.4 Mb/s</h3></div>
                    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"><span class="text-xs font-semibold uppercase text-slate-400">Latency</span><h3 id="stat-lat" class="text-2xl font-bold text-emerald-600 mt-2">14 ms</h3></div>
                    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"><span class="text-xs font-semibold uppercase text-slate-400">Packet Loss</span><h3 id="stat-loss" class="text-2xl font-bold text-slate-900 mt-2">0.01%</h3></div>
                </div>
                <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h3 class="font-bold text-lg text-slate-900 mb-4">Live Bandwidth Chart (Updates Every 3s)</h3>
                    <div class="h-72"><canvas id="indLiveChart"></canvas></div>
                </div>
            </div>
        `;
        setTimeout(() => {
            const ctx = document.getElementById('indLiveChart').getContext('2d');
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['T-15s', 'T-12s', 'T-9s', 'T-6s', 'T-3s', 'Now'],
                    datasets: [{
                        label: 'Bandwidth (Mbps)',
                        data: [45, 52, 38, 85, 92, 88],
                        borderColor: '#0284c7',
                        tension: 0.3,
                        fill: true,
                        backgroundColor: 'rgba(2, 132, 199, 0.05)'
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, animation: false }
            });

            state.liveInterval = setInterval(() => {
                const newVal = Math.floor(70 + Math.random() * 30);
                const nowLabel = new Date().toLocaleTimeString();
                chart.data.labels.shift();
                chart.data.labels.push(nowLabel);
                chart.data.datasets[0].data.shift();
                chart.data.datasets[0].data.push(newVal);
                chart.update();

                document.getElementById('stat-dl').innerText = newVal + ' Mb/s';
                document.getElementById('stat-lat').innerText = Math.floor(10 + Math.random() * 8) + ' ms';
            }, 3000);
        }, 100);
    }
    lucide.createIcons();
}

function runLiveSpeedTest() {
    const meter = document.getElementById('speed-meter');
    meter.innerText = 'Testing...';
    setTimeout(() => {
        const speed = (80 + Math.random() * 40).toFixed(1);
        meter.innerText = speed + ' Mb/s';
    }, 2000);
}

// ==================== 4. INDUSTRY NOC DASHBOARD ====================
function renderIndustryLayout() {
    const role = state.role; 
    return `
        <div class="flex h-screen bg-slate-50 overflow-hidden text-slate-800">
            <aside class="w-64 bg-white border-r border-slate-200 flex flex-col justify-between">
                <div>
                    <div class="h-20 flex items-center px-6 border-b border-slate-200 space-x-3">
                        <img src="logo.jpg" alt="Logo" class="w-8 h-8 rounded-lg object-cover">
                        <span class="text-xl font-bold text-slate-900">Net<span class="text-sky-600">Pulse</span></span>
                    </div>
                    <nav class="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)] text-sm font-medium">
                        <a href="#" onclick="setIndustrySub('dashboard')" class="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100"><i data-lucide="layout-dashboard" class="w-5 h-5"></i><span>Dashboard</span></a>
                        <a href="#" onclick="setIndustrySub('topology')" class="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100"><i data-lucide="git-commit" class="w-5 h-5"></i><span>Live Status & Map</span></a>
                        <a href="#" onclick="setIndustrySub('cpu')" class="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100"><i data-lucide="cpu" class="w-5 h-5"></i><span>CPU Utilization</span></a>
                        <a href="#" onclick="setIndustrySub('reports')" class="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100"><i data-lucide="file-text" class="w-5 h-5"></i><span>PDF Reports & Print</span></a>
                        
                        ${role !== 'VIEWER' ? `
                            <a href="#" onclick="setIndustrySub('devices')" class="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100"><i data-lucide="server" class="w-5 h-5"></i><span>Devices Mgmt</span></a>
                        ` : ''}

                        ${role === 'ADMIN' ? `
                            <a href="#" onclick="setIndustrySub('users')" class="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50"><i data-lucide="users" class="w-5 h-5"></i><span>User Access (Admin)</span></a>
                        ` : ''}
                    </nav>
                </div>
                <div class="p-4 border-t border-slate-200">
                    <div class="mb-2 text-xs font-semibold text-slate-500">Role: <span class="text-sky-600 font-bold">${role}</span></div>
                    <button onclick="navigate('landing')" class="w-full flex items-center space-x-2 text-slate-600 hover:bg-slate-100 p-2.5 rounded-xl transition text-sm font-medium">
                        <i data-lucide="log-out" class="w-4 h-4"></i><span>Log Out</span>
                    </button>
                </div>
            </aside>
            <main class="flex-1 overflow-y-auto p-8 bg-slate-50" id="industry-main-content"></main>
        </div>
    `;
}

function setIndustrySub(sub) {
    state.activeIndustrySub = sub;
    initIndustryDashboard();
}

function initIndustryDashboard() {
    const container = document.getElementById('industry-main-content');
    if (!container) return;
    const sub = state.activeIndustrySub || 'dashboard';

    if (state.liveInterval) { clearInterval(state.liveInterval); state.liveInterval = null; }

    if (sub === 'topology') {
        container.innerHTML = `
            <div class="max-w-6xl mx-auto space-y-6">
                <h1 class="text-2xl font-bold text-slate-900">Live Status & Topology Map</h1>
                <div class="bg-white border border-slate-200 rounded-2xl p-6 h-96 flex items-center justify-center relative shadow-sm">
                    <div class="absolute inset-0 flex items-center justify-around px-12">
                        <div class="text-center p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm"><i data-lucide="router" class="w-8 h-8 text-emerald-600 mx-auto mb-2"></i><span class="text-xs font-medium text-slate-700">Core Router</span></div>
                        <div class="h-0.5 w-24 bg-emerald-500 animate-pulse"></div>
                        <div class="text-center p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm"><i data-lucide="server" class="w-8 h-8 text-sky-600 mx-auto mb-2"></i><span class="text-xs font-medium text-slate-700">FastAPI Node</span></div>
                        <div class="h-0.5 w-24 bg-emerald-500 animate-pulse"></div>
                        <div class="text-center p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm"><i data-lucide="database" class="w-8 h-8 text-amber-600 mx-auto mb-2"></i><span class="text-xs font-medium text-slate-700">DB Cluster</span></div>
                    </div>
                </div>
            </div>
        `;
    } else if (sub === 'cpu' || sub === 'dashboard') {
        container.innerHTML = `
            <div class="max-w-6xl mx-auto space-y-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-bold text-slate-900">CPU & Server Telemetry</h1>
                        <p class="text-slate-500 text-xs">Real-time streaming agent diagnostics</p>
                    </div>
                    <span class="bg-emerald-50 text-emerald-600 font-semibold px-4 py-1.5 rounded-full text-xs border border-emerald-200 flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span> Live Streaming Active
                    </span>
                </div>
                <div class="grid md:grid-cols-4 gap-6">
                    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"><span class="text-xs font-semibold text-slate-400 uppercase">Current CPU</span><h3 id="cpu-current" class="text-2xl font-bold text-slate-900 mt-2">24.5%</h3></div>
                    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"><span class="text-xs font-semibold text-slate-400 uppercase">Active Nodes</span><h3 class="text-2xl font-bold text-slate-900 mt-2">12 / 12</h3></div>
                    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"><span class="text-xs font-semibold text-slate-400 uppercase">Uptime</span><h3 class="text-2xl font-bold text-emerald-600 mt-2">99.98%</h3></div>
                    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"><span class="text-xs font-semibold text-slate-400 uppercase">Alerts</span><h3 class="text-2xl font-bold text-slate-900 mt-2">0</h3></div>
                </div>
                <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h3 class="font-bold text-lg text-slate-900 mb-4">Live CPU Utilization Stream</h3>
                    <div class="h-72"><canvas id="industryLiveCpuChart"></canvas></div>
                </div>
            </div>
        `;
        setTimeout(() => {
            const ctx = document.getElementById('industryLiveCpuChart').getContext('2d');
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['T-15s', 'T-12s', 'T-9s', 'T-6s', 'T-3s', 'Now'],
                    datasets: [{
                        label: 'CPU Usage %',
                        data: [22, 29, 25, 34, 21, 24.5],
                        borderColor: '#059669',
                        backgroundColor: 'rgba(5, 150, 105, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, animation: false }
            });

            state.liveInterval = setInterval(() => {
                const newVal = +(20 + Math.random() * 35).toFixed(1);
                const nowLabel = new Date().toLocaleTimeString();
                chart.data.labels.shift();
                chart.data.labels.push(nowLabel);
                chart.data.datasets[0].data.shift();
                chart.data.datasets[0].data.push(newVal);
                chart.update();

                document.getElementById('cpu-current').innerText = newVal + '%';
            }, 3000);
        }, 100);
    } else if (sub === 'reports') {
        container.innerHTML = `
            <div class="max-w-4xl mx-auto space-y-6">
                <h1 class="text-2xl font-bold text-slate-900">PDF Report Generation & Printing</h1>
                <div class="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-4 shadow-sm">
                    <p class="text-slate-600 text-sm">Export verified network audit reports instantly using jsPDF and AutoTable plugins.</p>
                    <div class="flex justify-center gap-4">
                        <button onclick="downloadPDFReport()" class="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-6 py-3 rounded-xl shadow-md flex items-center gap-2 text-sm">
                            <i data-lucide="download" class="w-4 h-4"></i> Download PDF
                        </button>
                        <button onclick="window.print()" class="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-6 py-3 rounded-xl shadow-sm flex items-center gap-2 text-sm">
                            <i data-lucide="printer" class="w-4 h-4"></i> Print Report
                        </button>
                    </div>
                </div>
            </div>
        `;
    } else if (sub === 'devices') {
        if (state.role === 'VIEWER') {
            container.innerHTML = `<div class="p-8 text-center text-red-600 font-bold">Access Denied: Viewers cannot manage devices.</div>`;
            return;
        }
        container.innerHTML = `
            <div class="max-w-6xl mx-auto space-y-6">
                <h1 class="text-2xl font-bold text-slate-900">Devices Management</h1>
                <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase">
                                <th class="pb-3">Device Name</th>
                                <th class="pb-3">IP Address</th>
                                <th class="pb-3">Type</th>
                                <th class="pb-3">Status</th>
                                <th class="pb-3">Action</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 text-sm">
                            <tr><td class="py-3 font-medium text-slate-900">Gateway Router</td><td class="text-slate-600">192.168.1.1</td><td class="text-slate-600">Router</td><td><span class="text-emerald-600 font-semibold">Online</span></td><td><button onclick="alert('Restarting router...')" class="text-xs text-sky-600 hover:underline font-medium">Restart</button></td></tr>
                            <tr><td class="py-3 font-medium text-slate-900">Primary Server</td><td class="text-slate-600">192.168.1.50</td><td class="text-slate-600">Linux Host</td><td><span class="text-emerald-600 font-semibold">Online</span></td><td><button onclick="alert('Restarting server...')" class="text-xs text-sky-600 hover:underline font-medium">Restart</button></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } else if (sub === 'users') {
        if (state.role !== 'ADMIN') {
            container.innerHTML = `<div class="p-8 text-center text-red-600 font-bold">Access Denied: Admin privileges required.</div>`;
            return;
        }
        container.innerHTML = `
            <div class="max-w-6xl mx-auto space-y-6">
                <h1 class="text-2xl font-bold text-slate-900">User Access Management (Admin RBAC)</h1>
                <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <p class="text-sm text-slate-600 mb-4">Manage team permissions and roles across the organization.</p>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <div><h4 class="font-bold text-sm text-slate-900">${state.userEmail}</h4><span class="text-xs text-sky-600 font-semibold">ADMIN</span></div>
                            <span class="text-xs text-slate-500 font-medium">Active</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    lucide.createIcons();
}

function downloadPDFReport() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("NetPulse Industry Network Executive Report", 14, 20);
    doc.setFontSize(10);
    doc.text("Generated: " + new Date().toLocaleString() + " | User Role: " + state.role, 14, 28);
    
    doc.autoTable({
        startY: 35,
        head: [['Metric', 'Status / Value', 'Threshold']],
        body: [
            ['Overall Uptime', '99.98%', '99.9%'],
            ['Average Latency', '14 ms', '< 50 ms'],
            ['Packet Loss', '0.01%', '< 0.1%'],
            ['Active Nodes', '12 / 12 Online', '12 Required']
        ],
    });
    doc.save("NetPulse_Executive_Report.pdf");
}