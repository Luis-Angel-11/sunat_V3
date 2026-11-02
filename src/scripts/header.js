document.addEventListener('DOMContentLoaded', () => {
	const menuToggle = document.querySelector('[data-menu-toggle]');
	const mobileMenu = document.querySelector('#menu-movil');

	const closeMenu = () => {
		if (!menuToggle || !mobileMenu) return;
		menuToggle.setAttribute('aria-expanded', 'false');
		menuToggle.setAttribute('aria-label', 'Abrir menú');
		mobileMenu.hidden = true;
	};

	menuToggle?.addEventListener('click', () => {
		const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
		menuToggle.setAttribute('aria-expanded', String(!isOpen));
		menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
		if (mobileMenu) mobileMenu.hidden = isOpen;
	});

	mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
			closeMenu();
			menuToggle.focus();
		}
	});

	const initNavigation = () => {
		const navLinks = [...document.querySelectorAll('[data-nav-link]')];
		const navSections = [...new Set(navLinks.map((link) => link.getAttribute('href')))]
			.map((href) => ({ href, section: document.querySelector(href) }))
			.filter((item) => item.section);

		let pendingHref = null;
		let pendingTimer = null;
		let scrollTicking = false;

		const setActiveSection = (href) => {
			navLinks.forEach((link) => {
				if (link.getAttribute('href') === href) {
					link.setAttribute('aria-current', 'location');
				} else {
					link.removeAttribute('aria-current');
				}
			});
		};

		const updateActiveSection = () => {
			if (pendingHref) {
				scrollTicking = false;
				return;
			}

			const nav = document.querySelector('nav[aria-label="Menú principal"]');
			const threshold = (nav?.getBoundingClientRect().height ?? 0) + 24;
			let current = navSections[0]?.href;

			for (const { href, section } of navSections) {
				if (section.getBoundingClientRect().top <= threshold) current = href;
			}

			if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 16) {
				current = navSections.at(-1)?.href ?? current;
			}

			if (current) setActiveSection(current);
			scrollTicking = false;
		};

		const endPendingScroll = () => {
			clearTimeout(pendingTimer);
			pendingTimer = setTimeout(() => {
				pendingHref = null;
				updateActiveSection();
			}, 200);
		};

		navLinks.forEach((link) => {
			link.addEventListener('click', () => {
				pendingHref = link.getAttribute('href');
				setActiveSection(pendingHref);
				endPendingScroll();
			});
		});

		window.addEventListener(
			'scroll',
			() => {
				if (pendingHref) {
					endPendingScroll();
					return;
				}

				if (scrollTicking) return;
				scrollTicking = true;
				requestAnimationFrame(updateActiveSection);
			},
			{ passive: true },
		);
		window.addEventListener('resize', updateActiveSection);
		updateActiveSection();
	};

	initNavigation();
});