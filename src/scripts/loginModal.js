document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('login-modal');
    const closeBtn = document.getElementById('close-login-modal');
    const togglePassBtn = document.getElementById('toggle-password-visibility');
    const passInput = document.getElementById('input-password');
    const formLogin = document.getElementById('form-login-sol');
    const modalThemeBtn = document.getElementById('modal-theme-toggle');

    const tabRuc = document.getElementById('tab-ruc');
    const tabDni = document.getElementById('tab-dni');
    const labelTipoDoc = document.getElementById('label-tipo-doc');
    const inputRuc = document.getElementById('input-ruc');
    const containerUsuario = document.getElementById('container-usuario');
    const inputUsuario = document.getElementById('input-usuario');

    let tipoAcceso = 'ruc'; // Por defecto RUC

    // Alternar pestañas RUC / DNI
    if (tabRuc && tabDni) {
        tabRuc.addEventListener('click', () => {
            tipoAcceso = 'ruc';
            tabRuc.className = 'flex-1 rounded-lg py-2 text-xs font-bold transition-all bg-white text-[#0877a7] shadow-sm dark:bg-slate-900 dark:text-sky-400';
            tabDni.className = 'flex-1 rounded-lg py-2 text-xs font-bold transition-all text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white';
            
            if (labelTipoDoc) labelTipoDoc.textContent = 'RUC';
            if (inputRuc) {
                inputRuc.value = '20616288475';
                inputRuc.setAttribute('maxlength', '11');
            }
            if (containerUsuario) containerUsuario.style.display = 'block';
            if (inputUsuario) inputUsuario.required = true;
        });

        tabDni.addEventListener('click', () => {
            tipoAcceso = 'dni';
            tabDni.className = 'flex-1 rounded-lg py-2 text-xs font-bold transition-all bg-white text-[#0877a7] shadow-sm dark:bg-slate-900 dark:text-sky-400';
            tabRuc.className = 'flex-1 rounded-lg py-2 text-xs font-bold transition-all text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white';
            
            if (labelTipoDoc) labelTipoDoc.textContent = 'DNI';
            if (inputRuc) {
                inputRuc.value = '74881174';
                inputRuc.setAttribute('maxlength', '8');
            }
            if (containerUsuario) containerUsuario.style.display = 'none';
            if (inputUsuario) inputUsuario.required = false;
        });
    }

    // Sonido de éxito
    const playSuccessSound = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, ctx.currentTime);
            osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
            osc.start();
            osc.stop(ctx.currentTime + 0.35);
        } catch (e) {
            console.error(e);
        }
    };

    if (!modal) return;

    const openModal = (e) => {
        if (e) e.preventDefault();
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    };

    const closeModal = () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    };

    document.querySelectorAll('a[href="/login"], [data-open-login]').forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    if (togglePassBtn && passInput) {
        togglePassBtn.addEventListener('click', () => {
            const isPassword = passInput.type === 'password';
            passInput.type = isPassword ? 'text' : 'password';
        });
    }

    if (modalThemeBtn) {
        modalThemeBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
        });
    }

    // Submit y redirección a /prueba
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            playSuccessSound();
            closeModal();
            window.location.href = '/prueba';
        });
    }
});