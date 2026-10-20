(() => {
  const form = document.getElementById('passwordForm');
  if (!form) return;
  const button = document.getElementById('changePasswordButton');
  const status = document.getElementById('passwordStatus');
  const config = window.StudyHubAccountApi;
  const enabled = config?.enabled === true && isStudyHubSignedIn();
  form.querySelectorAll('input').forEach(input => { input.disabled = !enabled; });
  button.disabled = !enabled;
  if (enabled) status.textContent = 'Nhập mật khẩu hiện tại và mật khẩu mới để tiếp tục.';
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!enabled || button.disabled) return;
    const current = document.getElementById('currentPassword');
    const next = document.getElementById('newPassword');
    const confirm = document.getElementById('confirmPassword');
    if (next.value !== confirm.value) { status.textContent = 'Mật khẩu xác nhận không khớp.'; confirm.focus(); return; }
    if (next.value === current.value) { status.textContent = 'Mật khẩu mới phải khác mật khẩu hiện tại.'; next.focus(); return; }
    button.disabled = true; status.textContent = 'Đang cập nhật…';
    try {
      const endpoint = new URL(config.passwordEndpoint, location.href);
      if (endpoint.origin !== location.origin) throw new Error('Invalid account endpoint');
      const response = await fetch(endpoint, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: current.value, newPassword: next.value }), signal: AbortSignal.timeout(15000) });
      if (!response.ok) { status.textContent = response.status === 401 || response.status === 403 ? 'Phiên đăng nhập hoặc mật khẩu hiện tại không hợp lệ.' : 'Chưa thể đổi mật khẩu. Vui lòng thử lại.'; return; }
      status.textContent = 'Đã đổi mật khẩu thành công.';
    } catch { status.textContent = 'Không thể kết nối dịch vụ tài khoản. Vui lòng thử lại.'; }
    finally { form.reset(); button.disabled = false; }
  });
  const dialog = document.getElementById('deleteAccountDialog');
  const confirmation = document.getElementById('deleteAccountConfirmation');
  document.getElementById('openDeleteAccount').addEventListener('click', () => {
    document.getElementById('deleteAccountForm').reset();
    document.getElementById('deleteDialogStatus').textContent = '';
    dialog.showModal(); confirmation.focus();
  });
  document.getElementById('cancelDeleteAccount').addEventListener('click', () => dialog.close());
  document.getElementById('deleteAccountForm').addEventListener('submit', event => {
    event.preventDefault();
    if (confirmation.value !== 'DELETE') return;
    try {
      localStorage.removeItem('studyhub-profile-v1');
      sessionStorage.removeItem('studyhub-session');
      location.replace('dashboard.html');
    } catch { document.getElementById('deleteDialogStatus').textContent = 'Không thể xóa hồ sơ vì trình duyệt không cho phép truy cập bộ nhớ.'; }
  });
})();
