import Swal from 'sweetalert2';
import { i18n } from 'next-i18next';

const svg = (path: string) =>
	`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

const icons = {
	success: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
	error: svg('<path d="M7 7l10 10M17 7L7 17"/>'),
	question: svg(
		'<path d="M9.5 9a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.9-.9 1.5V14"/><path d="M12 17.5h.01"/>',
	),
};

const Toast = Swal.mixin({
	toast: true,
	position: 'top',
	showConfirmButton: false,
	showClass: { popup: 'auctra-toast-in' },
	hideClass: { popup: 'auctra-toast-out' },
	customClass: {
		container: 'auctra-toast',
		popup: 'auctra-toast-popup',
		icon: 'auctra-toast-icon',
		title: 'auctra-toast-title',
		htmlContainer: 'auctra-toast-text',
	},
	didOpen: (toast) => {
		toast.addEventListener('mouseenter', Swal.stopTimer);
		toast.addEventListener('mouseleave', Swal.resumeTimer);
	},
});

const Modal = Swal.mixin({
	width: 380,
	buttonsStyling: false,
	reverseButtons: true,
	showClass: { popup: 'auctra-swal-in' },
	hideClass: { popup: 'auctra-swal-out' },
	customClass: {
		container: 'auctra-swal',
		popup: 'auctra-swal-popup',
		icon: 'auctra-swal-icon',
		title: 'auctra-swal-title',
		actions: 'auctra-swal-actions',
		confirmButton: 'auctra-swal-btn primary',
		cancelButton: 'auctra-swal-btn ghost',
	},
});

const toast = (
	icon: 'success' | 'error',
	title: string,
	timer: number,
	text?: string,
) => Toast.fire({ icon, iconHtml: icons[icon], title, text, timer });

export const sweetErrorHandling = async (err: any) => {
	toast('error', err.message, 3000);
};

export const sweetTopSuccessAlert = async (msg: string, duration = 2000) => {
	toast('success', msg, duration);
};

export const sweetMixinErrorAlert = async (msg: string, duration = 3000) => {
	toast('error', msg, duration);
};

export const sweetMixinSuccessAlert = async (
	msg: string,
	duration = 2000,
	text?: string,
) => {
	toast('success', msg, duration, text);
};

export const sweetTopSmallSuccessAlert = async (
	msg: string,
	duration = 2000,
	enable_forward = false,
) => {
	toast('success', msg, duration).then(() => {
		if (enable_forward) window.location.reload();
	});
};

export const sweetConfirmAlert = async (msg: string): Promise<boolean> => {
	const response = await Modal.fire({
		icon: 'question',
		iconHtml: icons.question,
		title: msg,
		showCancelButton: true,
		confirmButtonText: i18n?.t('Confirm') ?? 'Confirm',
		cancelButtonText: i18n?.t('Cancel') ?? 'Cancel',
	});
	return response.isConfirmed;
};
