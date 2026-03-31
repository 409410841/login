document.addEventListener('DOMContentLoaded', () => {
    const createBtn = document.getElementById('btncreate');
    if(createBtn){
        createBtn.addEventListener('click', () => {
            window.location.href = './create.html';
        });
    }
    const createfrom = document.getElementById('register');
    if(createfrom){
        createfrom.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await response.json();

                if(data.success){
                    console.log("創建成功");
                    window.location.href = './index.html';
                } else {
                    alert('創建失敗：' + data.message);
                }
            } catch(err) {
                alert('登入時發生錯誤');
                console.error(err);
            }
        });
    } else {
        console.error("找不到 login form");
    }
    const loginForm = document.getElementById('login');
    if(loginForm){
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await response.json();

                if(data.success){
                    console.log("登入成功");
                    window.location.href = './dashboard.html';
                } else {
                    alert('登入失敗：' + data.message);
                }
            } catch(err) {
                alert('登入時發生錯誤');
                console.error(err);
            }
        });
    } else {
        console.error("找不到 login form");
    }
});