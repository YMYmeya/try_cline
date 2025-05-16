// 初始化变量
let currentUser = null;
let posts = JSON.parse(localStorage.getItem('posts')) || [];

// DOM元素
const postContent = document.getElementById('post-content');
const postBtn = document.getElementById('post-btn');
const postsContainer = document.getElementById('posts-container');
const usernameSpan = document.getElementById('username');
const loginBtn = document.getElementById('login-btn');

// 初始化页面
function init() {
    renderPosts();
    setupEventListeners();
}

// 设置事件监听
function setupEventListeners() {
    postBtn.addEventListener('click', handlePost);
    loginBtn.addEventListener('click', handleLogin);
}

// 处理发帖
function handlePost() {
    const content = postContent.value.trim();
    if (!content) return;

    if (!currentUser) {
        alert('请先登录');
        return;
    }

    const newPost = {
        id: Date.now(),
        author: currentUser,
        content: content,
        likes: 0,
        comments: [],
        timestamp: new Date().toISOString()
    };

    posts.unshift(newPost);
    savePosts();
    renderPosts();
    postContent.value = '';
}

// 处理登录
function handleLogin() {
    const username = prompt('请输入用户名');
    if (username) {
        currentUser = username;
        usernameSpan.textContent = username;
        loginBtn.textContent = '退出';
        loginBtn.onclick = handleLogout;
    }
}

// 处理退出
function handleLogout() {
    currentUser = null;
    usernameSpan.textContent = '游客';
    loginBtn.textContent = '登录';
    loginBtn.onclick = handleLogin;
}

// 渲染帖子
function renderPosts() {
    postsContainer.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <div class="post-header">
                <strong>${post.author}</strong>
                <small>${new Date(post.timestamp).toLocaleString()}</small>
            </div>
            <div class="post-content">${post.content}</div>
            <div class="post-actions">
                <button onclick="likePost(${post.id})">点赞 (${post.likes})</button>
                <button onclick="commentPost(${post.id})">评论</button>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
}

// 点赞帖子
function likePost(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.likes++;
        savePosts();
        renderPosts();
    }
}

// 评论帖子
function commentPost(postId) {
    const comment = prompt('输入你的评论');
    if (comment && currentUser) {
        const post = posts.find(p => p.id === postId);
        if (post) {
            post.comments.push({
                author: currentUser,
                content: comment,
                timestamp: new Date().toISOString()
            });
            savePosts();
            renderPosts();
        }
    } else if (!currentUser) {
        alert('请先登录');
    }
}

// 保存帖子到本地存储
function savePosts() {
    localStorage.setItem('posts', JSON.stringify(posts));
}

// 初始化应用
document.addEventListener('DOMContentLoaded', init);
// 在终端输入：（PS D:\PycharmProjects\try_cline>） start 1_weiboclone/index.html
// 或者（PS D:\PycharmProjects\try_cline>） start d:/PycharmProjects/try_cline/1_weiboclone/index.html